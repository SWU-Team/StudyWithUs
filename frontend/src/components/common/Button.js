import styles from "./Button.module.css";
import clsx from "clsx";

const Button = ({ children, type = "default", fullWidth = true, onClick }) => {
  return (
    <button
      className={clsx(styles.btn, styles[type], fullWidth && styles.fullWidth)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
