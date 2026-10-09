# KERT 웹 백엔드 스터디 - 1주차
 
## 실행 방법w
1. 환경 설정(node 설치 필요)
npm init -y
npm install express

2. 서버 실행
 - node app.js
or nodemon(개발용 서버)
 - npm install -D nodemon
 - package.json 의 "scripts" 에 "dev": "nodemon app.js" 추가
 - npm run dev

 브라우저 접속: localhost:3000/

## 구현한 라우트
 / : 홈
 /about : 간단한 자기소개
 /photo : image.jpg 표시
 /time : 접속 시각 표시
 /posts : 포스트 목록 표시

 
## 연습 문제
 10 / 10 통과
 
## (도전) /time 이 새로고침할 때마다 바뀌는 이유
 const accessTime이 '/time' 라우트 안에서 선언되므로 페이지를 새로고침 할 때마다 라우트 안의 코드가 실행되어 시간이 새로 초기화된다.
 