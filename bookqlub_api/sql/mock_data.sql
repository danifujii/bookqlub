INSERT INTO users(full_name, username)
VALUES
    ('Daniel', 'danifu'),
    ('Matt', 'matthew');

INSERT INTO books(title, author, release_date)
VALUES
    ('Brave new world', 'Aldous Huxley', '1932-01-01'),
    ('The catcher in the rye', 'J. D. Salinger', '1951-07-16'),
    ('1984', 'George Orwell', '1949-06-08');

INSERT INTO reviews(user_id, book_id, value, comment)
VALUES
    (1, 1, 'EXCELLENT', 'Fantastic book. Must read!'),
    (1, 2, 'GREAT', 'A very fun read.'),
    (2, 3, 'GOOD', 'It is pretty good. Fun read.');