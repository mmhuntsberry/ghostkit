import Markdown from "markdown-to-jsx";
import changelog from "packages/components/CHANGELOG.md?raw";

export default {
  title: "Components/Changelog",
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
};

export const Changelog = {
  args: {},
  render: () => (
    <Markdown
      style={{
        fontFamily: "Inter",
      }}
    >
      {changelog}
    </Markdown>
  ),
};
