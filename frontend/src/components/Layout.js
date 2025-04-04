import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "../styles/Layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Header />
      <main className={styles.content}>{children}</main>
    </div>
  );
};

export default Layout;
