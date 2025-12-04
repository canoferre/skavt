import { FormEvent, useEffect, useState } from 'react';

type ProfileForm = {
  location: string;
  min_price: string;
  max_price: string;
  min_sqm: string;
  max_sqm: string;
  property_type: string;
  notify_email: boolean;
  notify_telegram: boolean;
  is_active: boolean;
};

type Listing = {
  id: number;
  source?: string;
  listing_id?: string;
  title?: string | null;
  location?: string | null;
  city?: string | null;
  district?: string | null;
  price_eur?: number | null;
  size_m2?: number | null;
  url?: string;
  first_seen?: string;
};

const defaultProfile: ProfileForm = {
  location: '',
  min_price: '',
  max_price: '',
  min_sqm: '',
  max_sqm: '',
  property_type: '',
  notify_email: false,
  notify_telegram: false,
  is_active: true,
};

const DashboardPage = () => {
  const [profile, setProfile] = useState<ProfileForm>(defaultProfile);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState<boolean>(false);

  const fetchListings = async () => {
    setLoadingListings(true);
    try {
      const res = await fetch('/api/listings_search.php', { credentials: 'include' });
      const data = await res.json();
      if (res.ok && data.success) {
        setListings(data.listings || []);
      } else {
        setListings([]);
      }
    } catch (err) {
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/profile_get.php', { credentials: 'include' });
        const data = await res.json();
        if (res.ok && data.profile) {
          setProfile({
            location: data.profile.location ?? '',
            min_price: data.profile.min_price ? String(data.profile.min_price) : '',
            max_price: data.profile.max_price ? String(data.profile.max_price) : '',
            min_sqm: data.profile.min_sqm ? String(data.profile.min_sqm) : '',
            max_sqm: data.profile.max_sqm ? String(data.profile.max_sqm) : '',
            property_type: data.profile.property_type ?? '',
            notify_email: Boolean(Number(data.profile.notify_email)),
            notify_telegram: Boolean(Number(data.profile.notify_telegram)),
            is_active: Boolean(Number(data.profile.is_active)),
          });
        } else {
          setProfile(defaultProfile);
        }
      } catch (err) {
        setError('Napaka pri nalaganju profila.');
      } finally {
        setLoading(false);
        fetchListings();
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field: keyof ProfileForm, value: string | boolean) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const numberOrNull = (value: string) => (value === '' ? null : Number(value));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch('/api/profile_save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          location: profile.location,
          min_price: numberOrNull(profile.min_price),
          max_price: numberOrNull(profile.max_price),
          min_sqm: numberOrNull(profile.min_sqm),
          max_sqm: numberOrNull(profile.max_sqm),
          property_type: profile.property_type,
          notify_email: profile.notify_email,
          notify_telegram: profile.notify_telegram,
          is_active: profile.is_active,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || 'Napaka pri shranjevanju.');
        return;
      }
      setMessage(data.message || 'Profil je shranjen.');
      if (data.profile) {
        setProfile({
          location: data.profile.location ?? '',
          min_price: data.profile.min_price ? String(data.profile.min_price) : '',
          max_price: data.profile.max_price ? String(data.profile.max_price) : '',
          min_sqm: data.profile.min_sqm ? String(data.profile.min_sqm) : '',
          max_sqm: data.profile.max_sqm ? String(data.profile.max_sqm) : '',
          property_type: data.profile.property_type ?? '',
          notify_email: Boolean(Number(data.profile.notify_email)),
          notify_telegram: Boolean(Number(data.profile.notify_telegram)),
          is_active: Boolean(Number(data.profile.is_active)),
        });
        fetchListings();
      }
    } catch (err) {
      setError('Napaka pri shranjevanju profila.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page page-center">
        <div className="card">
          <p>Nalaganje nadzorne plošče...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-padded">
      <div className="page-header">
        <div>
          <p className="pill pill-ghost">Beta nadzorna plošča</p>
          <h1>Nadzorna plošča</h1>
          <p className="subtitle">
            Uredi svoj iskalni profil in spremljaj, kako ti Skavt išče najboljše nepremičnine.
          </p>
        </div>
      </div>

      <div className="grid two-columns">
        <div>
          <div className="card">
            <h3>Nastavitve iskanja</h3>
            <p className="muted">Vnesi ali posodobi kriterije iskanja.</p>
            {message && <div className="alert success">{message}</div>}
            {error && <div className="alert">{error}</div>}
            <form className="form" onSubmit={handleSubmit}>
              <label>
                Lokacija / območje iskanja
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="npr. Ljubljana, primestje ..."
                />
              </label>
              <div className="grid two-columns form-gap">
                <label>
                  Minimalna cena (€)
                  <input
                    type="number"
                    min="0"
                    value={profile.min_price}
                    onChange={(e) => handleChange('min_price', e.target.value)}
                    placeholder="150000"
                  />
                </label>
                <label>
                  Maksimalna cena (€)
                  <input
                    type="number"
                    min="0"
                    value={profile.max_price}
                    onChange={(e) => handleChange('max_price', e.target.value)}
                    placeholder="300000"
                  />
                </label>
              </div>
              <div className="grid two-columns form-gap">
                <label>
                  Minimalna kvadratura (m²)
                  <input
                    type="number"
                    min="0"
                    value={profile.min_sqm}
                    onChange={(e) => handleChange('min_sqm', e.target.value)}
                    placeholder="50"
                  />
                </label>
                <label>
                  Maksimalna kvadratura (m²)
                  <input
                    type="number"
                    min="0"
                    value={profile.max_sqm}
                    onChange={(e) => handleChange('max_sqm', e.target.value)}
                    placeholder="120"
                  />
                </label>
              </div>
              <label>
                Tip nepremičnine
                <select
                  value={profile.property_type}
                  onChange={(e) => handleChange('property_type', e.target.value)}
                >
                  <option value="">Izberi tip</option>
                  <option value="Stanovanje">Stanovanje</option>
                  <option value="Hiša">Hiša</option>
                  <option value="Zemljišče">Zemljišče</option>
                  <option value="Drugo">Drugo</option>
                </select>
              </label>
              <div className="checkbox-group">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={profile.notify_email}
                    onChange={(e) => handleChange('notify_email', e.target.checked)}
                  />
                  <span>Obvestila po e-pošti</span>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={profile.notify_telegram}
                    onChange={(e) => handleChange('notify_telegram', e.target.checked)}
                  />
                  <span>Obvestila prek Telegrama</span>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={profile.is_active}
                    onChange={(e) => handleChange('is_active', e.target.checked)}
                  />
                  <span>Profil aktiven</span>
                </label>
              </div>
              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? 'Shranjujem ...' : 'Shrani nastavitve'}
              </button>
            </form>
          </div>
        </div>

        <div className="side-stack">
          <div className="card">
            <h3>Povzetek profila</h3>
            <ul className="summary-list">
              <li>
                <span>Lokacija</span>
                <strong>{profile.location || 'Ni nastavljeno'}</strong>
              </li>
              <li>
                <span>Cenovni razpon</span>
                <strong>
                  {profile.min_price || '—'} € – {profile.max_price || '—'} €
                </strong>
              </li>
              <li>
                <span>Velikost</span>
                <strong>
                  {profile.min_sqm || '—'} m² – {profile.max_sqm || '—'} m²
                </strong>
              </li>
              <li>
                <span>Tip</span>
                <strong>{profile.property_type || 'Ni izbrano'}</strong>
              </li>
              <li>
                <span>Obvestila</span>
                <strong>
                  {profile.notify_email ? 'E-pošta' : ''} {profile.notify_telegram ? 'Telegram' : ''}
                  {!profile.notify_email && !profile.notify_telegram ? 'Ni vklopljeno' : ''}
                </strong>
              </li>
              <li>
                <span>Status</span>
                <strong className={profile.is_active ? 'status-active' : 'status-muted'}>
                  {profile.is_active ? 'Aktiven' : 'Onemogočen'}
                </strong>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3>Primer zadetkov (demo)</h3>
            {loadingListings && <p className="muted">Nalaganje zadetkov ...</p>}
            {!loadingListings && listings.length === 0 && (
              <p className="muted">Ni zadetkov. Prilagodite kriterije ali poskusite kasneje.</p>
            )}
            <div className="listings">
              {listings.map((item) => (
                <a key={item.id} href={item.url} target="_blank" rel="noreferrer" className="listing listing-link">
                  <div>
                    <p className="listing-title">{item.title || 'Oglas'}</p>
                    <p className="muted">
                      {item.city || item.district || item.location || 'Neznana lokacija'}
                    </p>
                  </div>
                  <div className="listing-meta">
                    <span className="badge badge-success">Ustreza tvojim kriterijem</span>
                    <strong>
                      {item.price_eur ? `${item.price_eur.toLocaleString('sl-SI')} €` : 'Cena ni znana'}
                    </strong>
                    <span>{item.size_m2 ? `${item.size_m2} m²` : 'm² ni podano'}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
