import React from "react";

export const Trilby = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none">
      <path
        fill={props.fill || "#fff"}
        fill-rule="evenodd"
        d="M32 64c17.673 0 32-14.327 32-32C64 14.327 49.673 0 32 0 14.327 0 0 14.327 0 32c0 17.673 14.327 32 32 32Zm.315-39.411c2.111 0 4.086-.478 5.625-.85.482-.117.921-.223 1.308-.3.884-.178 1.493-.223 1.958-.137.392.073.745.248 1.113.714 2.559 3.241 3.718 7.706 4.21 11.507a40.892 40.892 0 0 1 .332 5.213H18.005a37.888 37.888 0 0 1 .126-5.26c.361-3.793 1.405-8.23 3.986-11.45.385-.48.739-.652 1.117-.723.452-.085 1.046-.042 1.93.136.375.075.798.176 1.261.287 1.568.375 3.607.863 5.89.863ZM51.83 43.736h-3.433a1.489 1.489 0 0 1-.074.001l-31.713.003c-.039 0-.077-.002-.115-.004H12.8a1.5 1.5 0 1 1 0-3h2.202l-.016-.44a40.877 40.877 0 0 1 .159-5.105c.38-4.004 1.506-9.143 4.631-13.04.813-1.014 1.79-1.588 2.905-1.797 1.043-.195 2.107-.051 3.076.144.537.108 1.065.234 1.598.36 1.515.361 3.067.73 4.96.73 1.72 0 3.178-.35 4.645-.705.559-.134 1.12-.27 1.696-.386.974-.196 2.047-.338 3.095-.145 1.12.207 2.111.778 2.922 1.805 3.06 3.876 4.314 8.987 4.831 12.981a43.878 43.878 0 0 1 .357 5.598h1.969a1.5 1.5 0 0 1 0 3Z"
        clip-rule="evenodd"
      />
    </svg>
  );
};

export default Trilby;