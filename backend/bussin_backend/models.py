from datetime import datetime
from typing import List

from geoalchemy2 import Geography, Geometry
from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class RouteStop(Base):
    __tablename__ = "route_stop"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement="auto")
    route_id: Mapped[str] = mapped_column(ForeignKey("route.id"), nullable=False)
    stop_id: Mapped[str] = mapped_column(ForeignKey("stop.id"), nullable=False)
    order_ix: Mapped[int] = mapped_column(Integer, nullable=False)

    stop: Mapped["Stop"] = relationship(back_populates="routes")
    route: Mapped["Route"] = relationship(back_populates="stops")
    stop_departures: Mapped[List["StopDeparture"]] = relationship(
        back_populates="route_stop"
    )


class Route(Base):
    __tablename__ = "route"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    stops: Mapped[List["RouteStop"]] = relationship(
        back_populates="route", order_by=RouteStop.order_ix.asc()
    )


class Stop(Base):
    __tablename__ = "stop"

    id: Mapped[str] = mapped_column(String, primary_key=True)
    name: Mapped[str] = mapped_column(String, nullable=False)
    location: Mapped[Geometry] = mapped_column(Geography("POINT"))
    routes: Mapped[List["RouteStop"]] = relationship(back_populates="stop")


class StopDeparture(Base):
    __tablename__ = "stop_departure"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    route_stop: Mapped["RouteStop"] = relationship(back_populates="stop_departures")
    scheduled_dep_time: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    delay_secs: Mapped[int] = mapped_column(Integer, nullable=False)
