# KERT 웹 백엔드 스터디 - 3주차

## 실행 방법

- Node 버전 확인: Node 22.13 이상 (`node --version`)
- 패키지 설치: `npm install express ejs express-session bcryptjs`
- 서버 실행: `npm run dev` (또는 `node app.js`)

## 관리자 계정 만드는 법

1. 사이트에서 관리자로 지정할 계정으로 회원가입 (`/signup`)
2. 터미널에서 아래 명령어를 실행하여 해당 유저의 권한을 관리자로 변경
   `node make-admin.js <아이디>`

## 구현한 라우트

- `GET · POST /signup` : 회원가입 (누구나)
- `GET · POST /login` : 로그인 (누구나)
- `POST /logout` : 로그아웃 (로그인한 사람)
- `GET /posts` : 글 목록 (누구나)
- `GET /posts/:id` : 글 상세 (누구나)
- `GET /posts/new` · `POST /posts` : 글쓰기 화면 및 저장 (로그인한 사람)
- `POST /posts/:id/delete` : 글 삭제 (작성자 · 관리자)
- `GET /admin` : 회원 목록 조회 (관리자)

## 점검 결과

필수 22 / 22 통과

도전 3 / 3 통과

## (도전) 구현한 것

① 내 글 모아보기 — /my
로그인한 사람이 자신이 쓴 글만 목록으로 모아서 볼 수 있도록 구현 (`WHERE user_id = ?`)
② 관리자가 회원 권한 바꾸기 — POST /admin/users/:id/role
관리자 페이지에서 버튼을 눌러 회원의 `role`을 `admin` ↔ `user`로 전환할 수 있도록 구현
③ 댓글 — POST /posts/:id/comments
`comments` 테이블을 생성하여 상세 페이지에서 로그인한 사람만 댓글을 작성하고, 작성된 댓글 목록을 함께 볼 수 있도록 구현
