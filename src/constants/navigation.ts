export interface NavLink {
  href: string;
  label: string;
}

export const NAV_LINKS: NavLink[] = [
  { href: "/competitions", label: "Competitions" },
  { href: "/rankings", label: "Rankings" },
  { href: "/members", label: "Members" },
  { href: "/learn", label: "Learn" },
  { href: "/contact", label: "Contact" },
];

export const LOGO_PATH = "/logotransparent.png";
export const ADMIN_USER_ID = 6996;
