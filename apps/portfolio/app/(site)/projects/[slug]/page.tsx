import { getProject } from "../../../../sanity/sanity-utils";
import { PortableText } from "@portabletext/react";

export default async function Project({ params }) {
  const slug = params.slug;
  const project = await getProject(slug);
  return (
    <div>
      Project slug: {slug}
      {project && (
        <div>
          <h1>Project title: {project.name}</h1>
          <PortableText value={project.content} />
        </div>
      )}
    </div>
  );
}
