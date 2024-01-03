/**
 *  mỗi model tương ứng với 1 table
 *  trong 1 controller có thể có nhiều model.
 * 
 * 
 */
const sql = require('../utils/db');
module.exports = {
     all: (status) => {
          console.log(status);
          let filter = sql``;
          if (status !== undefined) {
               filter = sql`WHERE status=${status}`;
          }
          console.log(filter);
          return sql`SELECT * FROM users ${filter} ORDER BY created_at DESC`
     }
}