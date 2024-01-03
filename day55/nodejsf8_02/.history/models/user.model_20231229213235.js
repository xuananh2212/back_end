/**
 *  mỗi model tương ứng với 1 table
 *  trong 1 controller có thể có nhiều model.
 * 
 * 
 */
const sql = require('../utils/db');
module.exports = {
     all: () => {
          return sql`SELECT * FROM users ORDER BY created_at DESC`
     }
}