import csv
import random
from datetime import datetime, timedelta

from config import DB_URL
from models import (Base, RealStopTime, Route, RouteStop, ScheduledStopTime,
                    ScheduledTrip, Stop)
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, joinedload, sessionmaker

# Create engine once (module-level)
engine = create_engine(DB_URL, echo=False, future=True)  # set True if you want SQL logs

# Create session factory
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


def get_session() -> Session:
    return SessionLocal()


def export_route_to_csv(session, route_id, output_file):
    route_stops = (
        session.query(RouteStop)
        .filter(RouteStop.route_id == route_id)
        .order_by(RouteStop.order_ix)
        .all()
    )

    stop_ids_in_order = [rs.id for rs in route_stops]
    num_stops = len(route_stops)

    trips = (
        session.query(ScheduledTrip)
        .options(
            joinedload(ScheduledTrip.scheduled_stop_times).joinedload(
                ScheduledStopTime.real_stop_times
            ),
            joinedload(ScheduledTrip.scheduled_stop_times).joinedload(
                ScheduledStopTime.route_stop
            ),
        )
        .filter(ScheduledTrip.route_id == route_id)
        .all()
    )

    with open(output_file, "w", newline="") as f:
        writer = csv.writer(f)

        # Header
        header = (
            ["trip_id"]
            + [f"stop_{i+1}_scheduled" for i in range(num_stops)]
            + [f"stop_{i+1}_delay" for i in range(num_stops)]
        )
        writer.writerow(header)

        for trip in trips:

            # Map route_stop_id → ScheduledStopTime
            sst_map = {sst.route_stop_id: sst for sst in trip.scheduled_stop_times}

            scheduled_times = []
            delays = []

            for rs in route_stops:
                sst = sst_map.get(rs.id)

                if sst is None:
                    # Missing data
                    scheduled_times.append(None)
                    delays.append(None)
                    continue

                # Scheduled time
                scheduled_times.append(sst.dep_time)

                # Real delay (take first if multiple)
                if sst.real_stop_times:
                    delay = sst.real_stop_times[0].delay_secs
                else:
                    delay = None

                delays.append(delay)

            row = [trip.id] + scheduled_times + delays
            writer.writerow(row)


def populate_bus_data(session: Session):
    route = Route(id="route_1", name="Demo Route")
    session.add(route)

    stops = []
    route_stops = []

    for i in range(20):
        stop = Stop(
            id=f"stop_{i+1}",
            name=f"Stop {i+1}",
            location="POINT(0 0)",  # dummy geometry
        )
        session.add(stop)
        stops.append(stop)

        rs = RouteStop(route=route, stop=stop, order_ix=i)
        session.add(rs)
        route_stops.append(rs)

    session.flush()  # ensure IDs exist

    base_start_time = datetime(2024, 1, 1, 8, 0, 0)

    for trip_ix in range(5):
        trip = ScheduledTrip(id=f"trip_{trip_ix+1}", route=route)
        session.add(trip)

        # stagger trips every 10 minutes
        trip_start = base_start_time + timedelta(minutes=trip_ix * 10)

        current_time = trip_start

        # delay starts small
        current_delay = random.randint(0, 60)  # seconds

        for i, rs in enumerate(route_stops):

            if i > 0:
                travel_time = random.randint(120, 240)  # 2–4 min
                current_time += timedelta(seconds=travel_time)

            scheduled_time = current_time.time()

            sst = ScheduledStopTime(
                dep_time=scheduled_time, route_stop=rs, scheduled_trip=trip
            )
            session.add(sst)
            session.flush()  # needed for FK

            # random drift (traffic effects)
            drift = random.randint(-10, 30)

            # occasional recovery (bus catches up)
            if random.random() < 0.15:
                drift -= random.randint(10, 40)

            current_delay = max(0, current_delay + drift)

            rst = RealStopTime(delay_secs=current_delay, scheduled_stop_time=sst)
            session.add(rst)

    session.commit()


Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

populate_bus_data(get_session())
export_route_to_csv(get_session(), "route_1", "output.csv")
