create database if not exists jwt_auth;
use jwt_auth;

drop database jwt_auth;

create table roles(
role_id int primary key auto_increment,
role_name varchar(20)
);
create table users(
user_id int primary key auto_increment,
first_name varchar(100) not null,
last_name varchar(100) not null,
user_name  varchar(100) not null,
email varchar(50) not null ,
password varchar(100) not null,
role_id int not null,

foreign key (role_id) references roles(role_id)
);   


