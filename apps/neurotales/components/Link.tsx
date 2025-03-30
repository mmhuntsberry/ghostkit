"use client";

import React from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export interface BaseLinkProps {
  background?: "solid" | "outlined" | "transparent";
  mode?: "light" | "dark";
  rounded?: "left" | "right" | "all" | "none";
  size?: "md" | "lg" | "xl";
  variant?: "primary" | "neutral" | "danger";
  width?: "auto" | "full";
  className?: string;
  selectable?: boolean;
  href: string;
  children?: React.ReactNode;
}

function LinkComponent(
  {
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
  }: BaseLinkProps,
  ref: React.Ref<HTMLAnchorElement>
) {
  const pathname = usePathname();
  const isSelected = selectable ? pathname === href : false;

  const baseClasses =
    "box-border inline-flex items-center whitespace-nowrap gap-2 font-semibold transition duration-200 focus:outline-none focus-visible:ring";

  const sizeClasses = {
    md: "text-2xs leading-2xs px-4 py-2xs max-h-[24px]",
    lg: "text-sm leading-sm px-5 py-xs max-h-[32px]",
    xl: "text-md leading-md px-6 py-sm max-h-[48px]",
  }[size];

  const widthClasses = width === "full" ? "w-full justify-center" : "";

  const roundedClasses = {
    all: "rounded",
    none: "rounded-none",
    left: "rounded-r rounded-l-none",
    right: "rounded-l rounded-r-none",
  }[rounded];

  let variantClasses = "";
  if (variant === "primary") {
    variantClasses =
      mode === "light"
        ? "bg-blue-600 border border-blue-700 text-white hover:bg-blue-700 hover:border-blue-900"
        : "bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700";
  } else if (variant === "neutral") {
    variantClasses =
      mode === "light"
        ? "bg-white border border-gray-500 text-gray-800 hover:bg-gray-200"
        : "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-900";
  } else if (variant === "danger") {
    variantClasses =
      mode === "light"
        ? "bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700"
        : "bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700";
  }

  const selectedClasses = isSelected ? "bg-blue-100" : "";

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
    <a
      ref={ref}
      href={href}
      className={combinedClasses}
      aria-current={isSelected ? "page" : undefined}
      {...rest}
    >
      {children}
    </a>
  );
}

const Link = React.forwardRef(LinkComponent);
Link.displayName = "Link";

export default Link;
