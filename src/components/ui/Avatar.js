import Image from "next/image";

// Small round crop of a doctor's portrait (same image as everywhere else).
export default function Avatar({ doctor, size = 56 }) {
  return (
    <span className="relative block shrink-0 overflow-hidden rounded-full bg-mist" style={{ width: size, height: size }}>
      <Image src={doctor.image} alt={doctor.imageAlt} width={400} height={500} sizes={`${size}px`} className="h-full w-full object-cover object-[50%_28%]" />
    </span>
  );
}
