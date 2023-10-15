create table if not exists "user" (
    id serial primary key,

    first_name varchar(128),
    last_name varchar(128),
    email varchar(256),

    password varchar(2048),

    created_at timestamp,
    last_login timestamp
);


create table if not exists "user_cookie" (
    id serial primary key,
    user_id int,

    value varchar(2048),
    valid_until timestamp,

    constraint user_fk foreign key (user_id) references "user"(id)
);


create table if not exists permission (
    id serial primary key,
    code varchar(512),
    readable_code varchar(512)
);


create table if not exists "group" (
    id serial primary key,
    name varchar(512)
);

create table if not exists group_permission_m2m (
    group_id int,
    permission_id int,

    primary key (group_id, permission_id),
    constraint group_fk foreign key (group_id) references "group"(id),
    constraint permission_fk foreign key (permission_id) references permission(id)
);

create table if not exists user_permission_m2m (
    user_id int,
    permission_id int,

    primary key (user_id, permission_id),
    constraint user_fk foreign key (user_id) references "user"(id),
    constraint permission_fk foreign key (permission_id) references permission(id)
);


create table if not exists user_group_m2m (
    user_id int,
    group_id int,

    primary key (user_id, group_id),
    constraint user_fk foreign key (user_id) references "user"(id),
    constraint group_fk foreign key (group_id) references "group"(id)
);


create unique index value_idx on user_cookie(value);