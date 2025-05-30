import type React from "react"
import { Badge as UIBadge } from "@/components/ui/badge"

export function Badge({
  variant,
  children,
}: { variant: "default" | "secondary" | "outline"; children: React.ReactNode }) {
  return <UIBadge variant={variant}>{children}</UIBadge>
}
