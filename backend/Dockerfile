FROM node:14

# 앱 디렉토리 생성
WORKDIR /usr/src/app

# 앱 의존성 설치
# package.json과 package-lock.json을 모두 복사합니다
COPY package*.json ./

RUN npm ci

# 앱 소스 복사
COPY . .

# 앱이 사용할 포트
EXPOSE 3000

# 앱 실행
CMD [ "node", "app.js" ]