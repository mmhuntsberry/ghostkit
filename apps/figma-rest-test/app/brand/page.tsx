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
import { Input } from "../../components/Input/input";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";

import React from "react";

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

          {/* Input field with EnvelopeSimple icon */}
          <div
            style={{
              margin: "var(--space-md) 0",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-sm, 12px)",
            }}
          >
            <Input
              placeholder="Email"
              variant="outlined"
              icon={<EnvelopeSimple size={24} />}
            />
            <Input placeholder="Password" variant="outlined" type="password" />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "baseline",
              gap: "var(--space-xs)",
              marginTop: "var(--space-2xs)",
            }}
          >
            <ModalClose>
              <Button
                variant="neutral"
                background="transparent"
                className={styles.button}
                size="lg"
              >
                Cancel
              </Button>
            </ModalClose>
            <ModalClose>
              <Button
                variant="primary"
                background="solid"
                className={styles.button}
                size="lg"
              >
                Sign in
              </Button>
            </ModalClose>
          </div>
        </ModalContent>
      </Modal>
    </div>
  );
}
