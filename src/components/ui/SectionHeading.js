export default function SectionHeading({ title, intro, as: Tag = "h2" }) {
  return (
    <div className="max-w-2xl">
      <Tag className="text-3xl sm:text-4xl text-cedar-dark">{title}</Tag>
      {intro && <p className="mt-3 text-lg leading-relaxed text-muted">{intro}</p>}
    </div>
  );
}
