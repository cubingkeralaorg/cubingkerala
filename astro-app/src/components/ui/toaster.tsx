import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useTheme } from "@/hooks/useTheme";

/**
 * Wraps sonner's own <Toaster> so toasts render in this app's actual
 * design-system colors (the same --popover/--border tokens Dialog and
 * DropdownMenu already use) instead of sonner's hardcoded defaults, and
 * follow the manual dark/light toggle (useTheme) rather than defaulting to
 * light regardless of the app's own theme. No richColors — every toast
 * type (success/error/info) renders the same neutral style; the message
 * itself carries the meaning, not a color code.
 */
export function Toaster({ ...props }: ToasterProps) {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "hsl(var(--popover))",
          "--normal-text": "hsl(var(--popover-foreground))",
          "--normal-border": "hsl(var(--border))",
        } as React.CSSProperties
      }
      {...props}
    />
  );
}
