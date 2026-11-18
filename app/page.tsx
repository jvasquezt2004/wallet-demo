import Link from "next/link";

const actions = [
  {
    href: "/admin",
    title: "Configurar restaurante",
    description: "Logo, colores, plantilla, sellos y recompensas. Publica y obtén tu QR.",
    icon: "🎨",
  },
  {
    href: "/scan",
    title: "Escanear cliente",
    description: "Escanea el QR del cliente para sumarle un sello al instante.",
    icon: "📷",
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    description: "Visitas por día, clientes nuevos, frecuencia y clientes inactivos.",
    icon: "📊",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-neutral-500">
        Sello Club
      </p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
        Lealtad que cabe en el bolsillo.
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-600">
        Tarjetas de sellos digitales que tus clientes guardan en Google Wallet.
        Sin apps, sin tarjetas de plástico.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md"
          >
            <div className="text-3xl">{action.icon}</div>
            <h2 className="mt-4 text-lg font-semibold">{action.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-600">
              {action.description}
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-neutral-900 group-hover:underline">
              Abrir →
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
