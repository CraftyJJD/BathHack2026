from os import getenv

BODS_API_KEY = getenv("BUSSIN_BODS_API_KEY")
DB_URL = getenv("BUSSIN_DB_URL")
assert DB_URL is not None
