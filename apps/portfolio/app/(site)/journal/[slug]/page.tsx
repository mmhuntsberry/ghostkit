import { Code } from "../../../../components/code";
import { getPost } from "../../../../sanity/sanity-utils";
import { PortableText } from "@portabletext/react";

// const CustomParagraph = ({ children }) => (
//   <p style={{ fontSize: "18px" }}>{children}</p>
// );
// const CustomLink = ({ children, value }) => (
//   <a href={value.href} style={{ textDecoration: "underline" }}>
//     {children}
//   </a>
// );

const customPortableTextComponents = {
  types: {
    snippet: (props) => {
      // Assuming your `Code` component takes a `code` prop
      return <Code value={props.value.code.code} />;
    },

    // Apply custom components based on style
    // Add other styles if needed

    // You can add renderers for other custom types here if needed
  },
  block: {
    h1: ({ children }) => (
      <h2 className="grid-span-all md:grid-span-2-to-neg2 lg:grid-span-3-to-neg3 mt-xl mb-lg text-size-3xl">
        {children}
      </h2>
    ),
    h2: ({ children }) => (
      <h2 className="grid-span-all md:grid-span-2-to-neg2 lg:grid-span-3-to-neg3 mt-lg mb-lg text-size-xl">
        {children}
      </h2>
    ),
    normal: ({ children }) => (
      <p className=" grid-span-all md:grid-span-2-to-neg2 lg:grid-span-3-to-neg3 mt-lg mb-lg text-size-xs">
        {children}
      </p>
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="d-inline p-xxs bg-color-secondary">{children}</code>
    ),
  },
};

export default async function Post({ params }) {
  const slug = params.slug;
  const post = await getPost(slug);

  // Define a custom renderer for snippet blocks

  return (
    post && (
      <PortableText
        value={post.content}
        components={customPortableTextComponents}
      />
    )
  );
}
