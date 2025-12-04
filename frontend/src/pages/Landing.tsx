import { Link } from 'react-router-dom';
import { useState } from 'react';

const steps = [
  {
    title: 'Poveste, kaj iščete',
    desc: 'Nastavite lokacijo, cenovni razpon, kvadraturo in tip nepremičnine, ki vas zanima.',
    number: '01',
  },
  {
    title: 'Skavt spremlja portale',
    desc: 'Skavt samodejno spremlja nepremičninske portale in gradi svojo bazo oglasov.',
    number: '02',
  },
  {
    title: 'Prejemate samo relevantne zadetke',
    desc: 'Namesto 1000 oglasov dobite le tiste, ki ustrezajo vašim kriterijem.',
    number: '03',
  },
];

const faqs = [
  {
    q: 'Ali je uporaba v beta fazi plačljiva?',
    a: 'Ne, uporaba v beta fazi je brezplačna za sprejete uporabnike.',
  },
  {
    q: 'Kako hitro dobim obvestilo o novih oglasih?',
    a: 'Trenutno pošiljamo dnevne povzetke, kasneje bomo dodali skoraj sprotna obvestila.',
  },
  {
    q: 'Ali lahko spremenim kriterije iskanja?',
    a: 'Da, v nadzorni plošči lahko kadarkoli posodobite lokacijo, ceno, kvadraturo in druge nastavitve.',
  },
  {
    q: 'Katere portale spremljate?',
    a: 'V beta fazi pokrivamo glavne slovenske portale; seznam širimo glede na povratne informacije.',
  },
  {
    q: 'Kako deaktiviram obvestila?',
    a: 'V nadzorni plošči izklopite obvestila po e-pošti/Telegramu ali deaktivirajte profil.',
  },
  {
    q: 'Ali bo več uporabniških profilov?',
    a: 'Trenutno je 1 profil na uporabnika; več profilov je planiranih za naslednje izdaje.',
  },
];

const advantages = [
  { title: 'Manj šuma', text: 'Prejmete le oglase, ki se ujemajo z vašim proračunom in površino.' },
  { title: 'Varen dostop', text: 'Prijava z uporabniškim imenom in geslom, podatki ostanejo pri vas.' },
  { title: 'Hitre nastavitve', text: 'V nekaj minutah nastavite območje, cene in tip nepremičnine.' },
];

const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="landing-stack">
      <HeroSection />
      <HowItWorksSection steps={steps} />

      <section className="section two-col">
        <div>
          <p className="pill pill-ghost">Uporabniški račun</p>
          <h2>Vsak beta uporabnik dobi osebni dostop</h2>
          <p className="subtitle">
            Po registraciji dobite uporabniško ime, geslo in nadzorno ploščo. Tam nastavite
            lokacijo/območje, cenovni razpon, minimalno in maksimalno kvadraturo ter tip
            nepremičnine. Izberete, ali vas obveščamo po e-pošti ali prek Telegrama.
          </p>
          <Link className="btn btn-primary" to="/dashboard">
            Oglej si nadzorno ploščo
          </Link>
        </div>
        <div className="card highlight-card">
          <h3>Katere nastavitve lahko uredite?</h3>
          <ul className="checklist">
            <li>Lokacija ali širše območje</li>
            <li>Minimalna in maksimalna cena</li>
            <li>Minimalna in maksimalna kvadratura</li>
            <li>Tip nepremičnine (stanovanje, hiša ...)</li>
            <li>Obvestila po e-pošti ali Telegramu</li>
            <li>Aktivacija/deaktivacija profila</li>
          </ul>
        </div>
      </section>

      <section className="section audience">
        <div className="section-heading">
          <p className="pill pill-ghost">Za koga je</p>
          <h2>Kdo največ pridobi?</h2>
          <p className="subtitle">
            Skavt je za ljudi, ki želijo biti prvi pri dobri ponudbi in prihraniti čas.
          </p>
        </div>
        <div className="pill-list">
          <span className="pill">Kupci, ki čakajo pravi trenutek</span>
          <span className="pill">Najemniki, ki lovijo sveže oglase</span>
          <span className="pill">Investitorji z jasnim proračunom</span>
          <span className="pill">Zaposleni, ki nimajo časa za portale</span>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="pill pill-ghost">Zakaj Skavt</p>
          <h2>Prednosti pred klasičnim brskanjem</h2>
        </div>
        <div className="cards-grid">
          {advantages.map((item) => (
            <div key={item.title} className="card">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section faq">
        <div className="section-heading">
          <p className="pill pill-ghost">FAQ</p>
          <h2>Pogosta vprašanja</h2>
        </div>
        <div className="faq-list">
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={item.q} className={`faq-item ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-mark">?</span>
                  <span>{item.q}</span>
                  <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-answer" style={{ maxHeight: isOpen ? '200px' : '0px' }}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const HeroSection = () => (
  <section className="hero-premium animate-fade-in-up">
    <div className="hero-text-stack">
      <span className="badge-soft">
        <span className="pulse-dot" />
        Beta dostop za prve uporabnike
      </span>
      <h1 className="hero-title text-gradient">Slovenski nepremičninski skavt</h1>
      <p className="hero-lead">
        Skavt namesto vas prečesava nepremičninske oglase po vsej Sloveniji, jih filtrira po vaših
        kriterijih in vam pošlje samo tiste, ki so res vredni ogleda.
      </p>
      <div className="hero-cta-row">
        <Link className="cta-primary" to="/register">
          Prijavi se v beta
        </Link>
        <a className="cta-secondary" href="#kako-deluje">
          Kako deluje
        </a>
      </div>
      <p className="hero-note">Uporaba je v beta fazi brezplačna za sprejete uporabnike.</p>
    </div>

    <div className="hero-card-premium">
      <div className="hero-card-glow" />
      <div className="hero-card-inner animate-scale-in">
        <div className="hero-card-head">
          <div>
            <p className="hero-card-label">Trenutni profil</p>
            <p className="hero-card-title">Ljubljana – Šiška</p>
          </div>
          <span className="status-pill">Aktivno</span>
        </div>

        <dl className="hero-card-list">
          <div className="hero-card-row">
            <dt>Cenovni razpon</dt>
            <dd>200.000 € – 350.000 €</dd>
          </div>
          <div className="hero-card-row">
            <dt>Velikost</dt>
            <dd>50–80 m²</dd>
          </div>
          <div className="hero-card-row">
            <dt>Tip</dt>
            <dd>Stanovanje</dd>
          </div>
          <div className="hero-card-row">
            <dt>Obveščanje</dt>
            <dd>E-pošta + Telegram</dd>
          </div>
        </dl>

        <div className="hero-sample-box">
          <p className="hero-sample-label">Primer zadetkov (demo)</p>
          <div className="hero-sample-card">
            <p className="hero-sample-title">2-sobno stanovanje, prenovljeno</p>
            <p className="hero-sample-meta">Ljubljana – Šiška • 52 m² • 245.000 €</p>
            <span className="status-chip">✓ Ustreza tvojim kriterijem</span>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorksSection = ({ steps }: { steps: typeof steps }) => (
  <section id="kako-deluje" className="how-section">
    <div className="how-heading">
      <h2>Kako deluje</h2>
      <p>
        Tri preprosti koraki do nepremičninskih oglasov, ki so dejansko vredni vašega časa.
      </p>
    </div>
    <div className="how-grid stagger-children">
      {steps.map((step) => (
        <div
          key={step.number}
          className="how-card animate-fade-in-up"
        >
          <div className="how-card-top">
            <div className="how-badge">{step.number}</div>
            <span className="how-meta">Korak</span>
          </div>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
          <span className="how-watermark">{step.number}</span>
        </div>
      ))}
    </div>
  </section>
);

export default LandingPage;
