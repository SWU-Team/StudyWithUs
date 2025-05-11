import React from "react";
import styles from "./CustomCheckBox.module.css";

const CustomCheckbox = ({ checked, onChange }) => {
  return (
    <label className={styles.customCheckbox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className={styles.checkmark}></span>
    </label>
  );
};

export default CustomCheckbox;
