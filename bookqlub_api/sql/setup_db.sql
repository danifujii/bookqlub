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
    release_date    TIMESTAMP WITHOUT TIME ZONE,
    cover_url       VARCHAR,
    suggestion      BOOLEAN     DEFAULT TRUE,
    title_tsv       TSVECTOR
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

CREATE TABLE backlogs (
    user_id INTEGER NOT NULL,
    book_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (book_id) REFERENCES books (id),
    PRIMARY KEY(user_id, book_id)
)

CREATE TRIGGER tsvectorupdate
    BEFORE INSERT OR UPDATE
    ON books FOR EACH ROW
    EXECUTE PROCEDURE tsvector_update_trigger(title_tsv, 'pg_catalog.english', title);

CREATE INDEX books_tsv_index ON books USING GIST (title_tsv);
