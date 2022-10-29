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
    <path d="M12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 1 0 0-6.5z" />
    <path d="M12 2.75v1.5" />
    <path d="m17.25 6.75-1.184 1.184" />
    <path d="M21.25 12h-1.5" />
    <path d="m17.25 17.25-1.184-1.184" />
    <path d="M12 19.75v1.5" />
    <path d="M7.934 16.066 6.75 17.25" />
    <path d="M4.25 12h-1.5" />
    <path d="M7.934 7.934 6.75 6.75" />
  </svg>
);

export default Icon;
