import React from "react";

function Icon({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size || 40}
      height={size || 40}
      viewBox="-0.5 -0.5 163 187"
    >
      <g fill="#696bc3" pointerEvents="all">
        <rect width="110" height="29" x="47" y="81" rx="4.35" ry="4.35"></rect>
        <rect width="159" height="29" x="0.25" rx="4.35" ry="4.35"></rect>
        <rect
          width="78.5"
          height="29"
          x="-25"
          y="25.75"
          rx="4.35"
          ry="4.35"
          transform="rotate(-90 14.25 40.25)"
        ></rect>
        <rect
          width="129.52"
          height="29"
          x="36.94"
          y="118.53"
          rx="14.5"
          ry="14.5"
          transform="rotate(-40 101.7 133.03)"
        ></rect>
        <rect
          width="78.5"
          height="29"
          x="-24.25"
          y="132"
          rx="4.35"
          ry="4.35"
          transform="rotate(-90 15 146.5)"
        ></rect>
        <rect
          width="111.75"
          height="29"
          x="47.25"
          y="156"
          rx="4.35"
          ry="4.35"
        ></rect>
      </g>
    </svg>
  );
}

export default Icon;