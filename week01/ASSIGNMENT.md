# 1주차 과제 — 개발 환경, JavaScript, Express

**기간** 2026.10.05(월) ~ 10.09(금) 23:59
**브랜치** `Feat/express-basic`
**제출** 내 레포에 PR → 내 `main` 에 머지 → PR 링크를 카카오톡에 제출.

> 모든 작업은 이 `week01/` 폴더 안에서 진행 합니다.
> VSCode 통합 터미널에서 `pwd`(macOS) 또는 `Get-Location`(Windows PowerShell)로 위치가 `.../week01` 인지 확인하세요.

## 0. 시작하기 전에

```bash
git switch main
git pull
git switch -c Feat/express-basic
cd week01
```

## 1. `hello.js`

`hello.js` 를 만들고

```javascript
console.log('Hello, World!');
console.log(1 + 2);
```

```bash
node hello.js
```

`Hello, World!` 와 `3` 이 출력되어야 합니다.

## 2. 연습 문제 — `practice.js`

이 폴더의 `practice.js` 에서 위쪽 함수 4개의 Body를 채워주세요.
아래쪽 채점 코드는 **수정하지 마세요.**

글 하나는 `{ id: 숫자, title: 문자열, author: 문자열 }` 형태의 객체이고, `posts` 는 글 객체의 배열입니다.

| 함수 | 반환값 |
|---|---|
| `findPost(posts, id)` | `id` 가 일치하는 글 객체. 없으면 `null` |
| `searchPosts(posts, keyword)` | 제목에 `keyword` 가 들어간 글들의 배열. 없으면 `[]` (대소문자 구분) |
| `addPost(posts, title, author)` | 새 글을 `posts` 끝에 추가하고 그 글을 반환. `id` 는 지금 배열에서 가장 큰 `id` + 1 (빈 배열이면 `1`) |
| `renderPostList(posts)` | `<ul><li>[1] 제목 (작성자)</li>…</ul>` 형식의 한 줄 문자열 (태그 사이 공백 없음). 빈 배열이면 `<p>글이 없습니다</p>` |

```bash
node practice.js
```

마지막 줄이 `10 / 10 통과` 가 되어야 합니다.

## 3. Express 프로젝트 만들기

```bash
npm init -y
npm install express
```

그리고 **반드시** `.gitignore` 를 이 폴더(`week01/`)에 만들어 주세요.

```
node_modules/
*.db
.env
```

## 4. `app.js`

`/` 라우트는 교육자료의 코드를 참고해주세요. 브라우저에서 `http://localhost:3000` 에 `Hello Express!` 가 출력되어야 합니다.

## 5. [과제] 라우트

### `/photo`

`public/` 폴더에 넣은 사진 1장을 보여주기 (파일명은 영문 소문자)

### `/time`

접속한 시각을 보여주기. 새로고침하면 시각이 바뀌어야 합니다.

### `README.md`

이 폴더의 `README.md` 빈칸을 채워주세요.

## 6. 도전 과제

아래 기능은 선택적 참여이며, 가능한 구현해보시는 것을 추천드립니다.

- [ ] `/posts` 라우트로 `renderPostList` 결과를 브라우저에 띄우기
- [ ] `/time` 이 새로고침마다 갱신되는 이유를 `README.md` 에 2~3줄로 설명
- [ ] `nodemon` 설정해서 `npm run dev` 로 실행
- [ ] 없는 경로로 접속하면 404 페이지를 보여주는 핸들러
- [ ] `/about` 라우트에 자기소개

## 제출 순서 요약

```bash
git status                     # node_modules 없는지 확인
git add .
git commit -m "feat: add express server with photo and time routes"
git push -u origin Feat/express-basic
```

GitHub → **Compare & pull request** → base repository를 **내 레포**로 바꾸기 → Create → **Merge pull request** → PR 링크 제출.
자세한 내용은 레포 루트의 `README.md` 를 참고하세요.
