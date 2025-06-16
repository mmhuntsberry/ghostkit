import Header from "../../components/header/header";
import headerStyles from "../../components/header/header.module.css";
import {
  List,
  House,
  SignIn,
  UserCircle,
  Sparkle,
  CheckSquare,
} from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { Button } from "../../../../packages/components/src/index";
import styles from "./marketing-page.module.css";

export default async function DashboardPage() {
  return (
    <div>
      <Header className={headerStyles.header}>
        {/* mobile-only buttons */}
        <div className="flex items-center sm:hidden">
          <Button
            variant="primary"
            size="md"
            background="transparent"
            disabled={true}
          >
            <List size={16} />
          </Button>
          <Button
            variant="primary"
            size="md"
            background="transparent"
            disabled={true}
          >
            <House size={16} />
          </Button>
          <h2 className={headerStyles.title}>
            <span className={headerStyles.titlePartBold}>Neuro</span>
            <span className={headerStyles.titlePartItalic}>Tales</span>
          </h2>
        </div>
        {/* default buttons (sm+) */}
        <div className="hidden sm:flex items-center">
          <Button variant="primary" background="transparent" disabled={true}>
            <List size={24} />
          </Button>
          <Button variant="primary" background="transparent" disabled={true}>
            <House size={24} />
          </Button>
          <h2 className={headerStyles.title}>
            <span className={headerStyles.titlePartBold}>Neuro</span>
            <span className={headerStyles.titlePartItalic}>Tales</span>
          </h2>
        </div>

        {/* …same pattern for Sign up / Sign in */}
        <div className="flex items-center">
          <div className="sm:hidden flex">
            <Button variant="primary" size="md" disabled={true}>
              <SignIn size={16} />
            </Button>
            <Button
              variant="primary"
              size="md"
              background="transparent"
              disabled={true}
            >
              <UserCircle size={16} />
            </Button>
          </div>
          <div className="hidden sm:flex">
            <Button variant="primary" disabled={true}>
              <span className="hidden sm:block">Sign up</span>
              <SignIn size={24} />
            </Button>
            <Button variant="primary" background="transparent" disabled={true}>
              <span className="hidden sm:block">Sign in</span>
              <UserCircle size={24} />
            </Button>
          </div>
        </div>
      </Header>
      <div className="flex-1 flex flex-col lg:flex-row">
        <div className="flex-1 flex flex-col justify-center px-8">
          <h1 className={styles.headline}>
            Let&apos;s build a <span className={styles.underline}>story.</span>
          </h1>
          <p className={styles.subheadline}>
            NeuroTales makes social stories simple. Built with experts. Made for
            real kids, real fast.
          </p>
          <Button
            style={{ width: "fit-content" }}
            variant="primary"
            background="solid"
            disabled={true}
          >
            <Sparkle size={24} />
            Try Our Generated Story Builder
          </Button>
          <div className="mt-12">
            <h2 className={styles.supportingText}>
              Social stories are powerful.
              <br />
              But time-consuming to make.
              <br />
              <span className={styles.greenHeadline}>
                NeuroTales makes it simple.
              </span>
            </h2>
          </div>
          {/* Feature grid below supporting text and Sloeg */}
        </div>

        <div className="items-center justify-center hidden lg:flex">
          <Image
            src="/images/sleog.svg"
            alt="NeuroTales Illustration"
            className="  object-contain object-center "
            width={400}
            height={400}
          />
        </div>
      </div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-sm mt-16 px-8">
        <li className={styles.featureCell}>
          <CheckSquare size={32} color="var(--palette-primary-100)" />
          <div>
            <h4 className={styles.featureTitle}>Built-in Visuals</h4>
            <p className={styles.featureText}>
              Pick a topic, we'll suggest images.
            </p>
          </div>
        </li>
        <li className={styles.featureCell}>
          <CheckSquare size={32} color="var(--palette-primary-100)" />
          <div>
            <h4 className={styles.featureTitle}>Ready in seconds</h4>
            <p className={styles.featureText}>
              Sharable PDF versions available
            </p>
          </div>
        </li>
        <li className={styles.featureCell}>
          <CheckSquare size={32} color="var(--palette-primary-100)" />
          <div>
            <h4 className={styles.featureTitle}>Built-in Visuals</h4>
            <p className={styles.featureText}>
              Pick a topic, we'll suggest images.
            </p>
          </div>
        </li>
        <li className={styles.featureCell}>
          <CheckSquare size={32} color="var(--palette-primary-100)" />
          <div>
            <h4 className={styles.featureTitle}>Ready in seconds</h4>
            <p className={styles.featureText}>
              Sharable PDF versions available
            </p>
          </div>
        </li>
      </ul>
    </div>
  );
}
