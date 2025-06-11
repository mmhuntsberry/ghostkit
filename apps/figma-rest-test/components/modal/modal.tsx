"use client";

import React from "react";
import * as RDialog from "@radix-ui/react-dialog";
import Button from "../button/button";
import { X } from "@phosphor-icons/react";
import buttonStyles from "../button/button.module.css";

export interface DialogTriggerProps extends RDialog.DialogTriggerProps {
  children: React.ReactNode;
}

export interface DialogPortalProps extends RDialog.DialogPortalProps {
  children: React.ReactNode;
}

export interface DialogOverlayProps extends RDialog.DialogOverlayProps {
  mode?: "dark" | "light";
}

export interface DialogContentProps extends RDialog.DialogContentProps {
  children: React.ReactNode;
  mode?: "dark" | "light";
  size?: "md" | "lg" | "xl";
}

export interface DialogTitleProps extends RDialog.DialogTitleProps {
  children: React.ReactNode;
  mode?: "dark" | "light";
}

export interface DialogCloseProps extends RDialog.DialogCloseProps {
  children: React.ReactNode;
}

export interface DialogDescriptionProps extends RDialog.DialogDescriptionProps {
  children: React.ReactNode;
  mode?: "dark" | "light";
}

export interface DialogIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  mode?: "dark" | "light";
  type?: "generic" | "destructive" | "error" | "success" | "loading";
}

export interface DialogXProps extends Omit<DialogCloseProps, "children"> {
  mode?: "dark" | "light";
}

const Modal: React.FC<
  RDialog.DialogProps & {
    children: React.ReactNode;
  }
> & {
  Trigger: React.FC<DialogTriggerProps>;
  Portal: React.FC<DialogPortalProps>;
  Overlay: React.FC<DialogOverlayProps>;
  Content: React.FC<DialogContentProps>;
  Title: React.FC<DialogTitleProps>;
  Description: React.FC<DialogDescriptionProps>;
  Close: React.FC<DialogCloseProps>;
  Icon: React.FC<DialogIconProps>;
  X: React.FC<DialogXProps>;
  Slot: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({ children }) => <RDialog.Root>{children}</RDialog.Root>;

const ModalTrigger: React.FC<DialogTriggerProps> = ({ children, ...rest }) => (
  <RDialog.Trigger asChild {...rest}>
    {children}
  </RDialog.Trigger>
);

const ModalPortal: React.FC<DialogPortalProps> = ({ children }) => (
  <RDialog.Portal>{children}</RDialog.Portal>
);

const ModalOverlay: React.FC<DialogOverlayProps> = React.forwardRef<
  HTMLDivElement,
  DialogOverlayProps
>((props, ref) => (
  <RDialog.Overlay {...props} data-mode={props.mode} ref={ref} />
));

const ModalContent: React.FC<DialogContentProps> = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ children, ...rest }, forwaredRef) => (
  <RDialog.Content
    {...rest}
    data-mode={rest.mode}
    data-size={rest.size || "lg"}
    ref={forwaredRef}
  >
    {children}
  </RDialog.Content>
));

const ModalDescription: React.FC<DialogDescriptionProps> = ({
  children,
  ...rest
}) => (
  <RDialog.Description {...rest} data-mode={rest.mode}>
    {children}
  </RDialog.Description>
);

const ModalSlot: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => <div {...rest}>{children}</div>;

const ModalClose: React.FC<DialogCloseProps> = ({ children, ...rest }) => (
  <RDialog.Close asChild {...rest}>
    {children}
  </RDialog.Close>
);

const ModalTitle: React.FC<DialogTitleProps> = ({ children, ...rest }) => (
  <RDialog.Title {...rest} data-mode={rest.mode}>
    {children}
  </RDialog.Title>
);

const ModalIcon: React.FC<DialogIconProps> = ({ children, ...rest }) => (
  <div data-mode={rest.mode} data-type={rest.type} {...rest}>
    {children}
  </div>
);

const ModalX: React.FC<DialogXProps> = ({ mode = "light", ...rest }) => (
  <ModalClose {...rest}>
    <Button
      size="lg"
      variant="neutral"
      background="transparent"
      className={buttonStyles.button}
      aria-label="Close"
      mode={mode}
      style={{
        paddingInline: "var(--space-xs)",
      }}
    >
      <X
        color={
          mode === "light"
            ? "var(--palette-neutral-darkest)"
            : "var(--palette-neutral-lightest)"
        }
        size={20}
      />
    </Button>
  </ModalClose>
);

Modal.Trigger = ModalTrigger;
Modal.Portal = ModalPortal;
Modal.Overlay = ModalOverlay;
Modal.Content = ModalContent;
Modal.Title = ModalTitle;
Modal.Description = ModalDescription;
Modal.Close = ModalClose;
Modal.Icon = ModalIcon;
Modal.X = ModalX;
Modal.Slot = ModalSlot;

export {
  Modal,
  ModalTrigger,
  ModalPortal,
  ModalOverlay,
  ModalContent,
  ModalDescription,
  ModalClose,
  ModalTitle,
  ModalIcon,
  ModalX,
  ModalSlot,
};

export default Modal;
