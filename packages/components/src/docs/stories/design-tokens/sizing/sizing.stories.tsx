import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../lib/components/Table/Table";

export default {
  title: "Design Tokens/Sizing",
  component: Table,
  parameters: {
    docs: {
      source: {
        code: null,
      },
    },
  },
  argTypes: {},
};

export const Sizing = {
  args: {
    title: "Sizing",
  },
  render: (args) => (
    <Table>
      <TableCaption>{args.title}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Variant</TableHead>
          <TableHead>Variable</TableHead>
          <TableHead className="text-right">Swatch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["xs", "sm", "md", "lg", "xl"].map((v) => (
          <TableRow key={`${args.title.toLowerCase()}-${v}`}>
            <TableCell className="font-medium">{v}</TableCell>
            <TableCell>--sizing-{v}</TableCell>
            <TableCell className="float-right">
              <div
                style={{
                  width: `var(--sizing-${v})`,
                  height: `var(--sizing-${v})`,
                  backgroundColor: `blue`,
                  // backgroundColor: `var(--colors-${args.color.toLowerCase()}-${v})`,
                }}
              ></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const Spacing = {
  args: {
    title: "Spacing",
  },
  render: (args) => (
    <Table>
      <TableCaption>{args.title}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Variant</TableHead>
          <TableHead>Variable</TableHead>
          <TableHead className="text-right">Swatch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {["2xs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"].map((v) => (
          <TableRow key={`${args.title.toLowerCase()}-${v}`}>
            <TableCell className="font-medium">{v}</TableCell>
            <TableCell>--spacing-{v}</TableCell>
            <TableCell className="float-right">
              <div
                style={{
                  width: `var(--spacing-${v})`,
                  height: `var(--spacing-${v})`,
                  backgroundColor: `blue`,
                  // backgroundColor: `var(--colors-${args.color.toLowerCase()}-${v})`,
                }}
              ></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
