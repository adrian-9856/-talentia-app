import Link from "./safe-link";
import { ArrowRight, ChartBar, Users } from "@phosphor-icons/react/dist/ssr";

export default function Home() {
  return <div className="landing">
    <header className="landing-brand">
      <span className="brand-mark">t</span>
      <div>
        <strong>TALENTIA</strong>
        <small>Conectar talento y oportunidades</small>
      </div>
    </header>

    <main className="landing-main">
      <section className="landing-intro">
        <span className="eyebrow"><span className="status-dot"/>UNIDAD DE INSERCIÓN LABORAL</span>
        <h1>Entra a TALENTIA</h1>
        <p>Selecciona tu tipo de acceso para continuar.</p>
      </section>

      <section className="landing-choices">
        <Link href="/participante" className="landing-card participant">
          <div className="landing-card-icon"><Users size={34} weight="duotone"/></div>
          <h2>Soy participante</h2>
          <p>Completa tu recorrido: perfil, psicometría, ruta laboral y tu CV listo para enviar.</p>
          <span className="landing-card-cta">Ingresar<ArrowRight size={16}/></span>
          <small className="landing-card-note">Próximamente: iniciar sesión con Google</small>
        </Link>

        <Link href="/equipo" className="landing-card admin">
          <div className="landing-card-icon"><ChartBar size={34} weight="duotone"/></div>
          <h2>Soy del equipo</h2>
          <p>Panel administrativo con dashboard personalizable, buscador y expedientes de cada participante.</p>
          <span className="landing-card-cta">Ingresar<ArrowRight size={16}/></span>
          <small className="landing-card-note">Próximamente: iniciar sesión con Google</small>
        </Link>
      </section>
    </main>

    <footer className="landing-footer">
      <span>TALENTIA · Demostración funcional</span>
      <span>Personas y empresas ficticias. Prueba local.</span>
    </footer>
  </div>;
}
