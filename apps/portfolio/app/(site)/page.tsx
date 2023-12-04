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
    <div className="grid  grid-cols-12 gap-lg">
      <div className="flex flex-column gap-sm grid-span-7 sm:grid-span-all">
        <h2>Who I am</h2>
        <Surface>
          <h3 className="text-size-xl mb-md">Hello, digital traveler!</h3>
          <p>
            I’m Matt, your guide to the intricate maze of building design
            systems and component libraries.
          </p>
          <LinkWrapper>
            <NextLink href="/about-me">About me</NextLink>
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
      <div className="flex flex-column gap-sm grid-span-7 sm:grid-span-all">
        <h2>On my desk</h2>
        <Surface>
          <h3 className="text-size-xl mb-md">Phantom Elements</h3>
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
      <div className="flex flex-column gap-sm grid-span-5 sm:grid-span-all">
        <h2>Sharing the craft</h2>
        {posts.length > 0 && (
          <>
            <Surface key={posts[posts.length - 1]._id}>
              <ul className="flex flex-column">
                <li className="text-size-md">
                  <LinkWrapper>
                    <NextLink href={`posts/${posts[posts.length - 1].slug}`}>
                      {toTitleCase(posts[posts.length - 1].name)}
                    </NextLink>
                  </LinkWrapper>
                </li>
                <li className="text-size-md">
                  <LinkWrapper className="self-start">
                    <NextLink href={`posts/${posts[posts.length - 2].slug}`}>
                      {toTitleCase(posts[posts.length - 2].name)}
                    </NextLink>
                  </LinkWrapper>
                </li>
                <li className="text-size-md self-end">
                  <LinkWrapper className="">
                    <NextLink href={`#`}>See all {posts.length} posts</NextLink>
                  </LinkWrapper>
                </li>
              </ul>
            </Surface>
          </>
        )}
      </div>
      {/* <div className="flex flex-column gap-sm grid-span-all">
        <h2>Creation & Designs</h2>
        {projects.map((project) => (
          <Surface key={project._id}>
            <h3 className="text-size-xl mb-md">{project.name}</h3>
            <LinkWrapper>
              <NextLink href={`projects/${project.slug}`}>Learn more</NextLink>
              <RightArrow fill="var(--text-color-secondary)" />
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
      </div> */}
    </div>
  );
}
