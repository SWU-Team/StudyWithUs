# StudyWithUs
> 화상 공유, 얼굴 인식, 플래너, AI 회고 등 학습에 필요한 기능을 통합한 몰입형 온라인 스터디 플랫폼

## 📌 프로젝트 개요
### 기획 의도
- 혼자 공부하는 자기주도 학습자들이 느끼는 **고립감, 집중력 저하, 학습 설계의 어려움**을 해소
- AI 피드백과 집중 감지 기능을 통해 몰입을 유지하고, 학습 지속을 돕는 시스템이 요구됨

### 차별화 포인트
- **LLM 기반 감정 분석** 및 공감 피드백 제공
- **OpenCV 기반 얼굴 인식**을 활용한 화면 집중 감지 및 탈주 경고 시스템
- **WebRTC 기반 화상 스터디룸**으로 몰입감 및 사회적 연결성 강화
- **학습 일지 기반 AI 진도 추천** 기능으로 장기 학습 지속성 향상

### 주요 기능
- WebRTC 화상 연결 기반 스터디룸
- 학습 일지 작성 및 감정 분석 기반 피드백 제공
- OpenCV 기반 집중 감지 및 자동 탈주 경고 시스템
- WebSocket을 통한 실시간 채팅
  
기간: 2025.03.04~2025.06.17

## 🧑‍💻 팀원 및 역할

| 이름 (포지션) | 담당 업무 |
|:-------------|:-----|
| 서효석 (FullStack) | 전체 시스템 기획 및 설계, RESTful API 구현, OpenCV 집중 감지 및 WebRTC 실시간 연결 구현, UI/UX, AWS 기반 배포 환경 구성 |
| 이태빈 (AI) | LLM 프롬프트 설계, 학습 일지 감정 분석 및 진도 추천 로직 개발, LoRA 기반 모델 학습 파이프라인 구성, FastAPI 추론 서버 구현 |
| 유창석 (FrontEnd) | React 기반 UI 개발 (스터디룸, 플래너 등), 실시간 알림 및 장치 상태 UI 구현 |

## 🎯 기술 스택
![image](https://github.com/user-attachments/assets/e9cf075a-1a35-45d4-ac70-48d8b37864f7)

<br>

## 🛠 시스템 구조
### 시스템 아키텍처
- Docker와 AWS를 통한 CI/CD 파이프라인 구성
![image](https://github.com/user-attachments/assets/6a6c06ab-7d3b-4dab-bf9b-b6a0178a2ce4)

---
### ERD
![image](https://github.com/user-attachments/assets/e0be57e8-36af-41e8-9618-1b5d48b4bad9)

---
### WBS
![image](https://github.com/user-attachments/assets/bf621668-ac4b-4471-b3f9-2176c8038c07)

---
### 요구사항 분석
![image](https://github.com/user-attachments/assets/466f79c3-8bb6-4357-9fbd-ac900e691a36)

---
### 프로젝트 계획도
![image](https://github.com/user-attachments/assets/c9ca3e26-3c59-402f-8510-031903d21471)

---

<br>

## 🔍 주요 기능 화면

### 1) 로그인/회원가입
- OAuth2.0 카카오, 구글 지원<br>
 -> 프론트는 하이퍼링크로 백엔드에 소셜 로그인 요청<br>
 -> 백엔드에서 외부 소셜 로그인 서비스랑 상호작용 후 프론트로 JWT Token 응답
![image](https://github.com/user-attachments/assets/a8a5f456-dd0b-40f1-9298-012d94637044)

---

### 2) 메인 
- 스터디룸 목록 조회, 검색, 입장 제한, 페이징, 방 생성 기능을 포함
![image](https://github.com/user-attachments/assets/c50ddcde-e331-422a-9003-1e8553f1c5ec)

---

### 3) 스터디룸 내부
- WebRTC 기반 실시간 화상 연결, OpenCV 집중 감지 및 자동 퇴장, 채팅·타이머·BGM 등 학습 지원 기능 통합 제공
- OpenCV 기반 얼굴 인식으로 5분 동안 인식이 안될 시 강퇴 처리(haarcascade_frontalface_default xml를 활용)
 ![image](https://github.com/user-attachments/assets/742045ee-1189-489b-b8fa-90b0e672a852)

---

### 4) 플래너 
- 캘린더 기반 목표 설정 및 진행률 시각화를 통해 자기주도 학습을 체계적으로 관리하는 플래너 기능 제공
 ![image](https://github.com/user-attachments/assets/cc3be214-f956-486c-9bf5-cd28c0b7f9ee)

---

<table>
  <tr>
    <td align="center">
      <h3>5) 다이어리 일기 작성 및 AI 피드백 화면</h3>
      <img src="https://github.com/user-attachments/assets/e3ded3dd-abcc-4508-9f60-1648bb9a95d8" width="100%"/>
    </td>
    <td align="center">
      <h3>6) 학습 일지 상세 보기 및 AI 피드백 확인 화면</h3>
      <img src="https://github.com/user-attachments/assets/8e1658d7-e1b9-4f0d-ad83-3fc877afec53" width="100%"/>
    </td>
  </tr>
</table>

---

### 7) 마이페이지 및 학습 통계 시각화 기능
- 사용자 프로필과 누적 학습 통계를 ChartJS를 통해 시각화 + 계정 설정을 지원
- 회원 탈퇴 시 계정 정보는 UUID 마스킹 및 소프트 딜리트 처리로 사용자 데이터 보호
 ![image](https://github.com/user-attachments/assets/cf79a8b0-b617-46ba-a161-bc8bd90ba89c)

--- 
