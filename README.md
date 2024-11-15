
# 🕶 TrendCore - Fashion Shopping Mall


### &nbsp; 쿠버네티스 기반의 고가용성 패션 쇼핑몰 웹 서비스

&nbsp;

<img src="/frontend/public/images/banner.jpeg" alt="메인 페이지">

&nbsp;

&nbsp;

## 🌐 서비스 링크

&nbsp;

-  **웹사이트**: [https://www.trendcore.store](https://www.trendcore.store)

-  **GitHub**: [https://github.com/web-service-pj/shopping-web](https://github.com/web-service-pj/shopping-web)

&nbsp; 

&nbsp;
 
## 👥 팀원 소개 

&nbsp;

**노형준**
-   Kubernetes 클러스터 설계 및 구축
-   CI/CD 파이프라인 구현
-   모니터링 시스템 구축
-   프론트엔드 개발

&nbsp;

**이진규**
-   백엔드 API 개발
-   데이터베이스 설계 및 구현
-   보안 시스템 구축
-   어드민 시스템 개발

  

&nbsp;

&nbsp;
  

## 🚀 기술 스택

&nbsp;

### Frontend

-  **Framework**: React.js

-  **스타일링**: Tailwind CSS

-  **상태관리**: Redux Toolkit

&nbsp;  

### Backend

-  **Runtime**: Node.js

-  **Framework**: Express.js

-  **Database**: MySQL

&nbsp;  

### DevOps

-  **Container**: Docker

-  **Orchestration**: Kubernetes

-  **CI/CD**:

	- Jenkins

	- ArgoCD

	- Harbor (Container Registry)

	- SonarQube (코드 품질 분석)

-  **Monitoring**:

	- Grafana (메트릭 시각화)

	- Prometheus (메트릭 수집)

	- Loki (로그 수집)

-  **DNS/CDN**: Cloudflare

-  **Infrastructure**: Private Cloud , J-Cloud

  

&nbsp;

&nbsp;
  

## 📌 주요 기능

&nbsp;

### 사용자 인증 (카카오 소셜 로그인)
<img src="/frontend/public/images/auth.png" alt="인증 페이지">

&nbsp;

&nbsp;

### 상품 카테고리별 조회
<img src="/frontend/public/images/men.png" alt="상품 페이지">

&nbsp;

&nbsp;

### 세일 항목
<img src="/frontend/public/images/sale.png" alt="세일 페이지">

&nbsp;

&nbsp;

### 장바구니 기능 / 주문 및 결제 프로세스
<img src="/frontend/public/images/cart.png" alt="장바구니 페이지">

&nbsp;

&nbsp;

### 포인트 충전 및 이메일 인증
<img src="/frontend/public/images/email.png" alt="이메일 인증">

&nbsp;

&nbsp;

### 매장 위치 정보
<img src="/frontend/public/images/map.png" alt="매장 위치 정보">

&nbsp;

&nbsp;

### 관리자 대시보드
<img src="/frontend/public/images/admin.png" alt="관리자 페이지">

&nbsp;

&nbsp;

### 반응형 디자인
<table cellspacing="0" cellpadding="0" style="border-collapse: collapse; border: none; margin: 0; padding: 0;">
<tr style="border: none; margin: 0; padding: 0;">
<td width="50%" style="border: none; margin: 0; padding: 0;">
<img src="/frontend/public/images/mobile1.png" width="100%" alt="모바일 화면1">
</td>
<td width="50%" style="border: none; margin: 0; padding: 0;">
<img src="/frontend/public/images/mobile2.png" width="100%" alt="모바일 화면2">
</td>
</tr>
</table>
  

&nbsp;

&nbsp;

  

## 🏗️ 시스템 아키텍처

&nbsp;

### 전체 아키텍처
<img src="/frontend/public/images/archi.png" alt="전체 아키텍처">
  
 &nbsp;

### 인프라 구성

- 멀티 클러스터 쿠버네티스 환경 구축

- Cloudflare를 통한 도메인 관리 및 SSL/TLS 적용

- Private Cloud 기반 운영

 &nbsp;

 &nbsp;

### 모니터링 시스템
<img src="/frontend/public/images/monitoring.png" alt="모니터링">

- Prometheus를 통한 시스템 메트릭 수집

- Loki를 활용한 중앙화된 로그 관리

- Grafana 대시보드를 통한 통합 모니터링

- 시스템 리소스 사용량

- 애플리케이션 성능 메트릭

- 사용자 트래픽 분석

- 에러 로그 추적

 &nbsp;

 &nbsp;

### CI/CD 파이프라인
<img src="/frontend/public/images/cicd.png" alt="파이프라인">

1. GitHub에 코드 Push

2. Jenkins 빌드 트리거

3. SonarQube 정적 코드 분석

- 코드 품질 검사

- 보안 취약점 스캔

- 테스트 커버리지 분석

4. Harbor에 컨테이너 이미지 푸시

5. ArgoCD를 통한 자동 배포

  

&nbsp;

&nbsp;

  

## 🔧 로컬 개발 환경 설정

&nbsp;

### 필수 요구사항

- Node.js 18.0.0 이상

- npm 8.0.0 이상

- MySQL 8.0 이상

&nbsp;  

### Frontend 설치 및 실행

```bash

# 저장소 클론

git  clone  https://github.com/web-service-pj/shopping-web.git

  

# frontend 디렉토리로 이동

cd  shopping-web/frontend

  

# 의존성 설치

npm  install

  

# 개발 서버 실행

npm  start

```

&nbsp;  

### Backend 설치 및 실행

```bash

# backend 디렉토리로 이동

cd  ../backend

  

# 의존성 설치

npm  install

  

# 환경 변수 설정

cp  .env.example  .env

# .env 파일 수정

  

# 서버 실행

npm  run  dev

```

  

&nbsp;

&nbsp;
  

## 📁 프로젝트 구조

&nbsp;

### Frontend

```

src/

├── components/ # 리액트 컴포넌트

│ ├── admin/ # 관리자 관련 컴포넌트

│ ├── common/ # 공통 컴포넌트

│ └── product/ # 상품 관련 컴포넌트

├── pages/ # 페이지 컴포넌트

└── utils/ # 유틸리티 함수

```

&nbsp;  

### Backend

```

src/

├── config/ # 설정 파일

├── models/ # 데이터베이스 모델

└── routes/ # API 라우트

```

  

&nbsp;

&nbsp;

## 🔄 배포 프로세스

&nbsp;

### Kubernetes 배포 구성

- 프로덕션 환경: 2개의 K8s 클러스터 운영

- 로드 밸런싱 및 고가용성 보장

- Cloudflare를 통한 트래픽 분산

&nbsp;  

### CI/CD 파이프라인 상세

1. 개발자가 GitHub에 코드 푸시

2. Jenkins가 자동으로 빌드 프로세스 시작

3. SonarQube에서 코드 품질 분석 수행

	- 코드 중복 검사

	- 잠재적 버그 탐지

	- 코딩 컨벤션 준수 여부 확인

4. 품질 게이트 통과 시 Docker 이미지 생성

5. Harbor에 이미지 푸시 및 취약점 스캔

6. ArgoCD가 새 버전 감지 및 자동 배포



  

&nbsp;

&nbsp;
  

## 📈 모니터링 및 알림

&nbsp;

### 시스템 모니터링

- Prometheus & Grafana를 통한 실시간 메트릭 모니터링

- Loki를 통한 중앙화된 로그 수집 및 분석

- 커스텀 대시보드를 통한 비즈니스 메트릭 추적

  &nbsp;

### 알림 설정

- 시스템 리소스 임계치 초과 시 알림

- 에러 발생 빈도 모니터링


  

&nbsp;

&nbsp;
  

## 📝 개발 가이드

&nbsp;

### Git 브랜치 전략

-  `main`: QA 브랜치

-  `develop`: 개발 브랜치

- `prod`: 프로덕션 배포 브랜치

&nbsp;

### 커밋 메시지 컨벤션

```

feat: 새로운 기능 추가

fix: 버그 수정

docs: 문서 수정

style: 코드 포맷팅

refactor: 코드 리팩토링

test: 테스트 코드

chore: 빌드 업무 수정

```

  

&nbsp;

&nbsp;
  

## 🔒 보안 설정

&nbsp;

### 인프라 보안

- Private Cloud 내 격리된 환경

- Cloudflare를 통한 DDoS 방어

- 컨테이너 이미지 취약점 스캔

- SonarQube를 통한 보안 취약점 분석

&nbsp;

### 시큐어 코딩 적용

**XSS(Cross Site Scripting) 방지**
* xss-clean 미들웨어 사용
* 사용자 입력값 이스케이핑 처리

**CSRF(Cross Site Request Forgery) 방지**
* CORS 설정을 통한 허용된 도메인만 접근 가능
* API 요청 시 토큰 검증

**SQL Injection 방지**
* Sequelize ORM 사용
* Prepared Statement 적용

**인증 및 인가**
* JWT 토큰 기반 인증
* 접근 권한 검증 미들웨어 구현
* 토큰 만료 시간 설정

**암호화**
* 비밀번호 해싱(crypto)
* HTTPS 적용
* 민감 정보 암호화 저장

**API 보안**
* 요청 제한(Rate Limiting)
* API 키 인증
* 입력값 검증

&nbsp;

    

## 📜 라이선스

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
