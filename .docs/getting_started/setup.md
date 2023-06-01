# Setup Project

## Clone the project

At first, you need to clone the project and go to the project folder

```shell
git clone https://github.com/v-bazhenov/coax-meet

cd coax-meet/
```

Create a file `.env` in the root directory and fill it with required env variables.

## Install packages

We're using [Poetry](https://python-poetry.org) package manager

You need to install it in your virtual environment.

To create a new one please run:

```shell
python -m venv venv
source venv/bin/activate
```

Then you can install poetry

```shell
pip install poetry
```

After that you can install all required packages

```shell
poetry install
poetry install --dev
```

## Docker

We're using docker as a container engine, to run postgres, redis, mongodb, and so on, without installing it on local machine.

to run docker for dev purposes you need to run:

```shell
docker-compose -f docker-compose-dev.yml up -d
```

And last but not least you should run your local server:

```shell 
python manage.py runserver
```
