from flask import Flask, jsonify, request
import json
import os
import requests

from api.utils import get_time_a_to_b

app = Flask(__name__)


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

    return jsonify({"duration_seconds": get_time_a_to_b(start_lat, start_lon, end_lat, end_lon)})

length of journey
    input = user location, intend arrival time
    output = tie to leave house


app.run(port=5000, debug=True)
