# Coax Meet

Coax Meet - is a corporate video conferencing solution that allows users to interact with each other via group video calls.

### Runtime environment

The infrastructure of Coax Meet consists of the following services:
* Coax Meet application
* PostgreSQL database
* AWS SQS Message Broker
* ReactJS frontend
* Celery background processor

![architecture](.docs/level2.png)

### API documentation

API documentation can be found following these links

```shell script
# Swagger documentation
<api_url>/docs
# Swagger redoc documentation
<api_url>/redoc
```

 ### Development environment
 
 Development highly bound to docker, so there is `docker-compose-dev.yml` for development and
run `python manage.py runserver `, `celery ...`  and `daphne ...` by your PyCharm IDE.
In order to run the frontend, you need to install ReactJS dependencies and run `npm start` in the `frontend` directory.
**NOTE** you need to pass environment variable in your PyCharm Run configuration.
We use [Poetry](https://python-poetry.org) for this project.
To install packages simply run `poetry install` right after you configured your environment.

### Test environment
* All external dependencies must be mocked in tests.
* Use `coverage run -m python manage.py test` to measure test coverage. This can be integrated with your PyCharm IDE
* Use `coverage report` to get coverage results.
* Use `flake8` to check following PEP8 rules

### Commands

Run Django dev server

```shell
python manage.py runserver
```

Run daphne dev server

```shell
daphne project.asgi:application --port 8080
```

Run all tests

```shell
python manage.py test
```


#### Celery commands

Run celery and celery beat

```shell
celery -A project worker --beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info
```
