import { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import Modal from "../Modal";
import axios from "axios";
import { getAuthHeader } from "../../utils/auth";
import { toast } from "react-toastify";
import { extractErrorInfo } from "../../utils/api";

const ProfileImgModal = ({ isOpen, onClose, onUpdate }) => {
  const [file, setFile] = useState(null);

  const handleConfirm = async () => {
    if (!file) {
      alert("이미지를 선택해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      await axios.patch(`${process.env.REACT_APP_API_BASE_URL}/users/me/profileImg`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: getAuthHeader(),
        },
      });
      toast.success("프로필 이미지가 변경되었습니다.");
      onClose();
      onUpdate();
      setFile(null);
    } catch (err) {
      const { status } = extractErrorInfo(err);
      console.error("이미지 업로드 실패", err);
      if (status === 500) {
        toast.error("1MB 이하의 이미지로 업로드 해주세요.");
      }
    }
  };

  useEffect(() => {
    if (!isOpen) setFile(null);
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="프로필 이미지 변경"
      confirmText="저장"
      onConfirm={handleConfirm}
    >
      <label htmlFor="profileImg" className={styles.fileLabel}>
        {file ? file.name : "프로필 이미지 선택"}
      </label>
      <input
        id="profileImg"
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className={styles.fileInput}
      />
    </Modal>
  );
};

export default ProfileImgModal;
