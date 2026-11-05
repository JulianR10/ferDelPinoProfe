'use client';
import { useEffect, useRef, useState } from 'react';
import { MAPS, WA } from './links';

const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const SEMANA = [['L', 1], ['M', 2], ['X', 3], ['J', 4], ['V', 5], ['S', 6], ['D', 0]]; // letra, día de JS
const CLASES = [2, 4]; // martes y jueves
const TURNOS = ['Mañana', 'Tarde', 'Noche'];

// Íconos simples (trazo). El de WhatsApp es el logo oficial en relleno (Simple Icons, CC0).
const Ico = ({ children }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
);
const CalendarIcon = () => <Ico><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></Ico>;
const UsersIcon = () => <Ico><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></Ico>;
const PinIcon = () => <Ico><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></Ico>;
const SunIcon = () => <Ico><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" /></Ico>;
const SunsetIcon = () => <Ico><path d="M12 10V2M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M16 18a4 4 0 0 0-8 0M8 6l4-4 4 4" /></Ico>;
const MoonIcon = () => <Ico><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></Ico>;
const TURNO_ICONS = [SunIcon, SunsetIcon, MoonIcon];
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

function proximaClase(dia) {
  if (CLASES.includes(dia)) return '¡Hoy doy clases!';
  const d = Math.min(...CLASES.map((c) => (c - dia + 7) % 7));
  return 'Mi próxima clase: ' + (d === 1 ? 'mañana' : DIAS[(dia + d) % 7]);
}

// Panel de detalle (escritorio, al pasar el mouse). Todo en primera persona.
function Detalle({ i, dia, turno }) {
  if (i === 0) return (
    <>
      <p><b>Escribime</b> por WhatsApp y reservá tu clase de tenis.</p>
      <p className="go">Tocá para abrir WhatsApp ↗</p>
    </>
  );
  if (i === 1) return (
    <>
      <div className="days">
        {SEMANA.map(([l, d]) => (
          <span key={d} className={`d${CLASES.includes(d) ? ' lit' : ''}${d === dia ? ' today' : ''}`}>{l}{d === dia && <small>hoy</small>}</span>
        ))}
      </div>
      <div className="days">
        {TURNOS.map((t, n) => (<span key={t} className={`d lit${n === turno ? ' today' : ''}`}>{t}{n === turno && <small>ahora</small>}</span>))}
      </div>
      <p><b>{proximaClase(dia)}</b> · Doy clases martes y jueves, mañana, tarde y noche.</p>
    </>
  );
  if (i === 2) return (
    <>
      <p>Te espero en el <b>Club Sportivo Laguna Larga</b><br />Agustín P. Justo s/n, X5974 Laguna Larga, Córdoba, Argentina</p>
      <p className="go">Tocá para abrir el mapa ↗</p>
    </>
  );
  return (
    <>
      <div className="gauge" aria-hidden="true">{[0, 1, 2, 3, 4].map((n) => <i key={n} />)}</div>
      <p><b>Doy clases a todas las edades.</b> Niños, jóvenes y adultos son bienvenidos.</p>
    </>
  );
}

export default function Game() {
  const [sel, setSel] = useState(0); // opción del menú enfocada (escritorio)
  const [now, setNow] = useState({ dia: 2, hora: 16 }); // se ajusta al día y hora reales del visitante
  const items = useRef([]);

  // Día y hora reales (para probar: ?dia=3 o ?hora=22)
  useEffect(() => {
    const q = new URLSearchParams(location.search), d = new Date();
    setNow({ dia: q.has('dia') ? +q.get('dia') : d.getDay(), hora: q.has('hora') ? +q.get('hora') : d.getHours() + d.getMinutes() / 60 });
  }, []);
  const turno = now.hora < 13 ? 0 : now.hora < 19.5 ? 1 : 2;

  // Opciones. `short` es lo que se ve directamente en celular (sin tocar nada); en escritorio se usa el panel.
  const ITEMS = [
    { label: 'Entrenemos juntos', href: WA, ico: <WhatsAppIcon />, main: true },
    {
      label: 'Cuándo', ico: <CalendarIcon />,
      short: (
        <>
          <span>Mar · Jue</span>
          <span className="sy" aria-label="Mañana, tarde y noche">
            {TURNO_ICONS.map((I, n) => <span key={n} className={n === turno ? 'now' : ''}><I /></span>)}
          </span>
          <em className="note">{proximaClase(now.dia)}</em>
        </>
      ),
    },
    { label: 'Dónde', href: MAPS, ico: <PinIcon />, thumb: true, short: <span>Club Sportivo · Laguna Larga ↗</span> },
    { label: 'Para quién', ico: <UsersIcon />, short: <span>Todas las edades</span> },
  ];

  // Flechas ↑ ↓ para moverse por el menú, como en un juego
  function onKey(e) {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const n = (sel + (e.key === 'ArrowDown' ? 1 : ITEMS.length - 1)) % ITEMS.length;
    setSel(n);
    items.current[n]?.focus();
  }

  return (
    <main className="stage">
      <div className="bg" />
      <div className="wash" />
      <div className="slab" />

      <div className="fer" role="img" aria-label="Fernando Del Pino, profe de tenis">
        <img src="/fer1.webp" alt="" fetchPriority="high" />
      </div>

      <div className="plate">
        <div className="face" />
        <div>
          <h1>Fernando Del Pino</h1>
          <p><i className="flag" aria-hidden="true" />Profe de tenis · Laguna Larga</p>
        </div>
      </div>

      <section className="menu-col">
        <p className="ribbon" style={{ '--i': 0 }}>Menú principal</p>
        <nav className="menu" style={{ '--i': 1 }} aria-label="Menú principal" onKeyDown={onKey}>
          {ITEMS.map((it, i) => {
            const props = {
              ref: (el) => (items.current[i] = el), className: `mi${sel === i ? ' on' : ''}${it.main ? ' main' : ''}`,
              onMouseEnter: () => setSel(i), onFocus: () => setSel(i),
            };
            const inner = (
              <>
                <span className={`ico${it.thumb ? ' thumb' : ''}`}>{it.ico}</span>
                <span className="txt"><span className="lbl">{it.label}</span>{it.short && <span className="short">{it.short}</span>}</span>
                <span className="arr" aria-hidden="true">▶</span>
              </>
            );
            return it.href
              ? <a key={it.label} {...props} href={it.href} target="_blank" rel="noopener">{inner}</a>
              : <button key={it.label} {...props} onClick={() => setSel(i)}>{inner}</button>;
          })}
        </nav>
        <div className="panel" style={{ '--i': 2 }} aria-live="polite">
          <h2>{ITEMS[sel].label}</h2>
          <div className="pbody" key={sel}><Detalle i={sel} dia={now.dia} turno={turno} /></div>
        </div>
        <p className="hint" style={{ '--i': 3 }}><span><kbd>↑</kbd><kbd>↓</kbd> Elegir</span><span><kbd>⏎</kbd> Aceptar</span></p>
      </section>

      <a className="firma" href="https://julianrecarte.dev/es" target="_blank" rel="noopener"><img src="/firma.png" alt="Sitio hecho por Julian Recarte" /></a>
    </main>
  );
}
