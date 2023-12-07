import { Surface } from "packages/components/src/lib/components/surface/surface";

import { LinkWrapper } from "packages/components/src/lib/components/link-wrapper/link-wrapper";
import {
  GithubLogo,
  LinkedinLogo,
  InstagramLogo,
  Envelope,
  RightArrow,
} from "packages/components/src/lib/icons";
import { getProjects, getPosts } from "../../sanity/sanity-utils";

import NextLink from "next/link";
import { toTitleCase } from "../../utils/index";

export default async function Index() {
  // const projects = await getProjects();
  const posts = await getPosts();
  return (
    <section className="grid grid-cols-12 gap-lg">
      <section className="flex flex-column gap-sm grid-span-7 sm:grid-span-all">
        <h2 className="small-md-regular">Who I am</h2>
        <Surface>
          <h3 className="title-md-regular mb-md">Hello, digital traveler!</h3>
          <p className="paragraph-md-regular">
            I’m Matt, your guide to the intricate maze of building design
            systems and component libraries.
          </p>
          <LinkWrapper size="lg">
            <NextLink href="/about-me">About me</NextLink>
            <RightArrow className="link-text-color-primary hover:link-text-color-primary" />
          </LinkWrapper>
        </Surface>
      </section>
      <section className="flex flex-column gap-sm grid-span-5 sm:grid-span-all">
        <h2 className="small-md-regular">Find me here</h2>
        <Surface>
          <section className="flex align-center flex-wrap gap-sm justify-around">
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
          </section>
        </Surface>
      </section>
      <section className="flex flex-column gap-sm grid-span-7 sm:grid-span-all">
        <h2 className="small-md-regular">On my desk</h2>
        <Surface>
          <h3 className="title-md-regular mb-md">Phantom Elements</h3>
          <p className="paragraph-md-regular">
            A project in which I delve into the creation of a multifaceted,
            multi-brand component library.
          </p>
          <LinkWrapper size="lg">
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow />
          </LinkWrapper>
        </Surface>
      </section>
      <section className="flex flex-column gap-sm grid-span-5 sm:grid-span-all">
        <h2 className="small-md-regular">Sharing the craft</h2>
        {posts.length > 0 && (
          <>
            <Surface key={posts[posts.length - 1]._id}>
              <ul className="flex flex-column">
                <li>
                  <LinkWrapper size="lg">
                    <NextLink href={`journal/${posts[posts.length - 1].slug}`}>
                      {toTitleCase(posts[posts.length - 1].name)}
                    </NextLink>
                  </LinkWrapper>
                </li>
                <li>
                  <LinkWrapper size="lg">
                    <NextLink href={`journal/${posts[posts.length - 2].slug}`}>
                      {toTitleCase(posts[posts.length - 2].name)}
                    </NextLink>
                  </LinkWrapper>
                </li>
                <li className="self-end">
                  <LinkWrapper size="md" className="text-size-xs">
                    <NextLink href={`/journal`}>
                      See all {posts.length} posts
                    </NextLink>
                  </LinkWrapper>
                </li>
              </ul>
            </Surface>
          </>
        )}
      </section>
      {/* <div className="flex flex-column gap-sm grid-span-all">
        <h2>Creation & Designs</h2>
        {projects.map((project) => (
          <Surface key={project._id}>
            <h3 className="text-size-xl mb-md">{project.name}</h3>
            <LinkWrapper size="lg">
              <NextLink href={`projects/${project.slug}`}>Learn more</NextLink>
              <RightArrow  />
            </LinkWrapper>
          </Surface>
        ))}
        <Surface>
          <h3>Resin Design System</h3>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
            voluptate esse fugiat, in deserunt, eum, ratione laboriosam illum
            aperiam aliquid accusantium dolores soluta eos sapiente aspernatur
            nesciunt nihil quod natus.
          </p>
          <LinkWrapper size="lg">
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow  />
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
          <LinkWrapper size="lg">
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow  />
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
          <LinkWrapper size="lg">
            <NextLink href="/about-me">Learn more</NextLink>
            <RightArrow  />
          </LinkWrapper>
        </Surface>
      </div> */}
    </section>
  );
}
