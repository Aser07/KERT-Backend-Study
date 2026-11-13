const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');

const app = express();
const db = new DatabaseSync('board.db'); // board.db 파일을 열고, 없으면 새로 만듦

// 데이터베이스 테이블 생성 (users, posts, comments)
db.exec(`
 CREATE TABLE IF NOT EXISTS users (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   username TEXT NOT NULL UNIQUE,
   password TEXT NOT NULL,
   role TEXT NOT NULL DEFAULT 'user'
 );
 CREATE TABLE IF NOT EXISTS posts (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   title TEXT NOT NULL,
   content TEXT NOT NULL,
   user_id INTEGER NOT NULL
 );
 CREATE TABLE IF NOT EXISTS comments (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   content TEXT NOT NULL,
   post_id INTEGER NOT NULL,
   user_id INTEGER NOT NULL
 );
`);

// 뷰 엔진 및 미들웨어 설정
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'kert-week03-secret',
    resave: false,
    saveUninitialized: false,
  })
);

// 모든 템플릿에서 user를 사용할 수 있도록 설정 (로그인 안 했으면 null)
app.use((req, res, next) => {
  res.locals.user = req.session.user ?? null;
  next();
});

// 로그인 확인 미들웨어
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
}

// 관리자 확인 미들웨어
function requireAdmin(req, res, next) {
  if (!req.session.user || req.session.user.role !== 'admin') {
    return res.status(403).send('관리자만 볼 수 있습니다');
  }
  next();
}

// 라우트

app.get('/', (req, res) => {
  res.redirect('/posts');
});

// 1. 회원가입
app.get('/signup', (req, res) => {
  res.render('signup', { error: null });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
  const exists = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  if (exists) {
    return res.render('signup', { error: '이미 있는 아이디입니다' });
  }
  const hash = bcrypt.hashSync(password, 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run(username, hash);
  res.redirect('/login');
});

// 2. 로그인
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.render('login', { error: '아이디 또는 비밀번호가 틀렸습니다' });
  }
  req.session.user = { id: user.id, username: user.username, role: user.role };
  res.redirect('/posts');
});

// 3. 로그아웃
app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/posts');
  });
});

// 4. 글 목록
app.get('/posts', (req, res) => {
  const posts = db.prepare(`
    SELECT posts.id, posts.title, users.username 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    ORDER BY posts.id
  `).all();
  res.render('list', { posts });
});

// 내 글 모아보기
app.get('/my', requireLogin, (req, res) => {
  const posts = db.prepare(`
    SELECT posts.id, posts.title, users.username 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.user_id = ?
    ORDER BY posts.id
  `).all(req.session.user.id);
  res.render('my', { posts });
});

// 5. 글쓰기 화면
app.get('/posts/new', requireLogin, (req, res) => {
  res.render('new');
});

// 6. 글 저장
app.post('/posts', requireLogin, (req, res) => {
  const { title, content } = req.body;
  const result = db.prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)').run(
    title,
    content,
    req.session.user.id
  );
  res.redirect(`/posts/${result.lastInsertRowid}`);
});

// 7. 글 상세 페이지
app.get('/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const post = db.prepare(`
    SELECT posts.id, posts.title, posts.content, posts.user_id, users.username 
    FROM posts 
    JOIN users ON posts.user_id = users.id 
    WHERE posts.id = ?
  `).get(id);
  if (!post) return res.status(404).send('글이 없습니다');

  // 댓글 조회
  const comments = db.prepare(`
    SELECT comments.id, comments.content, users.username 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.post_id = ?
    ORDER BY comments.id
  `).all(id);

  res.render('detail', { post, comments });
});

// 댓글 작성
app.post('/posts/:id/comments', requireLogin, (req, res) => {
  const postId = Number(req.params.id);
  const { content } = req.body;
  db.prepare('INSERT INTO comments (content, post_id, user_id) VALUES (?, ?, ?)').run(
    content,
    postId,
    req.session.user.id
  );
  res.redirect(`/posts/${postId}`);
});

// 8. 글 삭제
app.post('/posts/:id/delete', requireLogin, (req, res) => {
  const id = Number(req.params.id);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
  if (!post) {
    return res.status(404).send('글이 없습니다');
  }
  const me = req.session.user;
  if (post.user_id !== me.id && me.role !== 'admin') {
    return res.status(403).send('내 글만 삭제할 수 있습니다');
  }
  db.prepare('DELETE FROM comments WHERE post_id = ?').run(id);
  db.prepare('DELETE FROM posts WHERE id = ?').run(id);
  res.redirect('/posts');
});

// 9. 관리자 페이지
app.get('/admin', requireAdmin, (req, res) => {
  const users = db.prepare('SELECT id, username, role FROM users ORDER BY id').all();
  res.render('admin', { users });
});

// 회원 권한 바꾸기(관리자)
app.post('/admin/users/:id/role', requireAdmin, (req, res) => {
  const userId = Number(req.params.id);
  
  // 현재 사용자의 role을 조회하여 반전시킴
  const targetUser = db.prepare('SELECT role FROM users WHERE id = ?').get(userId);
  if (!targetUser) {
    return res.status(404).send('사용자가 없습니다');
  }

  const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(newRole, userId);
  
  res.redirect('/admin');
});

// 서버 실행
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});