
import React from 'react';

export const GutterIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 14h16" />
    <path d="M4 10h16" />
    <path d="M12 2v6" />
    <path d="M12 14v6" />
    <path d="M8 10v4" />
    <path d="M16 10v4" />
  </svg>
);
