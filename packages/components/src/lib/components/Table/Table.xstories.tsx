import { within } from "@storybook/testing-library";
import { expect } from "@storybook/jest";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
// import type { ButtonProps } from "./Button";
// import changelog from "packages/components/CHANGELOG.md?raw";

export default {
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

const variants = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "950",
];

export const Primary = {
  args: {
    color: "red",
  },
  render: (args) => (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Color</TableHead>
          <TableHead>Variable</TableHead>
          <TableHead className="text-right">Swatch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants.map((v) => (
          <TableRow key={`${args.color}-${v}`}>
            <TableCell className="font-medium">{v}</TableCell>
            <TableCell>
              --colors-{args.color}-{v}
            </TableCell>
            <TableCell className="float-right">
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  backgroundColor: `var(--colors-${args.color}-${v})`,
                }}
              ></div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
