create table if not exists "file" (
    id serial primary key,
    name varchar(255),
    path varchar(512),
    uploaded_at timestamp
);
