// Service descriptions are informational and make no promises of outcomes.
export const services = [
  {
    id: "general-consultation",
    title: "General consultation",
    icon: "stethoscope",
    description:
      "A conversation and examination for everyday concerns such as fever, cough, aches or tiredness. Your doctor will discuss what they find and suggest sensible next steps.",
    bring: "Any recent reports and a list of medicines you currently take.",
  },
  {
    id: "child-health",
    title: "Child health consultation",
    icon: "baby",
    description:
      "Visits for infants, children and teenagers, including growth and development checks and questions about common childhood illnesses.",
    bring: "Your child's vaccination card, if you have one.",
  },
  {
    id: "skin-consultation",
    title: "Skin consultation",
    icon: "sparkles",
    description:
      "An assessment of skin, hair or nail concerns. The dermatologist will explain the likely causes and the options available to you.",
    bring: "Names of any creams or products you currently use.",
  },
  {
    id: "preventive-checkup",
    title: "Preventive health checkup",
    icon: "shield",
    description:
      "A routine visit to review your general health, talk about risk factors and discuss whether any screening is appropriate for your age and history.",
    bring: "Family health history, if you know it.",
  },
  {
    id: "routine-assessment",
    title: "Routine health assessment",
    icon: "clipboard",
    description:
      "A structured review of vital signs and general health, useful before travel, work or school requirements, or simply to keep track of how you are doing.",
    bring: "Any forms you need completed.",
  },
  {
    id: "follow-up",
    title: "Follow-up consultation",
    icon: "calendar",
    description:
      "A shorter visit to review how you are progressing after an earlier consultation and to adjust the plan if needed.",
    bring: "Previous prescriptions or reports from your last visit.",
  },
];

export const getService = (id) => services.find((s) => s.id === id) || null;
