import { MantineProvider, Radio as MantineRadio } from "@mantine/core";
import styles from "./radio.module.css";
import { theme } from "../themes";

/* eslint-disable-next-line */
export interface RadioProps {}

export function Radio(props: RadioProps) {
  return (
    <MantineProvider theme={theme}>
      <MantineRadio
        classNames={{
          root: styles.root,
          label: styles.label,
          inner: "my-inner-class",
        }}
        label="I cannot be unchecked"
      />
    </MantineProvider>
  );
}

export default Radio;
