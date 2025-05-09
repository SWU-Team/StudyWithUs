import { useState } from "react";
import Modal from "../Modal";
import styles from "./Modal.module.css";
import { apiPatch } from "../../utils/api";
import { toast } from "react-toastify";

const NicknameModal = ({ isOpen, onClose, onUpdate }) => {
  const [nickname, setNickname] = useState("");

  const handleConfirm = async () => {
    try {
      await apiPatch("/users/me/nickname", { nickname });
      toast.success("닉네임이 변경되었습니다.");
      onClose();
      onUpdate();
    } catch (err) {
      console.error("닉네임 변경 실패", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="닉네임 수정"
      confirmText="저장"
      onConfirm={handleConfirm}
    >
      <input
        type="text"
        placeholder="새 닉네임 입력"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className={styles.input}
      />
    </Modal>
  );
};

export default NicknameModal;
