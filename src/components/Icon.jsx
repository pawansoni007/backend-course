/* Minimal stroke icons (no icon font, no emoji). */
const P = {
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></>,
  flip: <><path d="M4 7h11a5 5 0 0 1 0 10H9" /><path d="m7 4-3 3 3 3" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />,
  auto: <><circle cx="12" cy="12" r="8" /><path d="M12 4v16" /><path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" /></>,
  left: <path d="m15 5-7 7 7 7" />,
  right: <path d="m9 5 7 7-7 7" />,
  play: <path d="M7 4v16l13-8Z" />,
  pause: <><path d="M8 5v14M16 5v14" /></>,
  close: <path d="M5 5l14 14M19 5 5 19" />,
  shuffle: <><path d="M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4" /><path d="m18 4 3 3-3 3M18 14l3 3-3 3" /></>,
  restart: <><path d="M4 12a8 8 0 1 0 2.3-5.6" /><path d="M4 4v5h5" /></>,
  expand: <><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  check: <path d="m5 12 5 5 9-10" />,
};
export default function Icon({ name, size = 20, stroke = 2.4, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={stroke} strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" {...rest}>
      {P[name]}
    </svg>
  );
}
