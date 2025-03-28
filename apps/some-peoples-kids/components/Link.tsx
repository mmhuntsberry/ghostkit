"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

/** Utility types for polymorphic components **/
type AsProp<C extends React.ElementType> = { as?: C };

type PropsToOmit<C extends React.ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProps<
  C extends React.ElementType,
  Props = {}
> = React.PropsWithChildren<Props & AsProp<C>> &
  Omit<React.ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

/** Base props for our Link **/
export interface BaseLinkProps {
  background?: "solid" | "outlined" | "transparent";
  mode?: "light" | "dark";
  rounded?: "left" | "right" | "all" | "none";
  size?: "md" | "lg" | "xl";
  variant?: "primary" | "neutral" | "danger";
  width?: "auto" | "full";
  className?: string;
  selectable?: boolean;
  /** For typical anchor usage, href is required and must be a string */
  href: string;
}

/** Our polymorphic Link type */
export type LinkComponent = <C extends React.ElementType = "a">(
  props: PolymorphicComponentProps<C, BaseLinkProps> & { ref?: React.Ref<any> }
) => React.ReactElement | null;

/** Inner generic Link component */
function _Link<C extends React.ElementType = "a">(
  {
    as,
    background = "solid",
    mode = "light",
    size = "xl",
    rounded = "all",
    variant = "primary",
    width = "auto",
    className,
    children,
    href,
    selectable = true,
    ...rest
  }: PolymorphicComponentProps<C, BaseLinkProps>,
  ref: React.Ref<any>
) {
  // usePathname is a client-only hook
  const pathname = usePathname();
  const isSelected = selectable ? pathname === href : false;
  const Component = as || "a";

  // Base Tailwind classes
  const baseClasses =
    "box-border inline-flex items-center whitespace-nowrap gap-2 font-semibold transition duration-200 focus:outline-none focus-visible:ring";

  // Size variants
  const sizeClasses = {
    md: "text-2xs leading-2xs px-4 py-2xs max-h-[24px]",
    lg: "text-sm leading-sm px-5 py-xs max-h-[32px]",
    xl: "text-md leading-md px-6 py-sm max-h-[48px]",
  }[size];

  // Width classes
  const widthClasses = width === "full" ? "w-full justify-center" : "";

  // Rounding variants
  const roundedClasses = {
    all: "rounded",
    none: "rounded-none",
    left: "rounded-r rounded-l-none",
    right: "rounded-l rounded-r-none",
  }[rounded];

  // Variant and background classes
  let variantClasses = "";
  if (variant === "primary") {
    if (background === "solid") {
      variantClasses =
        mode === "light"
          ? "bg-blue-600 border border-blue-700 text-white hover:bg-blue-700 hover:border-blue-900"
          : "bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700";
    } else if (background === "outlined") {
      variantClasses =
        mode === "light"
          ? "bg-white border border-blue-600 text-blue-600 hover:bg-blue-100"
          : "bg-gray-800 border border-blue-400 text-blue-400 hover:bg-blue-900";
    } else if (background === "transparent") {
      variantClasses =
        mode === "light"
          ? "bg-transparent border border-transparent text-blue-600 hover:bg-gray-200 hover:border-gray-200"
          : "bg-transparent border border-transparent text-blue-400 hover:bg-gray-900 hover:border-gray-900";
    }
  } else if (variant === "neutral") {
    if (background === "outlined") {
      variantClasses =
        mode === "light"
          ? "bg-white border border-gray-500 text-gray-800 hover:bg-gray-200"
          : "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-900";
    } else if (background === "transparent") {
      variantClasses =
        mode === "light"
          ? "bg-transparent border border-transparent text-gray-800 hover:bg-gray-200 hover:border-gray-200"
          : "bg-transparent border border-transparent text-gray-200 hover:bg-gray-900 hover:border-gray-900";
    }
  } else if (variant === "danger") {
    if (background === "solid") {
      variantClasses =
        mode === "light"
          ? "bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700"
          : "bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700";
    } else if (background === "outlined") {
      variantClasses =
        mode === "light"
          ? "bg-white border border-red-600 text-red-600 hover:bg-red-100"
          : "bg-gray-800 border border-red-400 text-red-400 hover:bg-red-900";
    }
  }

  // Selected state styling
  const selectedClasses = isSelected ? "bg-blue-100" : "";

  // Combine all classes. Notice that `className` is last so consumer classes are appended.
  const combinedClasses = clsx(
    baseClasses,
    sizeClasses,
    widthClasses,
    roundedClasses,
    variantClasses,
    selectedClasses,
    className
  );

  return (
    <Component
      ref={ref}
      className={combinedClasses}
      {...(Component === "a" ? { href } : { href })}
      {...(isSelected ? { "aria-current": "page" } : {})}
      {...rest}
    >
      {children}
    </Component>
  );
}

/** Wrap our generic component with forwardRef */
const Link = React.forwardRef(_Link) as LinkComponent;
Link.displayName = "Link";

export default Link;
