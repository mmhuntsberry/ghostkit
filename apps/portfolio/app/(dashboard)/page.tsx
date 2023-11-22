import { Surface } from "packages/components/src/lib/components/surface/surface";

import { LinkWrapper } from "packages/components/src/lib/components/link-wrapper/link-wrapper";
import {
  GithubLogo,
  LinkedinLogo,
  InstagramLogo,
  Envelope,
  RightArrow,
} from "packages/components/src/lib/icons";

import NextLink from "next/link";

export default async function Index() {
  return (
    <div className="grid  grid-cols-12 gap-lg">
      <div className="flex flex-column gap-sm grid-span-7 sm:grid-span-all">
        <h2>Who I am</h2>
        <Surface>
          <h3>Hello, digital traveler!</h3>
          <p>
            I’m Matt, your guide to the intricate maze of building design
            systems and component libraries.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow fill="var(--text-color-secondary)" />
          </LinkWrapper>
        </Surface>
      </div>
      <div className="flex flex-column gap-sm grid-span-5 sm:grid-span-all">
        <h2>Find me here</h2>
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
      </div>
      <div className="flex flex-column gap-sm grid-span-7">
        <h2>On my desk</h2>
        <Surface>
          <h3>Phantom Elements</h3>
          <p>
            A project in which I delve into the creation of a multifaceted,
            multi-brand component library.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow fill="var(--text-color-secondary)" />
          </LinkWrapper>
        </Surface>
      </div>
      <div className="flex flex-column gap-sm grid-span-5">
        <h2>Sharing the craft</h2>
        <Surface>
          <h3>The one about me</h3>
          <p>
            A little about what I've been doing for the past couple of years.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow fill="var(--text-color-secondary)" />
          </LinkWrapper>
        </Surface>
      </div>
      <div className="flex flex-column gap-sm grid-span-all">
        <h2>Creation & Designs</h2>
        <Surface>
          <h3>Resin Design System</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            voluptate esse fugiat, in deserunt, eum, ratione laboriosam illum
            aperiam aliquid accusantium dolores soluta eos sapiente aspernatur
            nesciunt nihil quod natus.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow fill="var(--text-color-secondary)" />
          </LinkWrapper>
        </Surface>
        <Surface>
          <h3>GDS</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            voluptate esse fugiat, in deserunt, eum, ratione laboriosam illum
            aperiam aliquid accusantium dolores soluta eos sapiente aspernatur
            nesciunt nihil quod natus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Consectetur voluptate esse fugiat, in deserunt,
            eum, ratione laboriosam illum aperiam aliquid accusantium dolores
            soluta eos sapiente aspernatur nesciunt nihil quod natus.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow fill="var(--text-color-secondary)" />
          </LinkWrapper>
        </Surface>
        <Surface>
          <h3>Nielsen Design System</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            voluptate esse fugiat, in deserunt, eum, ratione laboriosam illum
            aperiam aliquid accusantium dolores soluta eos sapiente aspernatur
            nesciunt nihil quod natus. Lorem ipsum dolor sit amet consectetur
            adipisicing elit. Consectetur voluptate esse fugiat, in deserunt,
            eum, ratione laboriosam illum aperiam aliquid accusantium dolores
            soluta eos sapiente aspernatur nesciunt nihil quod natus.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow fill="var(--text-color-secondary)" />
          </LinkWrapper>
        </Surface>
      </div>
    </div>
  );
}
