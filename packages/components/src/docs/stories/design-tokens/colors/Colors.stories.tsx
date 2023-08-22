// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../../../../lib/components/Table/Table";

export default {
  title: "Design Tokens/Colors",
  // component: Table,
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

export const Grey = {
  render: () => <h2>Hello world</h2>,
};

// export const Grey = {
//   args: {
//     color: "Grey",
//   },
//   render: (args) => (
//     <Table>
//       <TableCaption>{args.color}</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">Variant</TableHead>
//           <TableHead>Variable</TableHead>
//           <TableHead className="text-right">Swatch</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {variants.map((v) => (
//           <TableRow key={`${args.color.toLowerCase()}-${v}`}>
//             <TableCell className="font-medium">{v}</TableCell>
//             <TableCell>
//               --colors-{args.color.toLowerCase()}-{v}
//             </TableCell>
//             <TableCell className="float-right">
//               <div
//                 style={{
//                   width: "24px",
//                   height: "24px",
//                   backgroundColor: `var(--colors-${args.color.toLowerCase()}-${v})`,
//                 }}
//               ></div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   ),
// };

// export const Red = {
//   args: {
//     color: "Red",
//   },
//   render: (args) => (
//     <Table>
//       <TableCaption>{args.color}</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">Variant</TableHead>
//           <TableHead>Variable</TableHead>
//           <TableHead className="text-right">Swatch</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {variants.map((v) => (
//           <TableRow key={`${args.color.toLowerCase()}-${v}`}>
//             <TableCell className="font-medium">{v}</TableCell>
//             <TableCell>
//               --colors-{args.color.toLowerCase()}-{v}
//             </TableCell>
//             <TableCell className="float-right">
//               <div
//                 style={{
//                   width: "24px",
//                   height: "24px",
//                   backgroundColor: `var(--colors-${args.color.toLowerCase()}-${v})`,
//                 }}
//               ></div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   ),
// };

// export const Blue = {
//   args: {
//     color: "Blue",
//   },
//   render: (args) => (
//     <Table>
//       <TableCaption>{args.color}</TableCaption>
//       <TableHeader>
//         <TableRow>
//           <TableHead className="w-[100px]">Variant</TableHead>
//           <TableHead>Variable</TableHead>
//           <TableHead className="text-right">Swatch</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {variants.map((v) => (
//           <TableRow key={`${args.color.toLowerCase()}-${v}`}>
//             <TableCell className="font-medium">{v}</TableCell>
//             <TableCell>
//               --colors-{args.color.toLowerCase()}-{v}
//             </TableCell>
//             <TableCell className="float-right">
//               <div
//                 style={{
//                   width: "24px",
//                   height: "24px",
//                   backgroundColor: `var(--colors-${args.color.toLowerCase()}-${v})`,
//                 }}
//               ></div>
//             </TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//   ),
// };
