const express = require('express');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

// 기본 포스트
const posts = [
  { id: 1, title: 'Express 설치했어요', author: 'kim', content: 'npm install express 끝!' },
  { id: 2, title: '서버가 안 켜져요', author: 'lee', content: 'EADDRINUSE 에러가 나요' },
  { id: 3, title: 'EJS 질문', author: 'park', content: '<%= %> 랑 <%- %> 차이가 뭔가요?' }
];

// 함수들
function findPost(posts, id) {
    return posts.find((post) => post.id === id) ?? null;
}

function addPost(posts, title, author, content) {
    const maxId = posts.reduce((max, post) => Math.max(max, post.id), 0);
    const post = { id: maxId + 1, title, author, content };
    posts.push(post);
    return post;
}

// 라우터들
app.get('/', (req, res) => {
  res.redirect('/posts');
});

app.get('/posts', (req, res) => {
    const keyword = req.query.keyword;
    let targetPosts = posts;

    // keyword filtering
    if (keyword){
        targetPosts = posts.filter((post)=> post.title.includes(keyword));
    }

    res.render('list', { posts: targetPosts });
});

app.get('/posts/new', (req, res) => {
    res.render('new');
});

app.get('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const post = findPost(posts, id);
    if (!post) {
        return res.status(404).render('404'); // 404.ejs 
    }
    res.render('detail', { post });
});

app.post('/posts', (req, res) => {
    const { title, author, content } = req.body;
    if (!title || title.trim()=== ''){
        return res.redirect('/new');
    }
    const post = addPost(posts, title, author, content);
    res.redirect(`/posts/${post.id}`);
});

app.post('/posts/:id/delete', (req, res) => {
    const id = Number(req.params.id);
    const index = posts.findIndex((post) => post.id === id);
    if (index !== -1) {
        posts.splice(index, 1);
    }
    res.redirect('/posts');
});

// 존재하지 않는 모든 주소에 대한 404
app.use((req, res) =>{
    res.status(404).render('404');
});

// 실행
app.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});