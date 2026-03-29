from os import getenv

BODS_API_KEY = getenv("BUSSIN_BODS_API_KEY")
DB_URL = getenv("BUSSIN_DB_URL")
assert DB_URL is not None
MAPBOX_TOKEN = getenv("BUSSIN_MAPBOX_TOKEN")
ARRIVAL_STOP_ID = getenv("BUSSIN_ARRIVAL_STOP_ID")
# Time to allow for boarding the bus in minutes
BUS_BOARDING_TIME = int(getenv("BUSSIN_BUS_BOARDING_TIME", "2"))
FROOM_ENDPOINT = getenv("BUSSIN_FROOM_ENDPOINT")
