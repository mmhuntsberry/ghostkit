import React from "react";
import clsx from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  background?: "solid" | "outlined" | "transparent";
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  mode?: "light" | "dark";
  rounded?: "left" | "right" | "all" | "none";
  size?: "md" | "lg" | "xl";
  variant?: "primary" | "neutral" | "danger";
  width?: "auto" | "full";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      background = "solid",
      children,
      loading = false,
      mode = "light",
      size = "xl",
      rounded = "all",
      variant = "primary",
      width = "auto",
      className,
      ...rest
    },
    ref
  ) => {
    // Base Tailwind classes common to all buttons
    const baseClasses =
      "box-border inline-flex items-center whitespace-nowrap gap-2 font-semibold transition duration-200 focus:outline-none focus-visible:ring";

    // Size variants – adjust these values to suit your design system
    const sizeClasses = {
      md: "text-2xs leading-2xs px-4 py-2xs max-h-[24px] font-semibold",
      lg: "text-sm leading-sm px-5 py-xs max-h-[32px] font-semibold",
      xl: "text-md leading-md px-6 py-sm max-h-[48px] font-semibold",
    }[size];

    // Width: full-width if needed
    const widthClasses = width === "full" ? "w-full justify-center" : "";

    // Rounding variants
    const roundedClasses = {
      all: "rounded",
      none: "rounded-none",
      left: "rounded-r rounded-l-none",
      right: "rounded-l rounded-r-none",
    }[rounded];

    // Compute variant and background combinations:
    let variantClasses = "";

    if (variant === "primary") {
      if (background === "solid") {
        variantClasses =
          mode === "light"
            ? "bg-blue-600 border border-blue-700 text-white hover:bg-blue-700 hover:border-blue-900 active:shadow-[0_0_0_6px_rgba(12,87,205,0.16)]"
            : "bg-blue-600 border border-blue-600 text-white hover:bg-blue-700 hover:border-blue-700 active:shadow-[0_0_0_6px_rgba(12,87,205,0.16)]";
      } else if (background === "outlined") {
        variantClasses =
          mode === "light"
            ? "bg-white border border-blue-600 text-blue-600 hover:bg-blue-100 active:shadow-[0_0_0_6px_rgba(12,87,205,0.16)]"
            : "bg-gray-800 border border-blue-400 text-blue-400 hover:bg-blue-900 active:shadow-[0_0_0_6px_rgba(12,87,205,0.16)]";
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
            ? "bg-white border border-gray-500 text-gray-800 hover:bg-gray-200 active:shadow-[0_0_0_6px_rgba(107,114,128,0.16)]"
            : "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-900 active:shadow-[0_0_0_6px_rgba(107,114,128,0.16)]";
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
            ? "bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700 active:shadow-[0_0_0_6px_rgba(209,40,40,0.16)]"
            : "bg-red-600 border border-red-600 text-white hover:bg-red-700 hover:border-red-700 active:shadow-[0_0_0_6px_rgba(209,40,40,0.16)]";
      } else if (background === "outlined") {
        variantClasses =
          mode === "light"
            ? "bg-white border border-red-600 text-red-600 hover:bg-red-100 active:shadow-[0_0_0_6px_rgba(209,40,40,0.16)]"
            : "bg-gray-800 border border-red-400 text-red-400 hover:bg-red-900 active:shadow-[0_0_0_6px_rgba(209,40,40,0.16)]";
      }
    }

    // Disabled or loading state
    const disabledClasses =
      rest.disabled || loading ? "opacity-50 cursor-not-allowed" : "";

    // Combine all classes with any additional className passed in
    const combinedClasses = clsx(
      baseClasses,
      sizeClasses,
      widthClasses,
      roundedClasses,
      variantClasses,
      disabledClasses,
      className
    );

    return (
      <button ref={ref} className={combinedClasses} {...rest}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
