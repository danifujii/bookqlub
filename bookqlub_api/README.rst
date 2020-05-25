============
BookQlub API
============

Book review site API.
Project done to build something I'd like to use and delve into `GraphQL <https://graphql.org/>`_.

Setup
=====

Requirements
------------

- `PostgreSQL <https://www.postgresql.org/>`_
- `Python 3.6 or higher <https://wiki.python.org/moin/BeginnersGuide/Download>`_

Starting backend
----------------

In order to start the backend and get access to the API,
begin by setting up a `virtualenv <https://pypi.org/project/virtualenv/>`_ (or an alternative)
and installing the requirements::

    pip install -r requirements.txt

Then, setup the PostgresSQL database schema by doing::

    createdb bookqlub
    psql -d bookqlub < sql/setup_db.sql

If you'd like some mock data in the database to start with::

    psql -d bookqlub < sql/mock_data.sql

Change the ``db_url`` variable in ``config.cfg`` with the correct credentials to access
the database.

Finally, to start the server::

    export FLASK_APP=bookqlub_api/application.py
    flask run

**Note that this is not meant as a production deployment setup.**

Contributing
============

If you would like to contribute or run the tests, you should also::

    pip install -r requirements_dev.txt
    cd ..
    pre-commit install

In order to run the tests, you should just run::

    pytest
