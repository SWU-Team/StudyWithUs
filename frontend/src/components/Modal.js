import styles from "./Modal.module.css";

const Modal = ({ isOpen, onClose, title, content, confirmText, onConfirm, children }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h3 className={styles.modalTitle}>{title}</h3>}
        {content && <p className={styles.modalContent}>{content}</p>}
        {children}
        {onConfirm && (
          <button className={styles.modalClose} onClick={onConfirm}>
            {confirmText || "확인"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
