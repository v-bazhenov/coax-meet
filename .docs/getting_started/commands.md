# Commands

## Application commands

Run uvicorn dev server

```shell
python manage.py runserver
```

Run all tests

```shell
python manage.py test
```


## Celery commands

Run celery and celery beat

```shell
celery -A project worker --beat --scheduler django_celery_beat.schedulers:DatabaseScheduler --loglevel=info
```
