/**
 *  mỗi model tương ứng với 1 table
 *  trong 1 controller có thể có nhiều model.
 * 
 * 
 */
const sql = require('../utils/db');
module.exports = {
     all: (status) => {
          let filter = '';
          if (status !== undefined) {
               filter = 'WHERE status = ' + status;
          }
          return sql`SELECT * FROM users ${filter} ORDER BY created_at DESC`
     }
}