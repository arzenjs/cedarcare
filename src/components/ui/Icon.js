import { Stethoscope, Baby, Sparkles, ShieldCheck, ClipboardCheck, CalendarCheck } from "lucide-react";

const icons = {
  stethoscope: Stethoscope,
  baby: Baby,
  sparkles: Sparkles,
  shield: ShieldCheck,
  clipboard: ClipboardCheck,
  calendar: CalendarCheck,
};

export default function Icon({ name, ...props }) {
  const Component = icons[name] || Stethoscope;
  return <Component aria-hidden="true" {...props} />;
}
