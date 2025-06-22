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

// add comment

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
      <main>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.headline}>
              Let&apos;s build a{" "}
              <span className={styles.underline}>story.</span>
            </h1>
            <p className={styles.subheadline}>
              NeuroTales makes social stories simple. Built with experts. Made
              for real kids, real fast.
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
          </div>
          <div className={styles.heroImage}>
            <Image
              src="/images/sleog.svg"
              alt="NeuroTales Illustration"
              className={`object-contain object-center ${styles.illustration}`}
              width={400}
              height={400}
            />
          </div>
        </section>
        <section className={styles.featuresSection}>
          <div className={styles.featuresContent}>
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
          <ul className={styles.featuresGrid}>
            <li className={styles.featureCell}>
              <CheckSquare
                min={32}
                size={32}
                className={styles.featureIcon}
                color="var(--palette-primary-100)"
              />
              <div>
                <h4 className={styles.featureTitle}>Built-in Visuals</h4>
                <p className={styles.featureText}>
                  Pick a topic, we'll suggest images.
                </p>
              </div>
            </li>
            <li className={styles.featureCell}>
              <CheckSquare
                min={32}
                size={32}
                className={styles.featureIcon}
                color="var(--palette-primary-100)"
              />
              <div>
                <h4 className={styles.featureTitle}>Ready in seconds</h4>
                <p className={styles.featureText}>
                  Sharable PDF versions available
                </p>
              </div>
            </li>
            <li className={styles.featureCell}>
              <CheckSquare
                size={32}
                min={32}
                className={styles.featureIcon}
                color="var(--palette-primary-100)"
              />
              <div>
                <h4 className={styles.featureTitle}>Built-in Visuals</h4>
                <p className={styles.featureText}>
                  Pick a topic, we'll suggest images.
                </p>
              </div>
            </li>
            <li className={styles.featureCell}>
              <CheckSquare
                min={32}
                size={32}
                className={styles.featureIcon}
                color="var(--palette-primary-100)"
              />
              <div>
                <h4 className={styles.featureTitle}>Ready in seconds</h4>
                <p className={styles.featureText}>
                  Sharable PDF versions available
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section className={styles.howItWorksSection}>
          <div className={styles.howItWorksImage}>
            <Image
              src="/images/king-fish.svg"
              alt="Illustration of a cartoon fish with a crown"
              width={256}
              height={256}
            />
          </div>
          <div className={styles.howItWorksContent}>
            <h2 className={styles.sectionTitle}>How it works</h2>
            <ol className={styles.steps}>
              <li className={styles.step}>
                <span className={styles.bullet}>1</span>
                <h3 className={styles.stepTitle}>Pick a topic.</h3>
                <p className={styles.stepDescription}>
                  Going to the Dentist. Flying on a plan.
                </p>
              </li>
              <li className={styles.step}>
                <span className={styles.bullet}>2</span>
                <h3 className={styles.stepTitle}>Answer a few quick prompts</h3>
                <p className={styles.stepDescription}>
                  Childs name and sensitivities.
                </p>
              </li>
              <li className={styles.step}>
                <span className={styles.bullet}>3</span>
                <h3 className={styles.stepTitle}>Download & Share</h3>
                <p className={styles.stepDescription}>
                  Ready to use social story, PDF and mobile.
                </p>
              </li>
            </ol>
          </div>
        </section>
        <section className={styles.testimonialsSection}>
          <h2 className={styles.sectionTitle}>Testimonials</h2>
          <div className={styles.testimonialsGrid}>
            <figure className={styles.testimonial}>
              <blockquote className={styles.quote}>
                &quot;This saved me an hour of prep before therapy.&quot;
              </blockquote>
              <figcaption className={styles.caption}>
                &mdash; Special ed teacher, beta tester
              </figcaption>
            </figure>
            <figure className={styles.testimonial}>
              <blockquote className={styles.quote}>
                &quot;This is so much better than what I&apos;ve been
                doing.&quot;
              </blockquote>
              <figcaption className={styles.caption}>
                &mdash; Parent of autistic child, TX
              </figcaption>
            </figure>
          </div>
        </section>
      </main>
    </div>
  );
}
