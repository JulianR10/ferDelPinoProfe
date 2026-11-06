'use client';
import { useEffect, useRef, useState } from 'react';
import { MAPS, WA } from './links';

const SEMANA = [['L', 1], ['M', 2], ['X', 3], ['J', 4], ['V', 5], ['S', 6], ['D', 0]]; // letra, día de JS
const DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const CLASES = [2, 4]; // martes y jueves

// Saque de Fernando: pose de espera + 3 cuadros del golpe, con cortes bruscos (sin transición).
// dy baja los cuadros del golpe un poco: en fer1 los pies están más abajo de la imagen que en los otros y así no "saltan".
const FRAMES = [
  { src: '/fer1.webp', ms: 0, dy: 0 }, // espera
  { src: '/fer2.webp', ms: 200, dy: 2.7 }, // armado
  { src: '/fer3.webp', ms: 140, dy: 2.8 }, // impacto
  { src: '/fer4.webp', ms: 700, dy: 2.7 }, // seguimiento
];
const PRIMER_GOLPE = 1200; // ms desde que carga la página
const ESPERA = 5000; // ms entre un golpe y el siguiente

// Recorrido de la pelota después del golpe. Fernando mira de frente y pega un revés: la pelota cruza delante de su cuerpo
// y sale hacia abajo y a la izquierda, acercándose al espectador (por eso crece hasta salir de la pantalla).
// x, y = centro de la pelota en % del cuadrado de Fernando (así es igual en escritorio y celular); s = escala; ms = cuánto dura ese paso.
// El paso 1 es donde estaba dibujada en fer4. Para ajustar el recorrido basta con tocar estos números.
const BOLA = [
  { x: 80, y: 30, s: 1.0, ms: 50 }, // sale de la raqueta (donde estaba en fer3)
  { x: 48, y: 46, s: 1.0, ms: 55 }, // cruzando delante del cuerpo (viene de la raqueta)
  { x: 14.1, y: 62.6, s: 1.0, ms: 70 },
  { x: 8, y: 72, s: 1.35, ms: 70 },
  { x: 1, y: 82, s: 1.85, ms: 70 },
  { x: -8, y: 94, s: 2.5, ms: 70 },
  { x: -20, y: 108, s: 3.3, ms: 70 },
  { x: -34, y: 125, s: 4.0, ms: 70 }, // ya fuera de la pantalla
];

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
const TrophyIcon = () => <Ico><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-1.21 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98 1.21 1.21C16.15 18.75 17 20.24 17 22M18 2H6v7a6 6 0 0 0 12 0V2Z" /></Ico>;
const TURNO_ICONS = [SunIcon, SunsetIcon, MoonIcon]; // mañana, tarde, noche
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

// Día, hora y fecha de Argentina (Córdoba, UTC-3, sin horario de verano), estés donde estés: las clases son allí.
// `fecha` = días desde 1970 según el calendario argentino (para contar días hasta un torneo).
function ahoraArg(d = new Date()) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', { timeZone: 'America/Argentina/Cordoba', weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(d).map((x) => [x.type, x.value]),
  );
  return {
    dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday),
    hora: +p.hour + +p.minute / 60,
    fecha: Date.UTC(+p.year, +p.month - 1, +p.day) / 86400000,
  };
}

// Grand Slams: inicio y final del CUADRO PRINCIPAL (sin la semana de clasificación). Hay que revisarlos una vez al año.
// Verificadas el 06/11/2026: Australian Open (melbournepark.com.au) y Wimbledon (wimbledon.com).
// PROVISORIAS: Roland Garros (según LTA, falta la web oficial) y US Open (la USTA confirma las fechas en diciembre).
// Cuando pasa el último de la lista, el cartel se oculta solo.
const SLAMS = [
  { n: 'Australian Open', d: '2027-01-17', h: '2027-01-31' },
  { n: 'Roland Garros', d: '2027-05-23', h: '2027-06-06' },
  { n: 'Wimbledon', d: '2027-06-28', h: '2027-07-11' },
  { n: 'US Open', d: '2027-08-29', h: '2027-09-12' },
];
const aDias = (iso) => Date.parse(iso + 'T00:00:00Z') / 86400000;
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const corta = (iso) => `${+iso.slice(8)} ${MESES[+iso.slice(5, 7) - 1]}`;

function proximoSlam(hoy) { // el que está en juego o el siguiente; null si ya no queda ninguno
  const s = SLAMS.find((x) => hoy <= aDias(x.h));
  if (!s) return null;
  const faltan = aDias(s.d) - hoy;
  return { ...s, faltan, texto: faltan > 1 ? `en ${faltan} días` : faltan === 1 ? 'mañana' : faltan === 0 ? '¡empieza hoy!' : '¡en juego!', vivo: faltan <= 0 };
}

function proximaClase(dia) {
  if (CLASES.includes(dia)) return '¡Hoy doy clases!';
  const d = Math.min(...CLASES.map((c) => (c - dia + 7) % 7));
  return 'Mi próxima clase: ' + (d === 1 ? 'mañana' : DIAS[(dia + d) % 7]);
}

export default function Game() {
  const [now, setNow] = useState({ dia: 2, hora: 16, fecha: null }); // se ajusta al día y hora de Argentina al cargar
  const [frame, setFrame] = useState(0); // cuadro de Fernando que se ve
  const [bola, setBola] = useState(-1); // paso de la pelota que se ve (-1 = oculta)
  const imgs = useRef([]);
  const bolaImg = useRef(null);

  // Hace el golpe (cuadros 1→4), la pelota se aleja, espera 5 s y repite. Sin movimiento si el teléfono pide "reducir movimiento".
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let vivo = true;
    const ts = new Set(); // todos los temporizadores, para cancelarlos juntos al salir
    const esperar = (ms) => new Promise((r) => { const id = setTimeout(() => { ts.delete(id); r(); }, ms); ts.add(id); });
    const volar = async () => { // la pelota va por su cuenta y no frena a Fernando
      for (let i = 0; i < BOLA.length && vivo; i++) { setBola(i); await esperar(BOLA[i].ms); }
      if (vivo) setBola(-1);
    };
    (async () => {
      await Promise.all([...imgs.current, bolaImg.current].map((el) => el?.decode().catch(() => {}))); // todo listo antes del primer golpe
      await esperar(PRIMER_GOLPE);
      while (vivo) {
        while (document.hidden && vivo) await esperar(500); // con la pestaña oculta no gasta batería
        for (let k = 1; k < FRAMES.length && vivo; k++) {
          setFrame(k);
          if (k === FRAMES.length - 1) volar(); // al llegar el seguimiento, sale la pelota
          await esperar(FRAMES[k].ms);
        }
        setFrame(0);
        await esperar(ESPERA);
      }
    })();
    return () => { vivo = false; ts.forEach(clearTimeout); };
  }, []);

  // Día y hora de Argentina (para probar: ?dia=3, ?hora=22 o ?fecha=2027-01-10)
  useEffect(() => {
    const q = new URLSearchParams(location.search), a = ahoraArg();
    setNow({
      dia: q.has('dia') ? +q.get('dia') : a.dia,
      hora: q.has('hora') ? +q.get('hora') : a.hora,
      fecha: q.has('fecha') ? aDias(q.get('fecha')) : a.fecha,
    });
  }, []);
  const slam = now.fecha == null ? null : proximoSlam(now.fecha); // hasta que se sabe la fecha no se dibuja nada
  const listo = now.fecha != null; // antes de saber la fecha de Argentina no se marca ningún día/turno (evita mostrar datos falsos un instante)
  const turno = !listo ? -1 : now.hora < 13 ? 0 : now.hora < 19.5 ? 1 : 2;

  return (
    <main className="stage">
      <div className="bg" />
      <div className="wash" />
      <div className="slab" />

      <div className={`fer ${frame === 0 ? 'idle' : 'swing'}`} role="img" aria-label="Fernando Del Pino, profe de tenis">
        {FRAMES.map((f, i) => (
          <img
            key={f.src} ref={(el) => (imgs.current[i] = el)} src={f.src} alt="" className={`frame${i === frame ? ' on' : ''}`}
            style={f.dy ? { transform: `translateY(${f.dy}%)` } : undefined} fetchPriority={i ? 'low' : 'high'}
          />
        ))}
        {[2, 1, 0].map((atras) => { // la pelota + 2 estelas tenues en sus posiciones anteriores
          const p = BOLA[bola - atras];
          return (
            <img
              key={atras} ref={atras === 0 ? bolaImg : undefined} className="bola" src="/bola.png" alt="" aria-hidden="true"
              style={p ? { left: p.x + '%', top: p.y + '%', '--s': p.s, opacity: [1, 0.5, 0.25][atras] } : undefined}
            />
          );
        })}
      </div>

      <div className="plate">
        <div className="face" />
        <div>
          <h1>Fernando Del Pino</h1>
          <p><i className="flag" aria-hidden="true" />Profe de tenis · Laguna Larga</p>
        </div>
      </div>

      {slam && (() => {
        const t = <span className="tk"><TrophyIcon /><b>{slam.n}</b> · {slam.texto} · cuadro principal del {corta(slam.d)} al {corta(slam.h)}</span>;
        return <div className={`ticker${slam.vivo ? ' live' : ''}`} role="note"><div className="belt">{t}{t}{t}{t}</div></div>;
      })()}

      <section className="menu-col">
        <div className="info" style={{ '--i': 1 }}>
          <div className="row">
            <span className="ico"><CalendarIcon /></span>
            <span className="txt">
              <span className="lbl">Cuándo</span>
              <span className="val">
                <span>Mar · Jue</span>
                <span className="sy" aria-label="Mañana, tarde y noche">
                  {TURNO_ICONS.map((I, n) => <span key={n} className={n === turno ? 'now' : ''}><I /></span>)}
                </span>
              </span>
              <em className="note">{listo ? proximaClase(now.dia) : ' '}</em>
              <span className="days xtra" aria-hidden="true">
                {SEMANA.map(([l, d]) => (
                  <span key={d} className={`d${CLASES.includes(d) ? ' lit' : ''}${listo && d === now.dia ? ' today' : ''}`}>{l}{listo && d === now.dia && <small>hoy</small>}</span>
                ))}
              </span>
            </span>
          </div>

          <div className="row">
            <span className="ico"><PinIcon /></span>
            <span className="txt">
              <span className="lbl">Dónde</span>
              <span className="val"><a className="lnk" href={MAPS} target="_blank" rel="noopener" aria-label="Club Sportivo Laguna Larga, abrir en Google Maps (se abre en una pestaña nueva)">Club Sportivo · Laguna Larga ↗</a></span>
              <em className="note xtra">Te espero en Agustín P. Justo s/n, X5974 Laguna Larga, Córdoba</em>
            </span>
          </div>

          <div className="row">
            <span className="ico"><UsersIcon /></span>
            <span className="txt">
              <span className="lbl">Para quién</span>
              <span className="val">Todas las edades</span>
              <em className="note xtra">Doy clases a niños, jóvenes y adultos</em>
            </span>
          </div>
        </div>

        <a className="mi" style={{ '--i': 2 }} href={WA} target="_blank" rel="noopener" aria-label="Entrenemos juntos: escribime por WhatsApp (se abre en una pestaña nueva)">
          <span className="ico"><WhatsAppIcon /></span>
          <span className="txt"><span className="lbl">Entrenemos juntos</span><span className="sub">Escribime por WhatsApp</span></span>
          <span className="arr" aria-hidden="true">▶</span>
        </a>
      </section>

      <a className="firma" href="https://julianrecarte.dev/es" target="_blank" rel="noopener"><img src="/firma-blanca.png" alt="Sitio hecho por Julian Recarte (se abre en una pestaña nueva)" /></a>
    </main>
  );
}
