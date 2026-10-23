import { services } from "@/data/services";
import { doctors } from "@/data/doctors";
import Icon from "@/components/ui/Icon";
import BookLink from "@/components/ui/BookLink";

export const metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <div className="page-width py-16">
      <h1 className="text-5xl text-cedar-dark">Services</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        Descriptions are for information only and do not promise any particular result. Your doctor will advise what is right for you.
      </p>

      <ul className="mt-12">
        {services.map((s) => {
          const providers = doctors.filter((d) => d.services.includes(s.id));
          return (
            <li key={s.id} className="grid gap-6 border-t border-line py-10 md:grid-cols-[auto_1fr_auto] md:items-start">
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-mist text-cedar"><Icon name={s.icon} size={28} /></span>
              <div>
                <h2 className="text-2xl text-cedar-dark">{s.title}</h2>
                <p className="mt-2 max-w-prose leading-relaxed text-muted">{s.description}</p>
                <p className="mt-3 text-sm"><strong>Suggested to bring:</strong> {s.bring}</p>
                <p className="mt-1 text-sm text-muted">Available with {providers.map((d) => d.name).join(", ")}</p>
              </div>
              <BookLink serviceId={s.id} doctorId={providers.length === 1 ? providers[0].id : undefined}>Book this service</BookLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
