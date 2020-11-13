import * as React from "react";

const VitalsChartIcon = ({ width = "40", height = "40" }) => {
  return (
    <svg width={`${width}px`} height={`${height}`} viewBox="0 0 32 32">
      <title>{"chart--line"}</title>
      <path d="M4.67 28l6.39-12 7.3 6.49a2 2 0 001.7.47 2 2 0 001.42-1.07L27 10.9l-1.82-.9-5.49 11-7.3-6.49a2 2 0 00-1.68-.51 2 2 0 00-1.42 1L4 25V2H2v26a2 2 0 002 2h26v-2z" />
      <path
        data-name="&lt;Transparent Rectangle&gt;"
        fill="none"
        d="M0 0h32v32H0z"
      />
    </svg>
  );
};

export default VitalsChartIcon;
