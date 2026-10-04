/* CampusIllustrations.jsx — Inline SVG illustration library for Campus Companion */

/* ─── Campus Hero (Login page) ─── */
export const CampusHeroIllustration = () => (
  <svg viewBox="0 0 520 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="csky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#254a7a" stopOpacity="0.7" />
      </linearGradient>
      <linearGradient id="cground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3d6b4f" />
        <stop offset="100%" stopColor="#2a4f38" />
      </linearGradient>
      <linearGradient id="cbldg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#c9a46e" />
        <stop offset="100%" stopColor="#a8895a" />
      </linearGradient>
      <radialGradient id="cglow" cx="50%" cy="30%" r="50%">
        <stop offset="0%" stopColor="#d4ae48" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#d4ae48" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="520" height="400" fill="url(#csky)" />
    <ellipse cx="260" cy="80" rx="280" ry="120" fill="url(#cglow)" />
    <rect x="130" y="100" width="260" height="180" fill="url(#cbldg)" rx="4" />
    <polygon points="100,100 260,50 420,100" fill="#8a6914" />
    <rect x="235" y="55" width="50" height="45" fill="#c29a2c" />
    <rect x="155" y="100" width="14" height="180" fill="#b8924a" opacity="0.7" rx="2" />
    <rect x="195" y="100" width="14" height="180" fill="#b8924a" opacity="0.7" rx="2" />
    <rect x="235" y="100" width="14" height="180" fill="#b8924a" opacity="0.7" rx="2" />
    <rect x="295" y="100" width="14" height="180" fill="#b8924a" opacity="0.7" rx="2" />
    <rect x="335" y="100" width="14" height="180" fill="#b8924a" opacity="0.7" rx="2" />
    <rect x="375" y="100" width="14" height="180" fill="#b8924a" opacity="0.7" rx="2" />
    <rect x="145" y="120" width="30" height="40" fill="#1e3a5f" opacity="0.6" rx="2" />
    <rect x="195" y="120" width="30" height="40" fill="#1e3a5f" opacity="0.6" rx="2" />
    <rect x="245" y="120" width="30" height="40" fill="#1e3a5f" opacity="0.6" rx="2" />
    <rect x="295" y="120" width="30" height="40" fill="#1e3a5f" opacity="0.6" rx="2" />
    <rect x="345" y="120" width="30" height="40" fill="#1e3a5f" opacity="0.6" rx="2" />
    <rect x="223" y="200" width="54" height="80" fill="#1e3a5f" opacity="0.7" rx="3" />
    <rect x="0" y="270" width="520" height="130" fill="url(#cground)" />
    <rect x="85" y="225" width="10" height="55" fill="#6b4a2a" rx="2" />
    <ellipse cx="90" cy="200" rx="38" ry="48" fill="#3d6b4f" />
    <ellipse cx="75" cy="215" rx="22" ry="28" fill="#4d8463" />
    <ellipse cx="108" cy="208" rx="20" ry="26" fill="#4d8463" />
    <rect x="415" y="230" width="10" height="50" fill="#6b4a2a" rx="2" />
    <ellipse cx="420" cy="205" rx="35" ry="45" fill="#3d6b4f" />
    <ellipse cx="405" cy="218" rx="20" ry="26" fill="#4d8463" />
    <ellipse cx="155" cy="295" rx="10" ry="10" fill="#f9edd0" />
    <rect x="148" y="303" width="14" height="20" fill="#254a7a" rx="3" />
    <rect x="140" y="308" width="40" height="4" fill="#8a6914" opacity="0.7" rx="1" />
    <ellipse cx="310" cy="285" rx="9" ry="9" fill="#f9edd0" />
    <rect x="304" y="292" width="12" height="18" fill="#5fa378" rx="2" />
    <ellipse cx="360" cy="288" rx="9" ry="9" fill="#f9edd0" />
    <rect x="354" y="295" width="12" height="20" fill="#3970b0" rx="2" />
    <rect x="366" y="297" width="8" height="12" fill="#c29a2c" opacity="0.8" rx="2" />
    <circle cx="430" cy="50" r="28" fill="#d4ae48" opacity="0.85" />
    <circle cx="430" cy="50" r="20" fill="#e2c874" />
    <text x="250" y="95" textAnchor="middle" fontSize="10" fill="#f9edd0" fontWeight="bold" opacity="0.8">TCE</text>
  </svg>
);

/* ─── Library Hero (Register page) ─── */
export const LibraryIllustration = () => (
  <svg viewBox="0 0 520 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="lbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#111f35" />
        <stop offset="100%" stopColor="#1e3a5f" />
      </linearGradient>
      <linearGradient id="lshelf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6b4a2a" />
        <stop offset="100%" stopColor="#4a3218" />
      </linearGradient>
      <linearGradient id="lwlight" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f9edd0" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#f9edd0" stopOpacity="0.03" />
      </linearGradient>
    </defs>
    <rect width="520" height="400" fill="url(#lbg)" />
    <rect x="185" y="20" width="150" height="200" fill="url(#lwlight)" rx="6" />
    <rect x="185" y="20" width="150" height="200" fill="none" stroke="#c29a2c" strokeWidth="3" rx="6" />
    <line x1="260" y1="20" x2="260" y2="220" stroke="#c29a2c" strokeWidth="2" />
    <line x1="185" y1="120" x2="335" y2="120" stroke="#c29a2c" strokeWidth="2" />
    <polygon points="185,20 335,20 380,400 140,400" fill="url(#lwlight)" opacity="0.3" />
    <rect x="10" y="40" width="160" height="12" fill="url(#lshelf)" />
    <rect x="12" y="0" width="13" height="42" fill="#3970b0" rx="1" opacity="0.85" />
    <rect x="28" y="5" width="13" height="37" fill="#d45252" rx="1" opacity="0.85" />
    <rect x="44" y="2" width="13" height="40" fill="#5fa378" rx="1" opacity="0.85" />
    <rect x="60" y="6" width="13" height="36" fill="#c29a2c" rx="1" opacity="0.85" />
    <rect x="76" y="1" width="13" height="41" fill="#7061a3" rx="1" opacity="0.85" />
    <rect x="92" y="4" width="13" height="38" fill="#0f8a8a" rx="1" opacity="0.85" />
    <rect x="108" y="7" width="13" height="35" fill="#254a7a" rx="1" opacity="0.85" />
    <rect x="124" y="3" width="13" height="39" fill="#8a6914" rx="1" opacity="0.85" />
    <rect x="140" y="8" width="13" height="34" fill="#4d8463" rx="1" opacity="0.85" />
    <rect x="10" y="130" width="160" height="12" fill="url(#lshelf)" />
    <rect x="12" y="90" width="13" height="42" fill="#c29a2c" rx="1" opacity="0.85" />
    <rect x="28" y="95" width="13" height="37" fill="#3970b0" rx="1" opacity="0.85" />
    <rect x="44" y="92" width="13" height="40" fill="#7061a3" rx="1" opacity="0.85" />
    <rect x="60" y="96" width="13" height="36" fill="#5fa378" rx="1" opacity="0.85" />
    <rect x="76" y="91" width="13" height="41" fill="#d45252" rx="1" opacity="0.85" />
    <rect x="92" y="94" width="13" height="38" fill="#0f8a8a" rx="1" opacity="0.85" />
    <rect x="350" y="40" width="160" height="12" fill="url(#lshelf)" />
    <rect x="352" y="0" width="13" height="42" fill="#c29a2c" rx="1" opacity="0.85" />
    <rect x="368" y="5" width="13" height="37" fill="#3970b0" rx="1" opacity="0.85" />
    <rect x="384" y="2" width="13" height="40" fill="#5fa378" rx="1" opacity="0.85" />
    <rect x="400" y="6" width="13" height="36" fill="#d45252" rx="1" opacity="0.85" />
    <rect x="416" y="1" width="13" height="41" fill="#8a6914" rx="1" opacity="0.85" />
    <rect x="432" y="4" width="13" height="38" fill="#7061a3" rx="1" opacity="0.85" />
    <rect x="448" y="7" width="13" height="35" fill="#0d6e6e" rx="1" opacity="0.85" />
    <rect x="140" y="280" width="240" height="10" fill="#6b4a2a" rx="2" />
    <rect x="195" y="265" width="50" height="16" fill="#fef6e9" rx="1" />
    <rect x="245" y="265" width="50" height="16" fill="#fdf0d5" rx="1" />
    <ellipse cx="250" cy="255" rx="14" ry="14" fill="#f9edd0" />
    <rect x="237" y="267" width="26" height="30" fill="#254a7a" rx="4" />
    <ellipse cx="260" cy="200" rx="200" ry="150" fill="#d4ae48" opacity="0.03" />
  </svg>
);

/* ─── Dashboard Hero ─── */
export const DashboardHeroIllustration = () => (
  <svg viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="dhbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#14a6a6" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#d4ae48" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <rect width="400" height="240" fill="url(#dhbg)" rx="16" />
    <rect x="120" y="60" width="160" height="130" fill="#e3edf7" opacity="0.4" rx="3" />
    <polygon points="100,60 200,30 300,60" fill="#bdd4ea" opacity="0.5" />
    <rect x="135" y="75" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="175" y="75" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="215" y="75" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="255" y="75" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="135" y="105" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="175" y="105" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="215" y="105" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="255" y="105" width="20" height="22" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="178" y="140" width="44" height="50" fill="#3970b0" opacity="0.35" rx="2" />
    <rect x="70" y="155" width="7" height="35" fill="#6b4a2a" opacity="0.6" rx="2" />
    <ellipse cx="73" cy="140" rx="24" ry="30" fill="#4d8463" opacity="0.7" />
    <ellipse cx="60" cy="152" rx="15" ry="18" fill="#5fa378" opacity="0.6" />
    <rect x="318" y="158" width="7" height="32" fill="#6b4a2a" opacity="0.6" rx="2" />
    <ellipse cx="321" cy="144" rx="22" ry="27" fill="#4d8463" opacity="0.7" />
    <ellipse cx="220" cy="205" rx="9" ry="9" fill="#f9edd0" opacity="0.9" />
    <rect x="213" y="212" width="14" height="18" fill="#3970b0" opacity="0.8" rx="3" />
    <ellipse cx="270" cy="208" rx="8" ry="8" fill="#f9edd0" opacity="0.9" />
    <rect x="263" y="214" width="14" height="16" fill="#5fa378" opacity="0.8" rx="3" />
    <circle cx="340" cy="50" r="22" fill="#d4ae48" opacity="0.6" />
    <circle cx="340" cy="50" r="15" fill="#e2c874" opacity="0.7" />
    <circle cx="30" cy="40" r="4" fill="#d4ae48" opacity="0.3" />
    <circle cx="380" cy="80" r="4" fill="#d4ae48" opacity="0.3" />
    <circle cx="370" cy="180" r="4" fill="#d4ae48" opacity="0.3" />
    <circle cx="25" cy="200" r="4" fill="#d4ae48" opacity="0.3" />
  </svg>
);

/* ─── Announcement Notice Board ─── */
export const AnnouncementIllustration = ({ seed = 0 }) => {
  const bgs = ['#e3edf7', '#d4f2f2', '#f9edd0', '#d5ede0', '#fce8e8'];
  const accents = ['#1e3a5f', '#0d6e6e', '#8a6914', '#3d6b4f', '#b84040'];
  const seconds = ['#3970b0', '#14a6a6', '#c29a2c', '#5fa378', '#e06b6b'];
  const pins = ['#d45252', '#c29a2c', '#3970b0', '#d45252', '#3970b0'];
  const i = seed % 5;
  return (
    <svg viewBox="0 0 320 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <rect width="320" height="180" fill={bgs[i]} />
      <rect x="20" y="15" width="280" height="150" fill="#d4a96a" opacity="0.25" rx="4" />
      <rect x="20" y="15" width="280" height="150" fill="none" stroke="#8a6914" strokeWidth="3" rx="4" />
      <rect x="55" y="30" width="200" height="110" fill="#fefcf9" rx="3" />
      <rect x="55" y="30" width="200" height="10" fill={accents[i]} rx="3" opacity="0.8" />
      <rect x="70" y="50" width="160" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="70" y="62" width="160" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="70" y="74" width="120" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="70" y="86" width="120" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="70" y="98" width="120" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="70" y="110" width="120" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="70" y="122" width="120" height="4" fill={accents[i]} opacity="0.12" rx="1" />
      <rect x="65" y="95" width="50" height="35" fill={seconds[i]} opacity="0.2" rx="2" />
      <circle cx="155" cy="32" r="5" fill={pins[i]} />
      <circle cx="155" cy="32" r="2.5" fill="#fff" opacity="0.5" />
      <circle cx="60" cy="48" r="4" fill="#c29a2c" />
      <circle cx="258" cy="43" r="4" fill="#5fa378" />
      <rect x="50" y="28" width="30" height="6" fill={seconds[i]} opacity="0.25" rx="1" />
      <rect x="238" y="28" width="30" height="6" fill={seconds[i]} opacity="0.25" rx="1" />
    </svg>
  );
};

/* ─── Event Illustration ─── */
export const EventIllustration = ({ seed = 0 }) => {
  const bg1s = ['#1e3a5f', '#3d6b4f', '#5e4f8a', '#0d6e6e', '#b84040'];
  const bg2s = ['#254a7a', '#4d8463', '#7061a3', '#0f8a8a', '#d45252'];
  const accs = ['#d4ae48', '#e2c874', '#d4ae48', '#f9edd0', '#f9edd0'];
  const icons = ['mic', 'trophy', 'star', 'book', 'flag'];
  const n = seed % 5;
  const bg1 = bg1s[n]; const bg2 = bg2s[n]; const acc = accs[n]; const icon = icons[n];
  const gid = 'evbg' + seed;
  return (
    <svg viewBox="0 0 320 185" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={bg1} />
          <stop offset="100%" stopColor={bg2} />
        </linearGradient>
      </defs>
      <rect width="320" height="185" fill={'url(#' + gid + ')'} />
      <circle cx="260" cy="30" r="60" fill={acc} opacity="0.06" />
      <circle cx="50" cy="150" r="50" fill={acc} opacity="0.06" />
      <ellipse cx="160" cy="150" rx="120" ry="25" fill={acc} opacity="0.12" />
      {icon === 'mic' && (
        <>
          <rect x="145" y="55" width="30" height="50" fill={acc} opacity="0.8" rx="15" />
          <rect x="155" y="104" width="10" height="20" fill={acc} opacity="0.6" />
          <rect x="140" y="122" width="40" height="4" fill={acc} opacity="0.6" rx="2" />
        </>
      )}
      {icon === 'trophy' && (
        <>
          <rect x="142" y="80" width="36" height="40" fill={acc} opacity="0.8" rx="4" />
          <ellipse cx="160" cy="80" rx="22" ry="10" fill={acc} opacity="0.8" />
          <rect x="152" y="118" width="16" height="8" fill={acc} opacity="0.6" />
          <rect x="140" y="124" width="40" height="5" fill={acc} opacity="0.6" rx="2" />
          <rect x="138" y="90" width="10" height="20" fill={acc} opacity="0.5" rx="3" />
          <rect x="172" y="90" width="10" height="20" fill={acc} opacity="0.5" rx="3" />
        </>
      )}
      {icon === 'star' && (
        <polygon points="160,55 170,83 200,83 176,100 185,128 160,111 135,128 144,100 120,83 150,83" fill={acc} opacity="0.8" />
      )}
      {icon === 'book' && (
        <>
          <rect x="130" y="65" width="30" height="60" fill="#fef6e9" opacity="0.85" rx="2" />
          <rect x="160" y="65" width="30" height="60" fill="#fdf0d5" opacity="0.85" rx="2" />
          <rect x="158" y="63" width="4" height="64" fill={acc} opacity="0.5" rx="1" />
        </>
      )}
      {icon === 'flag' && (
        <>
          <rect x="155" y="50" width="4" height="80" fill={acc} opacity="0.7" rx="1" />
          <polygon points="159,55 200,70 159,85" fill={acc} opacity="0.85" />
        </>
      )}
      <circle cx="30" cy="30" r="1.5" fill={acc} opacity="0.4" />
      <circle cx="280" cy="40" r="1.5" fill={acc} opacity="0.4" />
      <circle cx="40" cy="160" r="1.5" fill={acc} opacity="0.4" />
      <circle cx="300" cy="150" r="1.5" fill={acc} opacity="0.4" />
    </svg>
  );
};

/* ─── Notes Illustration ─── */
export const NotesIllustration = ({ seed = 0 }) => {
  const covers = ['#1e3a5f', '#3d6b4f', '#5e4f8a', '#8a6914', '#0d6e6e', '#b84040'];
  const badges = ['#d4ae48', '#c29a2c', '#d4ae48', '#3970b0', '#d4ae48', '#d4ae48'];
  const n = seed % 6; const cover = covers[n]; const badge = badges[n];
  const gid = 'nbg' + seed;
  return (
    <svg viewBox="0 0 320 185" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0f5fb" />
          <stop offset="100%" stopColor="#e3edf7" />
        </linearGradient>
      </defs>
      <rect width="320" height="185" fill={'url(#' + gid + ')'} />
      <rect x="30" y="90" width="50" height="80" fill="#bdd4ea" opacity="0.4" rx="3" />
      <rect x="240" y="95" width="50" height="75" fill="#d5ede0" opacity="0.4" rx="3" />
      <rect x="93" y="36" width="130" height="130" fill={cover} opacity="0.7" rx="4" />
      <rect x="95" y="36" width="125" height="128" fill="#fefcf9" rx="3" />
      <rect x="95" y="36" width="18" height="128" fill={cover} rx="3" />
      <rect x="118" y="50" width="90" height="8" fill={cover} opacity="0.7" rx="2" />
      <rect x="118" y="64" width="75" height="5" fill={cover} opacity="0.4" rx="1" />
      <rect x="118" y="76" width="45" height="16" fill={badge} rx="3" />
      <rect x="170" y="76" width="32" height="16" fill={cover} opacity="0.6" rx="3" />
      <rect x="120" y="100" width="88" height="3.5" fill={cover} opacity="0.1" rx="1" />
      <rect x="120" y="109" width="88" height="3.5" fill={cover} opacity="0.1" rx="1" />
      <rect x="120" y="118" width="88" height="3.5" fill={cover} opacity="0.1" rx="1" />
      <rect x="120" y="127" width="55" height="3.5" fill={cover} opacity="0.1" rx="1" />
      <rect x="185" y="28" width="48" height="48" fill="#f9edd0" rx="2" />
      <rect x="30" y="32" width="52" height="20" fill={cover} rx="4" opacity="0.85" />
      <text x="56" y="46" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold" opacity="0.9">PDF</text>
    </svg>
  );
};

/* ─── Lost and Found Illustration ─── */
export const LostFoundIllustration = ({ category, type }) => {
  const tc = type === 'Lost' ? '#d45252' : '#5fa378';
  const cat = category || 'Other';
  const gid = 'lfbg' + cat.replace(/\s/g, '');
  return (
    <svg viewBox="0 0 320 185" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0f5fb" />
          <stop offset="100%" stopColor="#e3edf7" />
        </linearGradient>
      </defs>
      <rect width="320" height="185" fill={'url(#' + gid + ')'} />
      <circle cx="160" cy="100" r="65" fill={tc} opacity="0.06" />
      <circle cx="160" cy="100" r="52" fill={tc} opacity="0.05" />
      {cat === 'Electronics' && (
        <>
          <rect x="125" y="65" width="70" height="50" fill="#3970b0" opacity="0.7" rx="6" />
          <rect x="128" y="68" width="64" height="44" fill="#1e3a5f" opacity="0.5" rx="4" />
          <ellipse cx="160" cy="130" rx="8" ry="3" fill="#254a7a" opacity="0.6" />
          <rect x="155" y="115" width="10" height="15" fill="#254a7a" opacity="0.5" />
          <rect x="140" y="80" width="40" height="20" fill="#5a8dc6" opacity="0.4" rx="2" />
        </>
      )}
      {cat === 'Books' && (
        <>
          <rect x="115" y="60" width="50" height="75" fill="#c29a2c" opacity="0.8" rx="3" />
          <rect x="115" y="60" width="12" height="75" fill="#8a6914" rx="3" />
          <rect x="165" y="65" width="45" height="72" fill="#3970b0" opacity="0.8" rx="3" />
          <rect x="165" y="65" width="12" height="72" fill="#254a7a" rx="3" />
        </>
      )}
      {cat === 'Bags' && (
        <>
          <rect x="120" y="75" width="80" height="70" fill="#254a7a" opacity="0.8" rx="8" />
          <rect x="125" y="80" width="70" height="60" fill="#3970b0" opacity="0.5" rx="6" />
          <path d="M148 75 Q160 55 172 75" stroke="#254a7a" strokeWidth="6" fill="none" strokeLinecap="round" />
          <rect x="132" y="100" width="56" height="20" fill="#254a7a" opacity="0.3" rx="2" />
          <circle cx="160" cy="108" r="4" fill="#c29a2c" opacity="0.8" />
        </>
      )}
      {cat === 'Keys' && (
        <>
          <circle cx="145" cy="95" r="28" fill="none" stroke="#c29a2c" strokeWidth="10" opacity="0.8" />
          <circle cx="145" cy="95" r="15" fill="none" stroke="#c29a2c" strokeWidth="5" opacity="0.5" />
          <rect x="166" y="92" width="50" height="8" fill="#c29a2c" opacity="0.8" rx="3" />
          <rect x="200" y="100" width="12" height="10" fill="#c29a2c" opacity="0.7" rx="1" />
        </>
      )}
      {cat === 'Clothing' && (
        <path d="M130 65 L110 85 L125 90 L125 145 L195 145 L195 90 L210 85 L190 65 L175 80 Q160 72 145 80 Z" fill="#5e4f8a" opacity="0.7" />
      )}
      {cat === 'Documents' && (
        <>
          <rect x="125" y="55" width="70" height="90" fill="#fefcf9" opacity="0.9" rx="3" />
          <rect x="125" y="55" width="70" height="90" fill="none" stroke="#254a7a" strokeWidth="2" rx="3" />
          <polygon points="175,55 195,55 195,75 175,75" fill="#e3edf7" stroke="#254a7a" strokeWidth="1" />
          <rect x="132" y="72" width="52" height="3" fill="#3970b0" opacity="0.2" rx="1" />
          <rect x="132" y="82" width="52" height="3" fill="#3970b0" opacity="0.2" rx="1" />
          <rect x="132" y="92" width="40" height="3" fill="#3970b0" opacity="0.2" rx="1" />
          <rect x="132" y="102" width="40" height="3" fill="#3970b0" opacity="0.2" rx="1" />
          <rect x="132" y="112" width="30" height="3" fill="#3970b0" opacity="0.2" rx="1" />
        </>
      )}
      {cat === 'Stationery' && (
        <>
          <rect x="148" y="55" width="8" height="90" fill="#d45252" opacity="0.8" rx="3" />
          <rect x="163" y="58" width="8" height="87" fill="#3970b0" opacity="0.8" rx="3" />
          <rect x="178" y="60" width="8" height="85" fill="#5fa378" opacity="0.8" rx="3" />
          <polygon points="148,55 156,55 152,48" fill="#f9edd0" opacity="0.7" />
          <polygon points="163,58 171,58 167,51" fill="#f9edd0" opacity="0.7" />
          <polygon points="178,60 186,60 182,53" fill="#f9edd0" opacity="0.7" />
        </>
      )}
      {cat === 'Sports' && (
        <>
          <circle cx="160" cy="100" r="45" fill="#5fa378" opacity="0.3" stroke="#3d6b4f" strokeWidth="3" />
          <path d="M130 80 Q140 100 130 120" stroke="#3d6b4f" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M190 80 Q180 100 190 120" stroke="#3d6b4f" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M145 65 Q160 55 175 65" stroke="#3d6b4f" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M145 135 Q160 145 175 135" stroke="#3d6b4f" strokeWidth="2" fill="none" opacity="0.6" />
        </>
      )}
      {cat === 'Accessories' && (
        <>
          <circle cx="160" cy="100" r="42" fill="none" stroke="#c29a2c" strokeWidth="6" opacity="0.7" />
          <circle cx="160" cy="100" r="35" fill="none" stroke="#d4ae48" strokeWidth="2" opacity="0.4" />
          <circle cx="160" cy="72" r="8" fill="#c29a2c" opacity="0.8" />
          <rect x="156" y="72" width="8" height="28" fill="#c29a2c" opacity="0.5" />
        </>
      )}
      {!['Electronics', 'Books', 'Bags', 'Keys', 'Clothing', 'Documents', 'Stationery', 'Sports', 'Accessories'].includes(cat) && (
        <>
          <circle cx="160" cy="100" r="45" fill="#3970b0" opacity="0.2" />
          <text x="160" y="115" textAnchor="middle" fontSize="42" fill="#254a7a" opacity="0.5">?</text>
        </>
      )}
      <rect x="8" y="8" width={type === 'Lost' ? 40 : 52} height="20" fill={tc} rx="4" opacity="0.85" />
      <text x={type === 'Lost' ? 28 : 34} y="22" textAnchor="middle" fontSize="9" fill="#fff" fontWeight="bold">{(type || 'ITEM').toUpperCase()}</text>
    </svg>
  );
};

/* ─── Admin Dashboard Hero ─── */
export const AdminHeroIllustration = () => (
  <svg viewBox="0 0 380 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <linearGradient id="ahbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#14a6a6" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#d4ae48" stopOpacity="0.08" />
      </linearGradient>
    </defs>
    <rect width="380" height="200" fill="url(#ahbg)" rx="12" />
    <rect x="30" y="80" width="30" height="80" fill="#3970b0" opacity="0.25" rx="3" />
    <rect x="30" y="80" width="30" height="4" fill="#3970b0" opacity="0.6" rx="2" />
    <rect x="70" y="50" width="30" height="110" fill="#5fa378" opacity="0.25" rx="3" />
    <rect x="70" y="50" width="30" height="4" fill="#5fa378" opacity="0.6" rx="2" />
    <rect x="110" y="95" width="30" height="65" fill="#c29a2c" opacity="0.25" rx="3" />
    <rect x="110" y="95" width="30" height="4" fill="#c29a2c" opacity="0.6" rx="2" />
    <rect x="150" y="30" width="30" height="130" fill="#3970b0" opacity="0.25" rx="3" />
    <rect x="150" y="30" width="30" height="4" fill="#3970b0" opacity="0.6" rx="2" />
    <rect x="190" y="65" width="30" height="95" fill="#5fa378" opacity="0.25" rx="3" />
    <rect x="190" y="65" width="30" height="4" fill="#5fa378" opacity="0.6" rx="2" />
    <rect x="230" y="110" width="30" height="50" fill="#d45252" opacity="0.25" rx="3" />
    <rect x="230" y="110" width="30" height="4" fill="#d45252" opacity="0.6" rx="2" />
    <line x1="20" y1="160" x2="280" y2="160" stroke="#bdd4ea" strokeWidth="1.5" />
    <rect x="295" y="55" width="70" height="110" fill="#e3edf7" opacity="0.5" rx="2" />
    <polygon points="280,55 330,28 380,55" fill="#bdd4ea" opacity="0.4" />
    <rect x="300" y="65" width="12" height="14" fill="#3970b0" opacity="0.3" rx="1" />
    <rect x="325" y="65" width="12" height="14" fill="#3970b0" opacity="0.3" rx="1" />
    <rect x="350" y="65" width="12" height="14" fill="#3970b0" opacity="0.3" rx="1" />
    <rect x="300" y="90" width="12" height="14" fill="#3970b0" opacity="0.3" rx="1" />
    <rect x="325" y="90" width="12" height="14" fill="#3970b0" opacity="0.3" rx="1" />
    <rect x="350" y="90" width="12" height="14" fill="#3970b0" opacity="0.3" rx="1" />
    <rect x="313" y="130" width="18" height="35" fill="#3970b0" opacity="0.3" rx="1" />
    <circle cx="305" cy="185" r="7" fill="#f9edd0" opacity="0.7" />
    <rect x="299" y="191" width="12" height="9" fill="#3970b0" opacity="0.7" rx="2" />
    <circle cx="330" cy="185" r="7" fill="#f9edd0" opacity="0.7" />
    <rect x="324" y="191" width="12" height="9" fill="#5fa378" opacity="0.7" rx="2" />
    <circle cx="355" cy="185" r="7" fill="#f9edd0" opacity="0.7" />
    <rect x="349" y="191" width="12" height="9" fill="#c29a2c" opacity="0.7" rx="2" />
  </svg>
);

/* ─── Empty State Illustrations ─── */
export const EmptyStateIllustration = ({ type }) => (
  <svg viewBox="0 0 260 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '160px', height: '140px' }}>
    <circle cx="130" cy="100" r="95" fill="#f0f5fb" />
    <circle cx="130" cy="100" r="75" fill="#e3edf7" opacity="0.5" />
    {type === 'announcements' && (
      <>
        <rect x="85" y="55" width="90" height="100" fill="#e3edf7" rx="6" />
        <rect x="85" y="55" width="90" height="16" fill="#3970b0" opacity="0.4" rx="4" />
        <rect x="92" y="82" width="76" height="6" fill="#bdd4ea" rx="2" />
        <rect x="92" y="93" width="60" height="6" fill="#bdd4ea" rx="2" />
        <rect x="92" y="104" width="70" height="6" fill="#bdd4ea" rx="2" />
        <rect x="92" y="115" width="50" height="6" fill="#bdd4ea" rx="2" />
        <circle cx="128" cy="63" r="5" fill="#d45252" opacity="0.7" />
        <path d="M60 95 L85 85 L85 115 L60 105 Z" fill="#3970b0" opacity="0.4" />
        <rect x="50" y="95" width="12" height="10" fill="#254a7a" opacity="0.5" rx="2" />
      </>
    )}
    {type === 'events' && (
      <>
        <rect x="75" y="50" width="110" height="110" fill="#e3edf7" rx="8" />
        <rect x="75" y="50" width="110" height="28" fill="#3970b0" opacity="0.5" rx="8" />
        <text x="130" y="70" textAnchor="middle" fontSize="10" fill="#fff" opacity="0.8" fontWeight="bold">EVENTS</text>
        <rect x="100" y="44" width="6" height="16" fill="#7061a3" opacity="0.7" rx="2" />
        <rect x="150" y="44" width="6" height="16" fill="#7061a3" opacity="0.7" rx="2" />
        <circle cx="100" cy="110" r="12" fill="#d45252" opacity="0.5" />
        <circle cx="130" cy="110" r="12" fill="#c29a2c" opacity="0.4" />
        <circle cx="160" cy="110" r="12" fill="#5fa378" opacity="0.4" />
      </>
    )}
    {type === 'notes' && (
      <>
        <rect x="68" y="90" width="80" height="70" fill="#d4ae48" opacity="0.3" rx="4" />
        <rect x="75" y="80" width="80" height="70" fill="#3970b0" opacity="0.3" rx="4" />
        <rect x="80" y="72" width="80" height="70" fill="#fefcf9" rx="4" />
        <rect x="80" y="72" width="14" height="70" fill="#1e3a5f" opacity="0.5" rx="4" />
        <rect x="98" y="82" width="56" height="4" fill="#bdd4ea" rx="1" />
        <rect x="98" y="91" width="56" height="4" fill="#bdd4ea" rx="1" />
        <rect x="98" y="100" width="56" height="4" fill="#bdd4ea" rx="1" />
        <rect x="98" y="109" width="40" height="4" fill="#bdd4ea" rx="1" />
        <circle cx="170" cy="75" r="20" fill="#e3edf7" />
        <line x1="170" y1="85" x2="170" y2="65" stroke="#3970b0" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="163,72 170,65 177,72" stroke="#3970b0" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    )}
    {type === 'lostfound' && (
      <>
        <circle cx="115" cy="100" r="40" fill="none" stroke="#3970b0" strokeWidth="8" opacity="0.3" />
        <circle cx="115" cy="100" r="30" fill="#e3edf7" opacity="0.4" />
        <line x1="145" y1="128" x2="168" y2="151" stroke="#3970b0" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <text x="115" y="110" textAnchor="middle" fontSize="28" fill="#3970b0" opacity="0.4" fontWeight="bold">?</text>
      </>
    )}
    {!type && (
      <>
        <rect x="80" y="65" width="100" height="90" fill="#e3edf7" rx="8" />
        <rect x="80" y="65" width="100" height="20" fill="#3970b0" opacity="0.3" rx="6" />
        <rect x="90" y="92" width="80" height="5" fill="#bdd4ea" rx="2" />
        <rect x="90" y="102" width="80" height="5" fill="#bdd4ea" rx="2" />
        <rect x="90" y="112" width="60" height="5" fill="#bdd4ea" rx="2" />
      </>
    )}
  </svg>
);

/* ─── Resume Illustration ─── */
export const ResumeIllustration = () => (
  <svg viewBox="0 0 340 240" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%', maxWidth: '280px', margin: '0 auto', display: 'block' }}>
    <defs>
      <linearGradient id="resbg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f0f5fb" />
        <stop offset="100%" stopColor="#e3edf7" />
      </linearGradient>
      <linearGradient id="resGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#1e3a5f" />
        <stop offset="100%" stopColor="#14a6a6" />
      </linearGradient>
      <filter id="resShadow" x="-10%" y="-10%" width="120%" height="125%" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#1e3a5f" floodOpacity="0.12" />
      </filter>
    </defs>
    <ellipse cx="170" cy="120" rx="140" ry="90" fill="#d4ae48" opacity="0.1" />
    <circle cx="270" cy="50" r="30" fill="#14a6a6" opacity="0.1" />
    <circle cx="70" cy="180" r="25" fill="#3970b0" opacity="0.1" />

    <rect x="75" y="32" width="190" height="175" rx="10" fill="#cddfed" opacity="0.6" transform="rotate(3 170 120)" />

    <rect x="75" y="25" width="190" height="185" rx="8" fill="#ffffff" filter="url(#resShadow)" />

    <rect x="75" y="25" width="190" height="42" rx="8" fill="url(#resGrad)" />
    <rect x="75" y="55" width="190" height="12" fill="url(#resGrad)" />

    <circle cx="102" cy="46" r="14" fill="#ffffff" opacity="0.95" />
    <circle cx="102" cy="43" r="6" fill="#1e3a5f" />
    <path d="M93 55 Q102 48 111 55" fill="#1e3a5f" />

    <rect x="124" y="38" width="85" height="7" rx="3" fill="#ffffff" />
    <rect x="124" y="49" width="55" height="4" rx="2" fill="#d4ae48" />

    <rect x="88" y="77" width="40" height="4" rx="2" fill="#1e3a5f" opacity="0.7" />
    <rect x="88" y="86" width="45" height="10" rx="3" fill="#e3edf7" />
    <rect x="91" y="89" width="30" height="4" rx="2" fill="#3970b0" opacity="0.6" />
    <rect x="88" y="100" width="45" height="10" rx="3" fill="#d5ede0" />
    <rect x="91" y="103" width="26" height="4" rx="2" fill="#3d6b4f" opacity="0.6" />
    <rect x="88" y="114" width="45" height="10" rx="3" fill="#fef0d5" />
    <rect x="91" y="117" width="22" height="4" rx="2" fill="#8a6914" opacity="0.6" />

    <rect x="88" y="132" width="35" height="4" rx="2" fill="#1e3a5f" opacity="0.7" />
    <circle cx="94" cy="144" r="3" fill="#14a6a6" />
    <rect x="101" y="142" width="32" height="4" rx="2" fill="#94a3b8" />
    <circle cx="94" cy="154" r="3" fill="#14a6a6" />
    <rect x="101" y="152" width="28" height="4" rx="2" fill="#94a3b8" />
    <circle cx="94" cy="164" r="3" fill="#14a6a6" />
    <rect x="101" y="162" width="30" height="4" rx="2" fill="#94a3b8" />

    <line x1="142" y1="75" x2="142" y2="195" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2 2" />

    <rect x="150" y="77" width="55" height="4" rx="2" fill="#1e3a5f" opacity="0.7" />
    <rect x="150" y="86" width="100" height="3" rx="1.5" fill="#3970b0" opacity="0.5" />
    <rect x="150" y="93" width="90" height="2.5" rx="1" fill="#94a3b8" opacity="0.6" />
    <rect x="150" y="99" width="75" height="2.5" rx="1" fill="#94a3b8" opacity="0.6" />

    <rect x="150" y="110" width="50" height="4" rx="2" fill="#1e3a5f" opacity="0.7" />
    <rect x="150" y="119" width="95" height="3" rx="1.5" fill="#3970b0" opacity="0.5" />
    <rect x="150" y="126" width="85" height="2.5" rx="1" fill="#94a3b8" opacity="0.6" />
    <rect x="150" y="132" width="65" height="2.5" rx="1" fill="#94a3b8" opacity="0.6" />

    <rect x="150" y="145" width="60" height="4" rx="2" fill="#1e3a5f" opacity="0.7" />
    <rect x="150" y="154" width="90" height="3" rx="1.5" fill="#3970b0" opacity="0.5" />
    <rect x="150" y="161" width="70" height="2.5" rx="1" fill="#94a3b8" opacity="0.6" />

    <circle cx="238" cy="180" r="14" fill="#d4ae48" opacity="0.9" />
    <polygon points="238,172 241,178 247,178 242,182 244,188 238,184 232,188 234,182 229,178 235,178" fill="#ffffff" />

    <circle cx="55" cy="70" r="4" fill="#d4ae48" opacity="0.6" />
    <polygon points="290,130 293,136 299,136 294,140 296,146 290,142 284,146 286,140 281,136 287,136" fill="#14a6a6" opacity="0.6" />
  </svg>
);

