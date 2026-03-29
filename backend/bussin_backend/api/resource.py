import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
from bussin_backend.api.service import calculate_departure_time, get_time_a_to_b
from bussin_backend.api.errors import NoAvailableDepartureTimeError

app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:5000",
        "https://hot-solid-stingray.ngrok-free.app",
        "http://localhost:5173",
    ],
)


@app.route("/")
def index():
    return jsonify({"message": "i <3 caroline"})


@app.route("/stops/nearest", methods=["GET"])
def get_nearest_stop():
    lat = request.args.get("lat")
    lon = request.args.get("lon")

    return jsonify({"id": "912738912", "lat": 1, "lon": 2})


@app.route("/walking-time", methods=["GET"])
def get_walking_time():
    start_lat = request.args.get("start_lat", type=float)
    start_lon = request.args.get("start_lon", type=float)
    end_lat = request.args.get("end_lat", type=float)
    end_lon = request.args.get("end_lon", type=float)

    return jsonify(
        {"duration_seconds": get_time_a_to_b(start_lat, start_lon, end_lat, end_lon)}
    )


@app.route("/departure-time", methods=["GET"])
def get_departure_time():
    bus_stop_id = request.args.get("bus_stop_id")
    bus_route_id = request.args.get("bus_route_id")
    arrival_time = request.args.get("arrival_time")
    arrival_time = datetime.datetime.fromisoformat(arrival_time)
    start_lat = request.args.get("start_lat", type=float)
    start_lon = request.args.get("start_lon", type=float)

    assert start_lat is not None and start_lon is not None

    try:
        dep_time = calculate_departure_time(
            bus_stop_id,
            bus_route_id,
            arrival_time,
            start_lat,
            start_lon,
        )
    except NoAvailableDepartureTimeError as e:
        return jsonify({"error": "No available departure time"}), 404

    return jsonify(dep_time)


if __name__ == "__main__":
    app.run(port=5000, debug=True)
