import datetime
import json
from math import floor
import random
import requests
from geoalchemy2.shape import to_shape
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from bussin_backend.api.errors import NoAvailableDepartureTimeError
from bussin_backend.config import (
    ARRIVAL_STOP_ID,
    BUS_BOARDING_TIME,
    DB_URL,
    FROOM_ENDPOINT,
    MAPBOX_TOKEN,
)
from bussin_backend.models import RouteStop, ScheduledStopTime, Stop

engine = create_engine(DB_URL, echo=False)

_REF_DATE = datetime.date(2000, 1, 1)


def _seconds_between_times(a: datetime.time, b: datetime.time) -> float:
    da = datetime.datetime.combine(_REF_DATE, a)
    db = datetime.datetime.combine(_REF_DATE, b)
    return abs((da - db).total_seconds())


def calculate_bus_departure_time(
    bus_stop_id: str, bus_route_id: str, arrival_time: datetime.datetime
):
    with Session(engine) as session:
        arrival_route_stop = session.scalar(
            select(RouteStop).where(
                RouteStop.stop_id == ARRIVAL_STOP_ID, RouteStop.route_id == bus_route_id
            )
        )

        allowed_arrival_times = list(
            session.scalars(
                select(ScheduledStopTime).where(
                    ScheduledStopTime.route_stop_id == arrival_route_stop.id,
                    ScheduledStopTime.dep_time <= arrival_time.time(),
                )
            )
        )

        if len(allowed_arrival_times) == 0:
            raise NoAvailableDepartureTimeError

        closest_arrival_time = min(
            allowed_arrival_times,
            key=lambda x: _seconds_between_times(x.dep_time, arrival_time.time()),
        )

        for stop_time in closest_arrival_time.scheduled_trip.scheduled_stop_times:
            if stop_time.route_stop.stop_id != bus_stop_id:
                continue

            return stop_time.dep_time


def get_time_a_to_b(start_lat: float, start_lon: float, bus_stop_id: str):
    with Session(engine) as session:
        bus_stop = session.scalar(select(Stop).where(Stop.id == bus_stop_id))
        bus_stop_loc = to_shape(bus_stop.location)
        end_lat = bus_stop_loc.y
        end_lon = bus_stop_loc.x

        response = requests.get(
            f"https://api.mapbox.com/directions/v5/mapbox/walking/{start_lon}%2C{start_lat}%3B{end_lon}%2C{end_lat}",
            params={
                "access_token": MAPBOX_TOKEN,
                "alternatives": "false",
                "geometries": "geojson",
                "overview": "false",
                "steps": "false",
            },
        )
        return response.json()["routes"][0]["duration"]


def get_campus_traffic(around_time: datetime.datetime):
    from_time = around_time.replace(tzinfo=datetime.timezone.utc) - datetime.timedelta(
        minutes=60
    )
    to_time = around_time.replace(tzinfo=datetime.timezone.utc) + datetime.timedelta(
        minutes=60
    )

    response = requests.get(
        FROOM_ENDPOINT + "/stats/traffic",
        params={
            "from": from_time.isoformat(),
            "to": to_time.isoformat(),
        },
    )
    return response.json()["proportion_rooms_in_use"]


def get_delay_factor(bus_departure_time: datetime.datetime, bus_stop_id: str):
    """
    Call the ML inference endpoint to determine the delay likelihood for the given bus departure time and bus stop id.
    Returns the estimated/average delay time in minutes.
    """

    # Polyfill for now
    return random.choices([0, 5, 10, 15, 20], weights=[0.3, 0.2, 0.2, 0.2, 0.1])[0]


def calculate_departure_time(
    bus_stop_id: str,
    bus_route_id: str,
    arrival_time: datetime.datetime,
    start_lat: float,
    start_lon: float,
):
    bus_departure_time = calculate_bus_departure_time(
        bus_stop_id, bus_route_id, arrival_time
    )
    bus_departure_time = datetime.datetime.combine(
        datetime.date.today(), bus_departure_time
    )
    bus_departure_time = bus_departure_time - datetime.timedelta(
        seconds=BUS_BOARDING_TIME * 60
    )

    walking_time = floor(get_time_a_to_b(start_lat, start_lon, bus_stop_id))
    departure_time = bus_departure_time - datetime.timedelta(seconds=walking_time)

    campus_traffic = get_campus_traffic(arrival_time)
    campus_traffic_adjustment = 0
    if campus_traffic > 0.6:
        departure_time = departure_time - datetime.timedelta(minutes=10)
        campus_traffic_adjustment = 10

    delay_factor = get_delay_factor(bus_departure_time, bus_stop_id)
    departure_time = departure_time - datetime.timedelta(minutes=delay_factor)

    return {
        "bus_departure_time": bus_departure_time.time().isoformat(),
        "walking_time": floor(walking_time / 60),
        "boarding_time_mins": BUS_BOARDING_TIME,
        "departure_time": departure_time.time().isoformat(),
        "campus_traffic_adjustment": campus_traffic_adjustment,
        "campus_traffic": campus_traffic,
        "estimated_delay": delay_factor,
    }
