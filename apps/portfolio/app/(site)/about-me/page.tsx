import { Badge, Surface } from "@mmhuntsberry/components";

import NextLink from "next/link";
import {
  GithubLogo,
  LinkedinLogo,
  InstagramLogo,
  Envelope,
  Trilby,
} from "packages/components/src/lib/icons";

const skills = [
  "HTML/CSS",
  "JavaScript",
  "React",
  "TypeScript",
  "Web Components",
  "Lit Element",
  "Jest",
  "Storybook",
  "ESLint",
  "Figma",
  "Accessibility",
  "WCAG Compliance",
  "Open Source",
  "Code Reviews",
  "Documentation",
  "Git",
  "Systems Thinking",
  "Design Thinking",
  "Design Token Management",
  "Multi-Brand Theming",
  "Collaboration",
  "Dev Tools",
  "Individual Contributor",
  "Code Audits",
  "Library Maintenance",
  "Design Systems",
  "Monorepos",
  "Stakeholder Engagement",
  "Systems Architecture",
  "Leadership",
];
export default function About() {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-lg">
      <section className="grid-span-all">
        <Surface className="align-center">
          <div className="pt-2xl">
            <Trilby />
          </div>
          <h2 className="mt-3xl mb-xl title-lg-regular">
            Hello, digital traveler!
          </h2>
          <p className="paragraph-md-regular">
            I’m Matt, your guide to the intricate maze of building design
            systems and component libraries.
          </p>
        </Surface>
      </section>
      <section className="grid-span-all md:grid-span-6 lg:grid-span-9 flex flex-column gap-lg">
        <h3 className="small-md-regular">Skills</h3>
        <Surface>
          <ul className="flex flex-wrap gap-lg row-gap-3xl justify-center">
            {skills.map((skill) => (
              <li key={skill}>
                <Badge>{skill}</Badge>
              </li>
            ))}
          </ul>
        </Surface>
      </section>
      <section className="grid-span-all md:grid-span-2 lg:grid-span-3 flex flex-column gap-lg">
        <h3 className="small-md-regular">Find me here</h3>
        <Surface>
          <div className="flex align-center flex-wrap gap-sm justify-around">
            <NextLink href="/" aria-label="Matt's Github">
              <GithubLogo />
            </NextLink>
            <NextLink href="/" aria-label="Matt's Linkedin">
              <LinkedinLogo />
            </NextLink>
            <NextLink href="/" aria-label="Matt's Instagram">
              <InstagramLogo />
            </NextLink>
            <NextLink href="/" aria-label="Matt's Email">
              <Envelope />
            </NextLink>
          </div>
        </Surface>
      </section>
    </div>
  );
}
