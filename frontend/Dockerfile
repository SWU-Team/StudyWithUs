# 1. 빌드 스테이지 (Node.js 환경에서 프론트엔드 앱 빌드)
# 경량 Node.js(alpine) 이미지를 사용해 빌드 환경 구성
FROM node:lts-alpine AS build

# 작업 디렉토리를 /app으로 설정
WORKDIR /app

# package.json + lock 파일 먼저 복사 (캐싱 최적화)
COPY package*.json ./

# 의존성 설치
RUN npm install --silent

# 전체 코드 복사
COPY . .

# 프로덕션 환경변수 파일을 .env로 복사
COPY .env.production .env 

# 프로덕션 빌드 (build 폴더 생성)
RUN npm run build

# 2. 배포 스테이지 (Nginx로 정적 파일 서빙)
FROM nginx:stable-alpine

# 빌드 결과물(build 폴더)을 Nginx 정적 파일 경로로 복사
COPY --from=build /app/build /usr/share/nginx/html

# 커스텀 Nginx 설정 파일 복사
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# 컨테이너가 종료되지 않도록 Nginx를 포그라운드 모드로 실행
ENTRYPOINT [ "nginx", "-g", "daemon off;" ]