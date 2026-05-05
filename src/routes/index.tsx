import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useLenis } from "@/hooks/use-lenis";
import heroImg from "@/assets/hero-coffee.jpg";
import aboutImg from "@/assets/about-barista.jpg";
import espresso from "@/assets/menu-espresso.jpg";
import latte from "@/assets/menu-latte.jpg";
import coldbrew from "@/assets/menu-coldbrew.jpg";
import cappuccino from "@/assets/menu-cappuccino.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Mulier · Hogar de Café | Café de especialidad en Zacatecas" },
      { name: "description", content: "Mulier. Hogar de Café — café de especialidad, arte y comunidad en el corazón de Zacatecas Centro. Visítanos." },
      { property: "og:title", content: "Mulier · Hogar de Café" },
      { property: "og:description", content: "Café de especialidad, arte y comunidad en Zacatecas Centro." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

const WHATSAPP = "https://wa.me/524920000000?text=Hola%20Mulier!%20Quiero%20hacer%20un%20pedido";

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <About />
      <Menu />
      <Testimonials />
      <Gallery />
      <CTA />
      <Footer />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "bg-background/85 backdrop-blur-xl border-b border-border" : ""}`}>
      <nav className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-cobalt flex items-center justify-center text-primary-foreground font-display text-lg italic">M</div>
          <span className="font-display text-xl tracking-tight">Mulier<span className="text-cobalt">.</span></span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#menu" className="hover:text-cobalt transition-colors">Menú</a>
          <a href="#about" className="hover:text-cobalt transition-colors">Nosotros</a>
          <a href="#gallery" className="hover:text-cobalt transition-colors">Galería</a>
          <a href="#visit" className="hover:text-cobalt transition-colors">Visítanos</a>
        </div>
        <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex items-center gap-2 bg-foreground text-background px-5 py-2.5 rounded-full text-sm font-medium hover:bg-cobalt transition-colors">
          Pedir ahora
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-end pt-24 pb-16 px-6 md:px-10">
      <div className="absolute inset-0 -z-10">
        <img src={heroImg} alt="Latte Mulier sobre fondo azul cobalto" width={1536} height={1536} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
      </div>
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-10 items-end">
        <div className="md:col-span-8 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-6 text-xs uppercase tracking-[0.25em] text-cobalt">
            <span className="w-8 h-px bg-cobalt" /> Zacatecas Centro · Desde 2021
          </div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight mb-6">
            Hogar de café,<br />
            <span className="italic text-cobalt">arte</span> y comunidad.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
            Café de especialidad tostado con paciencia. Un espacio azul para encontrarse, leer, estudiar o simplemente respirar.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#menu" className="inline-flex items-center gap-2 bg-cobalt text-primary-foreground px-7 py-4 rounded-full font-medium shadow-soft hover:scale-[1.02] transition-transform">
              Ver el menú
              <span aria-hidden>→</span>
            </a>
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-foreground/20 px-7 py-4 rounded-full font-medium hover:bg-foreground hover:text-background transition-colors">
              Pedir por WhatsApp
            </a>
          </div>
        </div>
        <div className="md:col-span-4 md:text-right animate-fade-in">
          <div className="inline-block bg-cobalt text-primary-foreground p-6 rounded-2xl shadow-sharp max-w-xs">
            <div className="text-xs uppercase tracking-widest opacity-80 mb-2">Edición de temporada</div>
            <div className="font-display text-2xl mb-1">Latte de Cardamomo</div>
            <div className="text-sm opacity-90">Disponible hasta agotar existencias.</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Café de especialidad", "Tueste artesanal", "Arte local", "Zacatecas Centro", "Comunidad", "Granos de origen"];
  return (
    <div className="border-y border-border bg-cobalt text-primary-foreground py-5 overflow-hidden">
      <div className="flex gap-12 animate-marquee whitespace-nowrap font-display text-2xl italic">
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="flex items-center gap-12">
            {it} <span className="opacity-50">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <img src={aboutImg} alt="Barista preparando café en Mulier" loading="lazy" width={1280} height={1600} className="w-full h-[600px] object-cover rounded-2xl shadow-sharp" />
          <div className="absolute -bottom-6 -right-6 bg-cobalt text-primary-foreground p-6 rounded-2xl max-w-[220px] hidden md:block">
            <div className="font-display text-4xl">04</div>
            <div className="text-xs uppercase tracking-widest opacity-80 mt-1">Años tostando<br />historias</div>
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-cobalt mb-4">Nuestra historia</div>
          <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
            Un rincón azul donde el café <em className="text-cobalt not-italic">se vuelve hogar</em>.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-5">
            Mulier nació de la obsesión por una taza honesta. Buscamos granos de pequeños productores mexicanos, los tostamos con paciencia y los servimos en un espacio pensado para conversaciones largas.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            Más que una cafetería, somos un punto de encuentro para estudiantes, parejas y todos los que creen que el arte y la comunidad caben en una taza.
          </p>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
            <Stat n="100%" l="Café mexicano" />
            <Stat n="12+" l="Variedades" />
            <Stat n="4.9★" l="Google reviews" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl text-cobalt">{n}</div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{l}</div>
    </div>
  );
}

function Menu() {
  const items = [
    { img: espresso, name: "Espresso", desc: "Doble shot, cuerpo intenso, notas de chocolate amargo.", price: "$45" },
    { img: latte, name: "Latte de la Casa", desc: "Espresso, leche cremosa y arte en cada taza.", price: "$65" },
    { img: coldbrew, name: "Cold Brew 18h", desc: "Extracción lenta en frío, dulce y refrescante.", price: "$70" },
    { img: cappuccino, name: "Cappuccino", desc: "Equilibrio perfecto entre espresso y espuma sedosa.", price: "$60" },
  ];
  return (
    <section id="menu" className="py-28 px-6 md:px-10 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-cobalt mb-4">Nuestro menú</div>
            <h2 className="font-display text-4xl md:text-6xl leading-tight max-w-2xl">
              Bebidas pensadas, <em className="text-cobalt not-italic">una por una</em>.
            </h2>
          </div>
          <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 hover:text-cobalt">Ver carta completa →</a>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it, i) => (
            <article key={it.name} className="group bg-card rounded-2xl overflow-hidden hover:shadow-soft transition-all duration-500 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="aspect-square overflow-hidden">
                <img src={it.img} alt={it.name} loading="lazy" width={1024} height={1024} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-display text-xl">{it.name}</h3>
                  <span className="text-cobalt font-medium">{it.price}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    { name: "Ana Sofía R.", text: "El mejor café de Zacatecas. El latte de cardamomo es una experiencia. Y el espacio… puro arte.", role: "Estudiante" },
    { name: "Diego M.", text: "Vinimos en una cita y terminamos quedándonos tres horas. La atención y el café son impecables.", role: "Visitante" },
    { name: "Renata L.", text: "Mi rincón favorito para estudiar. Wifi rápido, baristas que saben y un cold brew que enamora.", role: "Universitaria" },
  ];
  return (
    <section className="py-28 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-xs uppercase tracking-[0.25em] text-cobalt mb-4">La comunidad opina</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Más de <em className="text-cobalt not-italic">500 reseñas</em> con 4.9★
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <figure key={r.name} className="bg-card border border-border p-8 rounded-2xl flex flex-col">
              <div className="text-cobalt mb-4 text-lg tracking-widest">★★★★★</div>
              <blockquote className="font-display text-xl leading-snug mb-6 flex-1">"{r.text}"</blockquote>
              <figcaption>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="py-28 px-6 md:px-10 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 max-w-2xl">
          <div className="text-xs uppercase tracking-[0.25em] text-cobalt mb-4">El espacio</div>
          <h2 className="font-display text-4xl md:text-6xl leading-tight">
            Un lugar pensado para <em className="text-cobalt not-italic">quedarse</em>.
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <img src={g1} alt="Interior del café" loading="lazy" width={1280} height={1600} className="col-span-2 row-span-2 w-full h-full object-cover rounded-2xl aspect-[4/5]" />
          <img src={g3} alt="Taza humeante" loading="lazy" width={1280} height={1600} className="w-full h-full object-cover rounded-2xl aspect-square" />
          <img src={g2} alt="Pareja conversando" loading="lazy" width={1280} height={1280} className="w-full h-full object-cover rounded-2xl aspect-square" />
          <img src={g4} alt="Granos tostándose" loading="lazy" width={1280} height={1280} className="col-span-2 w-full h-full object-cover rounded-2xl aspect-[2/1]" />
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="visit" className="py-28 px-6 md:px-10">
      <div className="max-w-6xl mx-auto bg-cobalt text-primary-foreground rounded-3xl p-10 md:p-20 text-center shadow-sharp relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="text-xs uppercase tracking-[0.25em] opacity-80 mb-5">Te esperamos</div>
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] mb-6">
            Tu próxima taza<br />ya tiene <em className="not-italic">nombre</em>.
          </h2>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-10">
            Visítanos en Zacatecas Centro o haz tu pedido directo por WhatsApp. Mostrando este sitio: <strong>10% off</strong> en tu primera bebida.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-background text-foreground px-7 py-4 rounded-full font-medium hover:scale-[1.02] transition-transform">
              Pedir por WhatsApp
            </a>
            <a href="https://maps.google.com/?q=Zacatecas+Centro" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-primary-foreground/40 px-7 py-4 rounded-full font-medium hover:bg-primary-foreground hover:text-cobalt transition-colors">
              Cómo llegar
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border px-6 md:px-10 py-16">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-full bg-cobalt flex items-center justify-center text-primary-foreground font-display text-lg italic">M</div>
            <span className="font-display text-xl">Mulier<span className="text-cobalt">.</span> Hogar de Café</span>
          </div>
          <p className="text-muted-foreground max-w-sm">Café de especialidad, arte y comunidad en el corazón de Zacatecas.</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-cobalt mb-3">Visítanos</div>
          <p className="text-sm text-muted-foreground">Zacatecas Centro<br />Zacatecas, México</p>
          <p className="text-sm text-muted-foreground mt-3">Lun – Vie · 8am – 9pm<br />Sáb – Dom · 9am – 10pm</p>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-cobalt mb-3">Síguenos</div>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-cobalt">Instagram</a></li>
            <li><a href="#" className="hover:text-cobalt">TikTok</a></li>
            <li><a href={WHATSAPP} className="hover:text-cobalt">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-14 pt-8 border-t border-border flex flex-wrap gap-3 justify-between text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Mulier. Hogar de Café.</span>
        <span>Hecho con cariño en Zacatecas.</span>
      </div>
    </footer>
  );
}
