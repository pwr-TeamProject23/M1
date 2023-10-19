create table if not exists article (
    id serial primary key,
    name varchar(128),
    notes text,
    file_id int,
    created_at timestamp default now(),

    constraint file_fk foreign key (file_id) references file(id)
)