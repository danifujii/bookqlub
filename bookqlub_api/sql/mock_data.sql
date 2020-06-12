INSERT INTO users(full_name, username)
VALUES
    ('Daniel', 'danifu'),
    ('Matt', 'matthew');

INSERT INTO books(title, author, release_date)
VALUES
    ('Brave new world', 'Aldous Huxley', '1932-01-01', 'brave_new_world.jpg'),
    ('The catcher in the rye', 'J. D. Salinger', '1951-07-16', 'the_catcher_in_the_rye.jpg'),
    ('1984', 'George Orwell', '1949-06-08', '1984.jpg'),
    ('Little Fires Everywhere', 'Celeste Ng', '2017-09-12', 'little_fires_everywhere.jpg')
;

INSERT INTO reviews(user_id, book_id, value, comment)
VALUES
    (1, 1, 'EXCELLENT', 'Fantastic book. Must read!'),
    (1, 2, 'GREAT', 'A very fun read.'),
    (2, 3, 'GOOD', 'It is pretty good. Fun read.');