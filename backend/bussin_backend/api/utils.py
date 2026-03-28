import requests

from api import MAPBOX_TOKEN


def get_time_a_to_b(start_lat, start_lon, end_lat, end_lon):
    url = f"https://api.mapbox.com/directions/v5/mapbox/walking/{start_lat}%2C{start_lon}%3B{end_lat}%2C{end_lon}?alternatives=false&geometries=geojson&overview=false&steps=false&access_token={MAPBOX_TOKEN}"

    response = requests.get(url)
    content = response.content

    return json.loads(content)["routes"][0]["duration"]
