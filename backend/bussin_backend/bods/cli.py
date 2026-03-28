import click
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from bussin_backend.bods.timetables import gltf_to_db
from bussin_backend.config import DB_URL

engine = create_engine(DB_URL, echo=False)


@click.group()
def cli():
    pass


@click.command()
@click.option("--path", help="Path to GLTF zip file to save to the DB")
def cli_gltf_to_db(path: str):
    with Session(engine) as session:
        gltf_to_db(path, session)
        session.commit()


cli.add_command(cli_gltf_to_db, "gltf-to-db")

if __name__ == "__main__":
    cli()
