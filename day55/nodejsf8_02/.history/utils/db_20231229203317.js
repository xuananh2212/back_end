const postgres = require('postgres');
module.exports = postgres(
     'postgres://username:password@host:port/database', {
     host: 'localhost',            // Postgres ip address[s] or domain name[s]
     port: 5432,          // Postgres server port[s]
     database: 'fullstack_k11',            // Name of database to connect to
     username: 'postgres',            // Username of database user
     password: 'Tuan123a',            // Password of database user

}
);
