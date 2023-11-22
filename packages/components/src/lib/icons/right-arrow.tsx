import React from "react";

export const RightArrow = (props) => {
  return (
    <svg width="24" height="25" fill="none">
      <path
        fill={props.fill || "#fff"}
        d="m20.648 12.897-6.75 6.75a.563.563 0 0 1-.796-.795l5.79-5.79H3.75a.563.563 0 0 1 0-1.125h15.142l-5.79-5.79a.562.562 0 0 1 .796-.795l6.75 6.75a.563.563 0 0 1 0 .795Z"
      />
    </svg>
  );
};

export default RightArrow;
