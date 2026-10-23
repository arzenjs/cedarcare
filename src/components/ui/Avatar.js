// Doctor portrait: a clean monogram, so there are never broken or missing photos.
// Swap for <Image> with real photos later without changing any page.
export default function Avatar({ name, tone = "#2f7d6e", size = 96 }) {
  const initials = name.replace("Dr. ", "").split(" ").map((p) => p[0]).join("");
  return (
    <div
      role="img"
      aria-label={`Portrait placeholder for ${name}`}
      style={{ width: size, height: size, background: tone, fontSize: size * 0.36 }}
      className="grid shrink-0 place-items-center rounded-full font-display text-white"
    >
      {initials}
    </div>
  );
}
