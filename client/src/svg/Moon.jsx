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
    <path d="M18.25 15.75c-1.015.54-2.02.5-3.25.5A7.25 7.25 0 0 1 7.75 9c0-1.23-.04-2.235.5-3.25-2.289 1.219-3.5 3.476-3.5 6.25A7.25 7.25 0 0 0 12 19.25c2.774 0 5.031-1.211 6.25-3.5Z" />
    <path d="M16 4.75C16 6.96 14.96 9 12.75 9 14.96 9 16 11.04 16 13.25 16 11.04 17.04 9 19.25 9 17.04 9 16 6.96 16 4.75Z" />
  </svg>
);

export default Icon;
