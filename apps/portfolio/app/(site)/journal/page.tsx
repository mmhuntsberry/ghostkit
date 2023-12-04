import { Surface } from "@mmhuntsberry/components";
import { getPosts } from "../../../sanity/sanity-utils";

import NextLink from "next/link";
import LinkWrapper from "packages/components/src/lib/components/link-wrapper/link-wrapper";

export default async function Posts({ params }) {
  const posts = await getPosts();
  console.log(posts);
  return (
    <Surface>
      <ul>
        {posts.map((post, i) => {
          return (
            <li key={post._id} className="grid">
              <LinkWrapper>
                <NextLink href={`journal/${posts[i].slug}`}>
                  <h2>{post.name}</h2>
                </NextLink>
              </LinkWrapper>
            </li>
          );
        })}
      </ul>
    </Surface>
  );
}
