// Fictional doctors for a demo. Every qualification and biography is sample content.
// This file is the only place doctor details and schedules are defined.
//
// weekly: weekday number (1 = Monday ... 6 = Saturday) -> list of [start, end] sessions.
// Gaps between sessions are breaks. Times are clinic local time (Asia/Kolkata).

export const doctors = [
  {
    id: "aditi-sharma",
    name: "Dr. Aditi Sharma",
    specialty: "General Physician",
    summary: "Everyday health concerns, preventive checkups and long-term follow-up.",
    bio: "Dr. Sharma leads CedarCare's general medicine clinic. She focuses on listening carefully, explaining findings in plain language, and building a care plan that fits the patient's routine.",
    qualifications: ["MBBS (sample)", "MD, General Medicine (sample)"],
    experience: "12 years (sample)",
    slotMinutes: 20,
    services: ["general-consultation", "preventive-checkup", "routine-assessment", "follow-up"],
    weekly: {
      1: [["09:00", "13:00"], ["15:00", "19:00"]],
      2: [["09:00", "13:00"], ["15:00", "19:00"]],
      3: [["09:00", "13:00"], ["15:00", "19:00"]],
      4: [["09:00", "13:00"], ["15:00", "19:00"]],
      5: [["09:00", "13:00"], ["15:00", "19:00"]],
      6: [["09:00", "13:00"]],
    },
    leaveDates: [],
    tone: "#2f7d6e",
  },
  {
    id: "rohan-verma",
    name: "Dr. Rohan Verma",
    specialty: "Pediatrician",
    summary: "Child health, growth checks and guidance for worried parents.",
    bio: "Dr. Verma sees infants, children and teenagers. He keeps visits calm and unhurried, and takes time to answer parents' questions about growth, routine care and common childhood illnesses.",
    qualifications: ["MBBS (sample)", "MD, Pediatrics (sample)"],
    experience: "9 years (sample)",
    slotMinutes: 15,
    services: ["child-health", "preventive-checkup", "follow-up"],
    weekly: {
      1: [["10:00", "13:00"], ["16:00", "19:00"]],
      2: [["10:00", "13:00"], ["16:00", "19:00"]],
      4: [["10:00", "13:00"], ["16:00", "19:00"]],
      5: [["10:00", "13:00"], ["16:00", "19:00"]],
      6: [["10:00", "14:00"]],
    },
    leaveDates: [],
    tone: "#3a6ea5",
  },
  {
    id: "neha-singh",
    name: "Dr. Neha Singh",
    specialty: "Dermatologist",
    summary: "Skin, hair and nail concerns, assessed with care and clear next steps.",
    bio: "Dr. Singh consults on common skin, hair and nail concerns. She explains what she sees, what the options are, and what to expect, without rushing the conversation.",
    qualifications: ["MBBS (sample)", "MD, Dermatology (sample)"],
    experience: "8 years (sample)",
    slotMinutes: 30,
    services: ["skin-consultation", "follow-up"],
    weekly: {
      2: [["11:00", "14:00"], ["16:00", "19:00"]],
      3: [["11:00", "14:00"], ["16:00", "19:00"]],
      5: [["11:00", "14:00"], ["16:00", "19:00"]],
      6: [["11:00", "14:00"]],
    },
    leaveDates: [],
    tone: "#8a5a8f",
  },
];

export const getDoctor = (id) => doctors.find((d) => d.id === id) || null;
