const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('board.db');

const username = process.argv[2];
const result = db
  .prepare("UPDATE users SET role = 'admin' WHERE username = ?")
  .run(username);

if (result.changes === 1) {
  console.log(`${username} 을(를) 관리자로 바꿨습니다`);
} else {
  console.log(`${username} 사용자가 없습니다`);
}