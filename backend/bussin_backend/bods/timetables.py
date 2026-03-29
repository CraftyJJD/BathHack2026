import uuid
from collections import defaultdict
from datetime import time
from typing import cast

import gtfs_kit as gk
import pandas as pd
from pandas import DataFrame
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.orm import Session
from tqdm import tqdm

from bussin_backend.models import (
    Route,
    RouteStop,
    ScheduledStopTime,
    ScheduledTrip,
    Stop,
)
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
    routes = routes[routes["route_short_name"] == "U2"]
    trips = cast(DataFrame, feed.trips)
    calendars = cast(DataFrame, feed.calendar)
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

    trip_ids_by_route: dict[object, list[tuple[object, object]]] = defaultdict(list)
    for route_id, trip_id, service_id in zip(
        trips["route_id"], trips["trip_id"], trips["service_id"], strict=True
    ):
        if pd.notna(route_id) and pd.notna(trip_id):
            trip_ids_by_route[route_id].append((trip_id, service_id))

    st_cols = ["trip_id", "stop_id", "stop_sequence", "departure_time"]
    st = stop_times[st_cols].copy()
    st.sort_values("trip_id", kind="mergesort", ignore_index=True, inplace=True)

    trip_spans: dict[object, tuple[int, int]] = {}
    if not st.empty:
        tcol = st["trip_id"].to_numpy()
        nst = len(tcol)
        start = 0
        for i in range(1, nst + 1):
            if i == nst or tcol[i] != tcol[start]:
                trip_spans[tcol[start]] = (start, i)
                start = i

    for route in tqdm(
        routes.itertuples(index=False),
        total=len(routes),
        desc="routes",
    ):
        route_id = route.route_id
        db_route = Route(id=route_id, name=route.route_short_name)
        session.add(db_route)
        # (stop_id, order_ix) -> RouteStop id; avoids duplicates when another trip
        # uses a different stop at the same sequence and later trips revisit the first.
        route_stop_ids: dict[tuple[str, int], uuid.UUID] = {}

        for trip_id, service_id in trip_ids_by_route.get(route_id, []):
            trip_calendar = calendars[calendars.service_id == service_id]
            for _, calendar in trip_calendar.iterrows():
                if (
                    calendar.monday == 0
                    or calendar.tuesday == 0
                    or calendar.wednesday == 0
                    or calendar.thursday == 0
                    or calendar.friday == 0
                ):
                    # Ignore the trip if it only runs on weekends
                    continue

            db_trip = ScheduledTrip(id=trip_id, route=db_route)
            session.add(db_trip)

            span = trip_spans.get(trip_id)
            if span is None:
                continue
            s, e = span
            for _, stop_id, stop_sequence, departure_time in st.iloc[s:e].itertuples(
                index=False, name=None
            ):
                if pd.isna(stop_sequence):
                    continue
                seq = int(stop_sequence)
                rs_key = (str(stop_id), seq)
                if rs_key not in route_stop_ids:
                    db_id = uuid.uuid4()
                    db_route_stop = RouteStop(
                        id=db_id,
                        route_id=db_route.id,
                        stop_id=stop_id,
                        order_ix=seq,
                    )
                    session.add(db_route_stop)
                    route_stop_ids[rs_key] = db_id
                cached_route_stop_db_id = route_stop_ids[rs_key]

                db_stop_time = ScheduledStopTime(
                    dep_time=_normalize_gtfs_departure(departure_time),
                    route_stop_id=cached_route_stop_db_id,
                    scheduled_trip=db_trip,
                )
                session.add(db_stop_time)
