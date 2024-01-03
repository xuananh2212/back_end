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
     checkEmail: async (email) => {
          const result = await sql`SELECT id FROM users WHERE email = ${email}`;
          return result.length ? true : false;
     },
     insertUser: async (body) => {
          let status = true;
          if (body.status === '1') {
               status = false;
          }
          return sql`INSERT INTO users(name, email, status) VALUES (${body?.name}, ${body?.email}), ${status})`;

     }

}