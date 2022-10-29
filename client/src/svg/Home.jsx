import * as React from "react";

const Icon = ({
  size = 48,
  strokeWidth = 1.5,
  color = "currentColor",
  ...props
}) => (
  <svg
    width={size}
    height={size}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={strokeWidth}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M6.75 19.25h10.5a2 2 0 0 0 2-2v-7.5l-7.25-5-7.25 5v7.5a2 2 0 0 0 2 2Z" />
    <path d="M9.75 15.75a2 2 0 0 1 2-2h.5a2 2 0 0 1 2 2v3.5h-4.5v-3.5Z" />
  </svg>
);

export default Icon;
