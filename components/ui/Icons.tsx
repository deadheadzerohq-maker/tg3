import React from "react";

export type IconProps = React.SVGProps<SVGSVGElement>;

export const BellIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14.172V11a6 6 0 10-12 0v3.172a2 2 0 01-.6 1.428L4 17h5" />
    <path d="M9.5 19a2.5 2.5 0 005 0" />
  </svg>
);

export const DownloadIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 3v12" />
    <path d="M7 12l5 5 5-5" />
    <path d="M4 19h16" />
  </svg>
);

export const MapIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  </svg>
);

export const ShieldCheckIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 21s-7-3.5-7-9V5l7-3 7 3v7c0 5.5-7 9-7 9z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const SignalIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 20v-4" />
    <path d="M9 20v-7" />
    <path d="M14 20v-10" />
    <path d="M19 20V7" />
  </svg>
);

export const ArrowUpRightIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M7 17L17 7" />
    <path d="M10 7h7v7" />
  </svg>
);

export const RadarIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3v3" />
    <path d="M12 12l4-4" />
    <path d="M12 12l6 6" />
  </svg>
);

export const ShieldIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 21s-7-3.5-7-9V5l7-3 7 3v7c0 5.5-7 9-7 9z" />
  </svg>
);

export const ZapIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2l-6 11h5l-1 7 6-11h-5l1-7z" />
  </svg>
);
