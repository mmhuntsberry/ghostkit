import styles from "./page.module.css";
import Dashboard from "./dashboard";

export default async function Page() {
  // const { brandType } = await getBrand();

  return (
    <div className={styles.page}>
      <Dashboard />
    </div>
  );
}

// async function getBrand() {
//   console.log("Fetching brand data...");
//   // Assume fetching data or using environment variables
//   return {
//     brandType: process.env.NEXT_PUBLIC_SITE_TYPE || "",
//   };
// }
