import { useState } from "react";
import Modal from "../Modal";
import styles from "./Modal.module.css";
import { apiPatch, extractErrorInfo } from "../../utils/api";
import { toast } from "react-toastify";
import { validatePassword } from "../../utils/validation";

const PasswordModal = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    setError("");

    if (!validatePassword(newPassword)) {
      setError("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await apiPatch("/users/me/password", {
        currentPassword,
        newPassword,
      });
      toast.success("비밀번호가 변경되었습니다.");
      onClose();
    } catch (err) {
      console.error("비밀번호 변경 실패", err);
      const { status } = extractErrorInfo(err);
      if (status === 409) {
        setError("현재 비밀번호가 올바르지 않습니다.");
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="비밀번호 변경"
      confirmText="변경"
      onConfirm={handleConfirm}
    >
      <input
        type="password"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={styles.input}
      />
      <input
        type="password"
        placeholder="새 비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className={styles.input}
      />
      {error && <p className={styles.errorText}>{error}</p>}
    </Modal>
  );
};

export default PasswordModal;
