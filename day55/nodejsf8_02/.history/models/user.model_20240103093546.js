/**
 *  mỗi model tương ứng với 1 table
 *  trong 1 controller có thể có nhiều model.
 * 
 * 
 */
const sql = require('../utils/db');
module.exports = {
     all: (status, keyword) => {
          let filter = sql`WHERE name IS NOT NULL`;

          if (status !== undefined) {
               filter = sql`${filter} AND status = ${status}`;
          }
          if (keyword?.length) {
               filter = sql`${filter} AND (LOWER(name) LIKE ${"%" + keyword + "%"
                    } OR LOWER(email) LIKE ${"%" + keyword + "%"})`;
          }

          return sql`SELECT * FROM users ${filter} ORDER BY created_at DESC`;
     },
     inforUser: (id) => {
          return sql`SELECT * FROM users WHERE id = ${id}`;
     },
     checkEmail: async (email) => {
          const result = await sql`SELECT id FROM users WHERE email = ${email}`;
          return result.length ? true : false;
     },
     checkEmailWhenEdit: async (id, email) => {

          const result = await sql`SELECT id FROM users WHERE email = ${email}`;
          if (!result.length) {
               return true;
          }
          if (+id === +result[0].id) {
               return true;
          }
          return false;

     }
     ,
     insertUser: async (data) => {
          const { name, email, status } = data;
          return sql`INSERT INTO users(name, email, status) VALUES (${name}, ${email}, ${status})`;

     },
     updatedUser: async (id, data) => {
          const { name, email, status } = data;
          return sql`UPDATE users SET  status = ${status} , name= ${name}, email=${email} , created_at=NOW() WHERE id = ${id}`;
     },
     deleteUser: (id) => {
          return sql`DELETE FROM users WHERE id = ${id}`;
     }

}