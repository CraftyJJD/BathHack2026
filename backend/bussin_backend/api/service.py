import datetime
import json
import requests
from geoalchemy2.shape import to_shape
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session

from bussin_backend.api.errors import NoAvailableDepartureTimeError
from bussin_backend.config import ARRIVAL_STOP_ID, DB_URL, MAPBOX_TOKEN
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
    walking_time = get_time_a_to_b(start_lat, start_lon, bus_stop_id)
    return {
        "bus_departure_time": bus_departure_time,
        "walking_time": walking_time,
        "departure_time": bus_departure_time + walking_time,
    }
