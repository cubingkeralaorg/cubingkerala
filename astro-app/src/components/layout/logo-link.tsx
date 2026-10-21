import { NAVBAR_LOGO_LINK_CLASS } from "./navbar/layout";
import { cn } from "@/lib/utils";

export function LogoLink({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <a href="/" onClick={onClick} className={cn(NAVBAR_LOGO_LINK_CLASS, "flex items-center gap-2", className)}>
      <img src="/cubingkerala_logo.svg" alt="" width={22} height={22} className="size-[22px] shrink-0" />
      Cubing Kerala
    </a>
  );
}
