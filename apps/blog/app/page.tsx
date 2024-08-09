import styles from "./page.module.css";
import Dashboard from "./dashboard";

export default async function Index() {
  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./ndex.css file.
   */
  return (
    <div className={styles.page}>
      <Dashboard />
    </div>
  );
}
