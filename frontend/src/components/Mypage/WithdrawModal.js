import Modal from "../Modal";
import styles from "./Modal.module.css";
import { apiDelete } from "../../utils/api";
import { removeToken } from "../../utils/auth";

const WithdrawModal = ({ isOpen, onClose }) => {
  const handleWithdraw = async () => {
    try {
      // 1. 유저 탈퇴 요청
      await apiDelete("/users/me");

      // 2. 서버 refreshToken 삭제 요청
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include", // refresh token 쿠키 전송
      });

      // 3. 클라이언트 정리
      removeToken();
      localStorage.removeItem("nickname");

      alert("회원 탈퇴가 완료되었습니다.");
      window.location.href = "/";
    } catch (err) {
      console.error("탈퇴 실패", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="회원 탈퇴"
      confirmText="탈퇴하기"
      onConfirm={handleWithdraw}
    >
      <p className={styles.warningText}>
        정말 <span className={styles.highlight}>회원 탈퇴</span>를 진행하시겠어요?
      </p>
      <p className={styles.detailText}>
        탈퇴 시 <b>계정 정보</b>와 <b>공부 기록</b>이 모두{" "}
        <span className={styles.emphasis}>영구 삭제</span>되며,
        <br />
        <span className={styles.emphasis}>되돌릴 수 없습니다.</span>
      </p>
    </Modal>
  );
};

export default WithdrawModal;
