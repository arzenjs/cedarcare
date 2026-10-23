const styles = {
  scheduled: ["Scheduled", "bg-blue-50 text-blue-900 border-blue-200"],
  checked_in: ["Checked in", "bg-amber-50 text-amber-900 border-amber-200"],
  completed: ["Completed", "bg-emerald-50 text-emerald-900 border-emerald-200"],
  cancelled: ["Cancelled", "bg-red-50 text-red-900 border-red-200"],
  no_show: ["No-show", "bg-stone-100 text-stone-800 border-stone-300"],
};

export default function StatusBadge({ status }) {
  const [label, cls] = styles[status] || [status, "bg-stone-100"];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}
