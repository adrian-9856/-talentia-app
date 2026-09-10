import type { AnchorHTMLAttributes } from "react";

export default function SafeLink({ href, children, ...props }: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a href={href} {...props}>{children}</a>;
}
