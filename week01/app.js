const express = require('express');
const path = require('path');

// renderPostList 가져오기
const { renderPostList } = require('./practice');

const app = express();
const PORT = 3000;

// 포스트 생성 함수
function makePosts() {
  return [
    { id: 1, title: 'Express 설치했어요', author: 'kim' },
    { id: 2, title: '서버가 안 켜져요', author: 'lee' },
    { id: 3, title: 'Express 라우트 질문', author: 'kim' },
    { id: 4, title: 'node_modules 커밋해버림', author: 'park' },
  ];
}


// 라우트
app.get('/', (req, res) => {
    res.send('<h1>Hello Express!</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>안녕하세요.</h1><p>저는 김의진입니다. KERT 벡엔드 스터디 1기 화이팅!</p>');
    // 도전과제 : 자기 소개
});

// 과제
app.get('/photo', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'image.jpg'));
});

app.get('/time', (req, res) => {
    const accessTime = new Date().toLocaleString("ko-KR", {timeZone: "Asia/Seoul"});
    res.send(`
        <h2>접속 시각</h2>
        <p>${accessTime}</p>`)
});

// 도전 과제
app.get('/posts', (req, res) => {
    const posts = makePosts();
    res.send(renderPostList(posts));
});

// 404 핸들러
app.use((req, res, next) => {
    // 404 상태 코드와 함께 메시지 전송
    res.status(404).send('페이지를 찾을 수 없습니다. 주소를 다시 확인해 주세요. (404 Not Found)');
});

// 실행
app.listen(PORT, () => {
console.log(`서버 실행 중: http://localhost:${PORT}`);
});

