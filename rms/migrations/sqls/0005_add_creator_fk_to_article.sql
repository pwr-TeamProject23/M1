alter table article
    add column creator_id int,
    add constraint creator_fk foreign key (creator_id) references "user" (id)
