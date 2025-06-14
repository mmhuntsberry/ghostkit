import Header from "../../components/header/header";
import headerStyles from "../../components/header/header.module.css";

export default async function DashboardPage() {
  return (
    <div>
      <Header>
        <Header.Title className={headerStyles.title}>Neurotales</Header.Title>
      </Header>
    </div>
  );
}
