CREATE TABLE users (
    id          SERIAL  PRIMARY KEY,
    full_name   VARCHAR NOT NULL,
    username    VARCHAR NOT NULL,
    password    VARCHAR NOT NULL
);

CREATE TABLE books (
    id              SERIAL  PRIMARY KEY,
    title           VARCHAR NOT NULL,
    author          VARCHAR NOT NULL,
    release_date    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    cover_url       VARCHAR
);

CREATE TYPE review AS ENUM ('EXCELLENT', 'GREAT', 'GOOD', 'OK');

CREATE TABLE reviews (
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    value   REVIEW  NOT NULL,
    comment VARCHAR,
    created TIMESTAMP WITHOUT TIME ZONE NOT NULL    DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id),
    PRIMARY KEY(user_id, book_id)
);