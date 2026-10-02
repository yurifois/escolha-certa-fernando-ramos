import {
  Briefcase,
  Building2,
  Car,
  HeartHandshake,
  House,
  KeyRound,
  Plane,
  Smile,
  Stethoscope,
  type LucideProps,
} from "lucide-react";
import type { IconKey } from "@/lib/services";

const MAP = {
  car: Car,
  home: House,
  briefcase: Briefcase,
  heart: HeartHandshake,
  plane: Plane,
  building: Building2,
  key: KeyRound,
  stethoscope: Stethoscope,
  smile: Smile,
} satisfies Record<IconKey, React.ComponentType<LucideProps>>;

export default function ServiceIcon({ icon, ...props }: { icon: IconKey } & LucideProps) {
  const Icon = MAP[icon];
  return <Icon strokeWidth={1.6} aria-hidden="true" {...props} />;
}
