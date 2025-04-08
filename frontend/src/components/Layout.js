import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styles from "./Layout.module.css";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <Header />
      <main className={styles.content}>{children}</main>
    </div>
  );
}

export default Layout;
