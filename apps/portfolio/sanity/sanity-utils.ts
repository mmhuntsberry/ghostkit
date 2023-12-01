import { createClient, groq } from "next-sanity";
import { Project } from "../types/Project";
import config from "./config/client-config";

export async function getProjects(): Promise<Project[]> {
  const client = createClient(config);

  return client.fetch(
    groq`*[_type == "project"]{
      _id,
      _createdAt,
      name,
      "slug": slug.current,
      
      "image": image.asset->url,
      url,
      content
    }`
  );
}

export async function getProject(slug): Promise<Project> {
  const client = createClient(config);

  return client.fetch(
    groq`*[_type == "project" && slug.current == $slug][0]{
      _id,
      _createdAt,
      name,
      "slug": slug.current,
      
      "image": image.asset->url,
      url,
      content
    }`,
    { slug }
  );
}
