from datetime import time
from typing import List
import uuid

from geoalchemy2 import Geography, Geometry
from sqlalchemy import ForeignKey, Integer, String, Time, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class RouteStop(Base):
    __tablename__ = "route_stop"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    route_id: Mapped[str] = mapped_column(ForeignKey("route.id"), nullable=False)
    stop_id: Mapped[str] = mapped_column(ForeignKey("stop.id"), nullable=False)
    order_ix: Mapped[int] = mapped_column(Integer, nullable=False)

    stop: Mapped["Stop"] = relationship(back_populates="routes")
    route: Mapped["Route"] = relationship(back_populates="stops")
    scheduled_stop_times: Mapped[List["ScheduledStopTime"]] = relationship(
        back_populates="route_stop"
    )


class Route(Base):
    __tablename__ = "route"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    stops: Mapped[List["RouteStop"]] = relationship(
        back_populates="route", order_by=RouteStop.order_ix.asc()
    )
    scheduled_trips: Mapped[List["ScheduledTrip"]] = relationship(
        back_populates="route"
    )


class Stop(Base):
    __tablename__ = "stop"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[Geometry] = mapped_column(Geography("POINT"))
    routes: Mapped[List["RouteStop"]] = relationship(back_populates="stop")


class RealStopTime(Base):
    __tablename__ = "real_stop_times"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    delay_secs: Mapped[int] = mapped_column(Integer, nullable=False)
    scheduled_stop_time_id: Mapped[int] = mapped_column(
        ForeignKey("scheduled_stop_time.id"), nullable=False
    )
    scheduled_stop_time: Mapped["ScheduledStopTime"] = relationship(
        back_populates="real_stop_times"
    )


class ScheduledStopTime(Base):
    __tablename__ = "scheduled_stop_time"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    dep_time: Mapped[time] = mapped_column(Time, nullable=False)

    route_stop_id: Mapped[int] = mapped_column(
        ForeignKey("route_stop.id"), nullable=False
    )
    route_stop: Mapped["RouteStop"] = relationship(
        back_populates="scheduled_stop_times"
    )
    scheduled_trip_id: Mapped[str] = mapped_column(
        ForeignKey("scheduled_trip.id"), nullable=False
    )
    scheduled_trip: Mapped["ScheduledTrip"] = relationship(
        back_populates="scheduled_stop_times"
    )
    real_stop_times: Mapped[List["RealStopTime"]] = relationship(
        back_populates="scheduled_stop_time"
    )


class ScheduledTrip(Base):
    __tablename__ = "scheduled_trip"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    route_id: Mapped[str] = mapped_column(ForeignKey("route.id"), nullable=False)
    route: Mapped["Route"] = relationship(back_populates="scheduled_trips")
    scheduled_stop_times: Mapped[List["ScheduledStopTime"]] = relationship(
        back_populates="scheduled_trip"
    )
