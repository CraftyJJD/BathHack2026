import uuid
from datetime import time
from typing import cast

import gtfs_kit as gk
import pandas as pd
from pandas import DataFrame
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session
from tqdm import tqdm

from bussin_backend.models import (Route, RouteStop, ScheduledStopTime,
                                   ScheduledTrip, Stop)
from bussin_backend.utils import lat_lon_to_point


def _normalize_gtfs_departure(departure_time: str) -> time:
    parts = departure_time.split(":")
    hour = int(parts[0])
    if hour >= 24:
        parts[0] = f"{(hour - 24):02}"
    return time.fromisoformat(":".join(parts))


def gltf_to_db(file_path: str, session: Session):
    feed = gk.read_feed(file_path, dist_units="m")

    stops = cast(DataFrame, feed.stops)
    routes = cast(DataFrame, feed.routes)
    trips = cast(DataFrame, feed.trips)
    stop_times = cast(DataFrame, feed.stop_times)

    if not stops.empty:
        stop_rows = stops[["stop_id", "stop_name", "stop_lat", "stop_lon"]]
        session.execute(
            insert(Stop)
            .values(
                [
                    {
                        "id": r.stop_id,
                        "name": r.stop_name,
                        "location": lat_lon_to_point(r.stop_lat, r.stop_lon),
                    }
                    for r in stop_rows.itertuples(index=False)
                ]
            )
            .on_conflict_do_nothing(index_elements=["id"])
        )

    session.commit()

    route_cols = routes[["route_id", "route_short_name"]]
    trip_cols = trips[["trip_id", "route_id"]]
    st_cols = stop_times[
        ["trip_id", "stop_id", "stop_sequence", "departure_time"]
    ]

    # One row per (route, trip, stop_time); preserves routes order, then trips
    # order within route, then stop_times order within trip (same as nested loops).
    full = route_cols.merge(trip_cols, on="route_id", how="left").merge(
        st_cols, on="trip_id", how="left"
    )

    prev_route_id = object()
    prev_trip_id = object()
    db_route = None
    db_trip = None
    route_stop_ids: dict[int, tuple[str | None, uuid.UUID | None]] = {}

    for row in tqdm(
        full.itertuples(index=False),
        total=len(full),
        desc="routes/trips/stop_times",
    ):
        route_id = row.route_id
        if route_id != prev_route_id:
            db_route = Route(id=route_id, name=row.route_short_name)
            session.add(db_route)
            route_stop_ids = {}
            prev_route_id = route_id
            prev_trip_id = object()

        trip_id = row.trip_id
        if not pd.isna(trip_id) and trip_id != prev_trip_id:
            db_trip = ScheduledTrip(id=trip_id, route=db_route)
            session.add(db_trip)
            prev_trip_id = trip_id

        if pd.isna(row.stop_sequence):
            continue

        seq = int(row.stop_sequence)
        cached_stop_id, cached_route_stop_db_id = route_stop_ids.get(
            seq, (None, None)
        )

        if cached_stop_id != row.stop_id:
            db_id = uuid.uuid4()
            db_route_stop = RouteStop(
                id=db_id,
                route_id=db_route.id,
                stop_id=row.stop_id,
                order_ix=seq,
            )
            session.add(db_route_stop)
            route_stop_ids[seq] = (row.stop_id, db_id)
            cached_route_stop_db_id = db_id

        db_stop_time = ScheduledStopTime(
            dep_time=_normalize_gtfs_departure(row.departure_time),
            route_stop_id=cached_route_stop_db_id,
            scheduled_trip=db_trip,
        )
        session.add(db_stop_time)
