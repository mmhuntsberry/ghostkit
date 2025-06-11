// File: apps/figma-rest-test/app/brand/page.tsx

import Button from "../../components/button/button";
import styles from "../../components/button/button.module.css";
import Modal from "../../components/modal/modal";
import {
  ModalTrigger,
  ModalContent,
  ModalTitle,
  ModalDescription,
  ModalClose,
  ModalOverlay,
  ModalX,
} from "../../components/modal/modal";
import modalStyles from "../../components/modal/modal.module.css";

export default function BrandPage() {
  return (
    <div className="flex gap-4 p-6">
      <Button variant="primary" background="solid" className={styles.button}>
        Solid
      </Button>
      <Button variant="primary" background="outlined" className={styles.button}>
        Outlined
      </Button>
      <Button
        variant="primary"
        background="transparent"
        className={styles.button}
      >
        Transparent
      </Button>

      <Modal open={true}>
        <ModalTrigger>
          <Button
            variant="primary"
            background="solid"
            className={styles.button}
          >
            Open Modal
          </Button>
        </ModalTrigger>
        <ModalOverlay className={modalStyles.overlay} />
        <ModalContent className={modalStyles.content}>
          <div
            style={{
              display: "flex",
              // flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "baseline",
              gap: "var(--space-4xs)",
            }}
          >
            <ModalTitle className={modalStyles.title}>Modal Title</ModalTitle>
            <ModalX />
          </div>
          <ModalDescription className={modalStyles.description}>
            Modal Description
          </ModalDescription>
          <ModalClose>
            <Button
              variant="neutral"
              background="trans"
              className={styles.button}
              size="lg"
            >
              Cancel
            </Button>
            <Button
              variant="neutral"
              background="solid"
              className={styles.button}
              size="lg"
            >
              Sign in
            </Button>
          </ModalClose>
        </ModalContent>
      </Modal>
    </div>
  );
}
