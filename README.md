# StudyWithUs

**혼자서 공부하는 게 지치고 외로운 당신을 위한 AI 기반 화상 학습 플랫폼**


## 📌 프로젝트 개요
### 기획 의도
- 혼자 공부하는 자기주도 학습자들이 느끼는 고립감, 집중력 저하, 진도 설계의 어려움을 해소
- 감정 상태와 몰입 상태를 실시간으로 분석하고 반응하는 지능형 학습 동반자 플랫폼의 필요성

### 차별화 포인트
- LLM 기반 감정 분석 및 공감 피드백 제공
- OpenCV를 활용한 화면 집중 감지 및 탈주 경고 시스템
- WebRTC 기반 화상 스터디로 학습 몰입감 및 사회적 연결성 강화
- 학습 일지 기반 AI 진도 추천 기능으로 학습 지속성 향상
- 실시간 채팅 기능을 통한 스터디 간 상호작용 및 피드백 강화

### 주요 기능
- WebRTC 화상 연결 기반 스터디룸
- 학습 일지 작성 및 감정 분석 기반 피드백 제공
- OpenCV 기반 집중 감지 및 자동 탈주 경고 시스템
- WebSocket을 통한 실시간 채팅 및 상호 격려 시스템

기간: 2025.03.04~2025.06.17

## 🧑‍💻 팀원 및 역할

| 이름 (포지션) | 담당 업무 |
|:-------------|:-----|
| 서효석 (Back-end) | 전체 시스템 기획 및 설계, Spring Boot 기반 API 구현, OpenCV 집중 감지 및 WebRTC 실시간 연결 구현, UI/UX, AWS 기반 배포 환경 구성 |
| 이태빈 (AI) | LLM 프롬프트 설계, 학습 일지 감정 분석 및 진도 추천 로직 개발, LoRA 기반 모델 학습 파이프라인 구성, FastAPI 추론 서버 구현 |
| 유창석 (Front-end) | React 기반 UI 개발 (스터디룸, 플래너 등), 실시간 알림 및 장치 상태 UI 구현 |

## 🎯 기술 스택
- **Front-End**: React(18.3.1), HTML5, CSS3, JavaScript(ES6), AXIOS(1.9.7), WebRTC, OpenCV.js, Nginx
- **Back-End**: Java(17), Spring Boot(3.2.11), Python(3.11.5), LLAMA(3.2), WebSocket, JWT, redis(1.2), Fastapi(0.115.5)
- **Database**: MySQL(8.0.37), JPA
- **Video/통신**: WebRTC, STOMP, OpenCV
- **보안 및 인증**: Spring Security, Jasypt, JWT, OAuth2
- **Server & Deployment**: Apache Tomcat, AWS EC2, RDS, S3, Docker
- **Tools & Collaboration**: IntelliJ IDEA(24.3.1), VSCode, Git, GitHub, ERD CLOUD, Swagger, Postman, GitHub Actions

## 🛠 시스템 구조
### 시스템 아키텍처
![image](https://github.com/user-attachments/assets/c01b6ffd-31f1-40bf-a977-4d574b75e839)
### ERD
![image](https://github.com/user-attachments/assets/07814feb-8559-429a-9abf-0307b0323b1d)
### WBS
![image](https://github.com/user-attachments/assets/3896c876-b534-4e04-a40b-d1fd5ef62b76)
### 사이트맵
![image](https://github.com/user-attachments/assets/41e92340-cbc3-4f41-9312-8d71b30369ac)

### 요구사항 분석
**Service**

![image](https://github.com/user-attachments/assets/0b9f410e-5743-4c89-9e79-64c1cfee9d9d)

## 🔍 주요 기능 화면

### 메인 페이지
![image](https://github.com/user-attachments/assets/b19297c0-f05e-4bc9-8d87-a56031060722)

: 스터디룸 목록 조회, 검색, 입장 제한, 페이징, 생성 기능을 포함한 메인 페이지 UI 제공

### 방 입장 시 스터디룸 페이지
 ![image](https://github.com/user-attachments/assets/5bae6315-f45f-4964-9424-1e03fe9dde15)

: WebRTC 기반 실시간 화상 연결, OpenCV 집중 감지 및 자동 퇴장, 채팅·타이머·BGM 등 학습 지원 기능 통합 제공

### 자리비움으로 인한 퇴장 화면
 ![image](https://github.com/user-attachments/assets/ba3387ac-2265-4426-908b-a5c155d121ff)

: OpenCV 기반 얼굴 인식으로 집중 이탈 시 자동 퇴장 및 경고 알림 제공

### 플래너 페이지
 ![image](https://github.com/user-attachments/assets/19793d8d-0d1d-4d33-ab4e-9f941e093f70)

: 캘린더 기반 목표 설정 및 진행률 시각화를 통해 자기주도 학습을 체계적으로 관리하는 플래너 기능 제공

### 다이어리 일기 작성 및 AI 피드백 화면
 ![image](https://github.com/user-attachments/assets/e3ded3dd-abcc-4508-9f60-1648bb9a95d8)

: LLM 기반 감정 분석과 진도 추천을 제공하는 일일 학습 일지 및 공감 피드백 시스템 제공


### 학습 일지 상세 보기 및 AI 피드백 확인 화면
 ![image](https://github.com/user-attachments/assets/8e1658d7-e1b9-4f0d-ad83-3fc877afec53)

: 작성된 학습 일지에 대해 AI 감정 피드백과 자기 평가를 함께 제공하여 정서 회복과 자기효능감 향상을 지원

### 마이페이지 및 학습 통계 시각화 기능
 ![image](https://github.com/user-attachments/assets/c88fb2ef-3116-4cae-b9b7-c1437b2d5088)

: 사용자 프로필과 누적 학습 통계를 시각화하여 자기주도 학습 루틴 관리와 계정 설정을 지원

## 🗂 프로젝트 계획 및 시나리오
### 프로젝트 계획도
![image](https://github.com/user-attachments/assets/c9ca3e26-3c59-402f-8510-031903d21471)
### 서비스 시나리오
![image](https://github.com/user-attachments/assets/0e073f77-22ba-48ef-9edc-8693af67126b)

## 📎 참고 링크
- [노션 문서](https://slow-rose-f01.notion.site/Study-With-Us-END-1ba3aa17a00680ab9922eb080832ab84)
