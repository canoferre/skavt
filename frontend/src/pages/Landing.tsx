import { Link } from 'react-router-dom';
import { useState } from 'react';

const steps = [
  {
    title: 'Poveste, kaj iščete',
    text: 'Vnesete območje, ceno, kvadraturo in tip nepremičnine, ki vas zanima.',
    number: '01',
  },
  {
    title: 'Skavt spremlja portale',
    text: 'Avtomatsko prečesavamo oglase in filtriramo tiste, ki ustrezajo vašim kriterijem.',
    number: '02',
  },
  {
    title: 'Prejemate samo relevantne zadetke',
    text: 'V beta fazi dobite obvestila po e-pošti ali Telegramu, brez nepotrebnega šuma.',
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
    <main className="page">
      <section className="hero">
        <div className="hero-text">
          <p className="pill">Beta dostop</p>
          <h1>
            Slovenski nepremičninski skavt – nekdo, ki namesto vas prečesava oglase.
          </h1>
          <p className="subtitle">
            Orodje za resne kupce in najemnike: nastavite iskalni profil, mi pa vsak dan preverimo,
            kaj se pojavi na portalu in vam pošljemo samo relevantne zadetke.
          </p>
          <div className="hero-actions">
            <Link className="btn btn-primary" to="/register">
              Prijavi se v beta
            </Link>
            <span className="muted">
              Uporaba je v beta fazi brezplačna za sprejete uporabnike.
            </span>
          </div>
        </div>
        <div className="hero-card">
          <div className="mock-card">
            <h3>Prednosti Skavta</h3>
            <ul>
              <li>✓ Filtrira oglase po vaših kriterijih</li>
              <li>✓ Brez ročnega osveževanja portalov</li>
              <li>✓ Obvestila prek e-pošte ali Telegrama</li>
              <li>✓ Ena nadzorna plošča za vse nastavitve</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="pill pill-ghost">Proces</p>
          <h2>Kako deluje</h2>
          <p className="subtitle">Tri preprosti koraki do vaše sanjske nepremičnine</p>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <div key={step.number} className="card step-card">
              <div className="step-number">{step.number}</div>
              <div className="icon-placeholder" aria-hidden>
                •
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

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
    </main>
  );
};

export default LandingPage;
