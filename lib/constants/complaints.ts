import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react"

export const priorities = [
  {
    value: "low",
    label: "Low",
    icon: ShieldCheck,
  },
  {
    value: "medium",
    label: "Medium",
    icon: ShieldQuestion,
  },
  {
    value: "high",
    label: "High",
    icon: ShieldAlert,
  },
] 