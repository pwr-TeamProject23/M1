create table if not exists migrations (
    id serial primary key,
    name varchar(255) NOT NULL,
    applied_on timestamp default now()
)