import type { ReactNode, SVGProps } from "react";

// Iconos dibujados con un solo trazo (2px, extremos redondeados) para toda la app.
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const WalletIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H18a2 2 0 0 1 2 2v1.5" />
    <path d="M3 7.5V17a2 2 0 0 0 2 2h13.5a1.5 1.5 0 0 0 1.5-1.5v-8A1.5 1.5 0 0 0 18.5 8H5.5A2.5 2.5 0 0 1 3 5.5" />
    <circle cx="16" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
  </Icon>
);

export const QrIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
    <path d="M14 14h2.5v2.5M20.5 14v.01M14 20.5h.01M17 20.5h3.5V18" />
  </Icon>
);

export const CameraIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 8.5A1.5 1.5 0 0 1 5.5 7H8l1.2-2h5.6L16 7h2.5A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" />
    <circle cx="12" cy="13" r="3.2" />
  </Icon>
);

export const ChartIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
  </Icon>
);

export const BrushIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14.5 4.5l5 5L10 19H5v-5z" />
    <path d="M12.5 6.5l5 5" />
  </Icon>
);

export const CheckIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4.5 12.5l5 5L19.5 7" />
  </Icon>
);

export const CloseIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);

export const PlusIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const ArrowIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const BackIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const CopyIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </Icon>
);

export const AlertIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4.5l9 15.5H3z" />
    <path d="M12 10.5v4M12 17.2v.01" />
  </Icon>
);

export const GiftIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="4" y="9" width="16" height="11" rx="1.5" />
    <path d="M3 9h18v-2.5H3zM12 6.5V20" />
    <path d="M12 6.5C10 6.5 8.2 5.8 8.2 4.4 8.2 3.2 9.2 2.7 10.2 3.1 11.3 3.6 12 5.2 12 6.5zM12 6.5c2 0 3.8-.7 3.8-2.1 0-1.2-1-1.7-2-1.3C12.7 3.6 12 5.2 12 6.5z" />
  </Icon>
);

export const UsersIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="9" cy="8.5" r="3.2" />
    <path d="M3 19.5c.4-3.2 2.9-5 6-5s5.6 1.8 6 5" />
    <path d="M16.5 5.6a3 3 0 0 1 0 5.8M18 14.9c1.7.6 2.8 2.1 3 4.6" />
  </Icon>
);

export const MailIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 7.5l8.5 6 8.5-6" />
  </Icon>
);

export const RefreshIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5" />
  </Icon>
);

export const HomeIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 11l8-6.5 8 6.5M6 9.5V20h12V9.5" />
  </Icon>
);

export const KeyboardIcon = (p: IconProps) => (
  <Icon {...p}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7 14h10" />
  </Icon>
);

export const ExternalIcon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 4.5h5.5V10M19.5 4.5L11 13M17 14v4a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 5 18V9a1.5 1.5 0 0 1 1.5-1.5H10" />
  </Icon>
);

export const InfoIcon = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8v.01" />
  </Icon>
);
