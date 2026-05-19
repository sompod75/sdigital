import { useState, useEffect, createContext, useContext } from "react";

const ThemeContext = createContext();
const AuthContext = createContext();

const INITIAL_PRODUCTS = [
  { id: 1, name: "Netflix Premium", category: "OTT", price: 320, duration: "১ মাস", brandColor: "#E50914", brandBg: "#141414", logoText: "NETFLIX", desc: "4K Ultra HD, 4 স্ক্রিন একসাথে", badge: "Hot" },
  { id: 2, name: "YouTube Premium", category: "OTT", price: 180, duration: "১ মাস", brandColor: "#FF0000", brandBg: "#ffffff", logoText: "YouTube", desc: "বিজ্ঞাপন মুক্ত, ব্যাকগ্রাউন্ড প্লে", badge: "" },
  { id: 3, name: "Amazon Prime", category: "OTT", price: 250, duration: "১ মাস", brandColor: "#00A8E1", brandBg: "#232F3E", logoText: "prime", desc: "প্রাইম ভিডিও + শপিং সুবিধা", badge: "" },
  { id: 4, name: "Crunchyroll Premium", category: "OTT", price: 200, duration: "১ মাস", brandColor: "#F47521", brandBg: "#2E2E2E", logoText: "Crunchyroll", desc: "সব অ্যানিমে বিজ্ঞাপন ছাড়া", badge: "New" },
  { id: 5, name: "Facebook Blue Badge", category: "Software", price: 500, duration: "একবার", brandColor: "#1877F2", brandBg: "#ffffff", logoText: "facebook", desc: "ভেরিফাইড ব্যাজ সার্ভিস", badge: "" },
  { id: 6, name: "Disney+ Hotstar", category: "OTT", price: 220, duration: "১ মাস", brandColor: "#1CE8FF", brandBg: "#011E6A", logoText: "disney+", desc: "মুভি, সিরিজ ও লাইভ স্পোর্টস", badge: "" },
  { id: 7, name: "Microsoft Office 365", category: "Software", price: 600, duration: "১ বছর", brandColor: "#D83B01", brandBg: "#ffffff", logoText: "Microsoft", desc: "Word, Excel, PowerPoint সহ", badge: "Best" },
  { id: 8, name: "Canva Pro", category: "Software", price: 280, duration: "১ মাস", brandColor: "#00C4CC", brandBg: "#ffffff", logoText: "Canva", desc: "প্রফেশনাল ডিজাইন টুলস", badge: "" },
  { id: 9, name: "NordVPN", category: "Software", price: 350, duration: "১ মাস", brandColor: "#4687FF", brandBg: "#003F7F", logoText: "Nord VPN", desc: "নিরাপদ ও দ্রুত VPN সার্ভিস", badge: "" },
];

const ADMIN_EMAIL = "admin@sdigital.com";
const ADMIN_PASS  = "sdigital@admin2024";
const ADMIN_PIN   = "2024";

const K = { orders: "sd_orders", users: "sd_users", session: "sd_session", products: "sd_products", site: "sd_site" };

const gs = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } };
const ss = (k, v)  => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const DEF_SITE = { logoText: "S Digital", logoLetter: "S", accentColor: "#6c63ff", siteName: "S Digital", tagline: "সেরা দামে ডিজিটাল প্রোডাক্ট" };

function useTheme() { return useContext(ThemeContext); }
function useAuth()  { return useContext(AuthContext); }

export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("home");
  const [pageData, setPageData] = useState({});
  const [user, setUser]         = useState(() => gs(K.session, null));
  const [products, setProducts] = useState(() => gs(K.products, INITIAL_PRODUCTS));
  const [site, setSite]         = useState(() => gs(K.site, DEF_SITE));

  const navigate = (p, data = {}) => { setPage(p); setPageData(data); window.scrollTo(0,0); };
  const login    = (u) => { setUser(u); ss(K.session, u); };
  const logout   = () => { setUser(null); localStorage.removeItem(K.session); navigate("home"); };
  const updProds = (p) => { setProducts(p); ss(K.products, p); };
  const updSite  = (s) => { setSite(s);    ss(K.site, s); };

  const acc = site.accentColor;
  const th = {
    dark, acc,
    bg:    dark ? "#0f0f0f" : "#f7f8fc",
    card:  dark ? "#1b1b1b" : "#ffffff",
    text:  dark ? "#f0f0f0" : "#111111",
    sub:   dark ? "#999" : "#666",
    border:dark ? "#2a2a2a" : "#e8e8e8",
    inp:   dark ? "#111" : "#f4f4f7",
    accentLight: dark ? "#2a255a" : "#eeeeff",
    navigate, products, updProds, site, updSite,
  };

  return (
    <ThemeContext.Provider value={th}>
      <AuthContext.Provider value={{ user, login, logout }}>
        <style>{`
          * { box-sizing: border-box; }
          @media (max-width: 640px) {
            .sd-desktop-nav { display: none !important; }
            .sd-mobile-nav { display: flex !important; }
          }
          @media (max-width: 480px) {
            h1 { font-size: 24px !important; }
          }
        `}</style>
        <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "'Poppins', sans-serif", transition: "background .3s,color .3s" }}>
          <Navbar dark={dark} setDark={setDark} page={page} />
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
            {page === "home"     && <HomePage />}
            {page === "products" && <ProductsPage />}
            {page === "product"  && <ProductPage data={pageData} />}
            {page === "checkout" && <CheckoutPage data={pageData} />}
            {page === "bkash"    && <PaymentPage data={pageData} method="bkash" />}
            {page === "nagad"    && <PaymentPage data={pageData} method="nagad" />}
            {page === "success"  && <SuccessPage data={pageData} />}
            {page === "login"    && <LoginPage />}
            {page === "register" && <RegisterPage />}
            {page === "admin"    && <AdminPage />}
            {page === "orders"   && <MyOrders />}
          </div>
          <Footer />
          <SupportBtns />
        </div>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}

function Btn({ label, onClick, color, full, disabled, outline, size = "md" }) {
  const { acc } = useTheme();
  const c = color || acc;
  const p = size === "sm" ? "7px 14px" : "12px 22px";
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ width: full ? "100%" : "auto", padding: p, background: outline ? "transparent" : disabled ? "#aaa" : c, color: outline ? c : "#fff", border: outline ? `1.5px solid ${c}` : "none", borderRadius: 10, fontWeight: 700, fontSize: size === "sm" ? 13 : 15, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "'Poppins',sans-serif", transition: "opacity .2s", opacity: disabled ? .7 : 1 }}>
      {label}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", error, rows }) {
  const { border, text, inp, acc } = useTheme();
  const base = { width: "100%", padding: "11px 14px", borderRadius: 10, border: `1.5px solid ${error ? "#ef4444" : border}`, background: inp, color: text, fontSize: 14, outline: "none", fontFamily: "'Poppins',sans-serif", transition: "border .2s", boxSizing: "border-box" };
  return (
    <div style={{ marginBottom: 15 }}>
      {label && <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 5, color: text }}>{label}</label>}
      {rows
        ? <textarea rows={rows} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{ ...base, resize: "vertical" }} onFocus={e => e.target.style.borderColor = acc} onBlur={e => e.target.style.borderColor = error ? "#ef4444" : border} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} onFocus={e => e.target.style.borderColor = acc} onBlur={e => e.target.style.borderColor = error ? "#ef4444" : border} />
      }
      {error && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 3 }}>{error}</p>}
    </div>
  );
}

function BrandLogo({ p, size = 56 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * .22, background: p.brandBg, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #88888820", flexShrink: 0 }}>
      <span style={{ color: p.brandColor, fontWeight: 900, fontSize: size * .22, textAlign: "center", padding: "0 4px", lineHeight: 1.1, fontFamily: "'Poppins',sans-serif" }}>{p.logoText}</span>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { confirmed: ["✅ কনফার্মড", "#d1fae5", "#065f46"], rejected: ["❌ রিজেক্টেড", "#fee2e2", "#991b1b"], pending: ["⏳ পেন্ডিং", "#fef3c7", "#92400e"] };
  const [l, bg, col] = map[status] || map.pending;
  return <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 6, fontWeight: 700, background: bg, color: col }}>{l}</span>;
}

function Navbar({ dark, setDark, page }) {
  const { acc, card, border, text, sub, navigate, site } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav style={{ background: card, borderBottom: `1px solid ${border}`, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 62 }}>
        <div onClick={() => navigate("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: acc, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 17 }}>{site.logoLetter}</div>
          <span style={{ fontSize: 17, fontWeight: 800, color: text }}>{site.logoText}</span>
        </div>
        {/* Desktop nav */}
        <div className="sd-desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          {[["হোম","home"],["পণ্য","products"]].map(([l,p]) => (
            <button key={p} onClick={() => navigate(p)} style={{ background: page===p ? acc+"18" : "transparent", border: "none", borderRadius: 8, padding: "7px 13px", cursor: "pointer", color: page===p ? acc : sub, fontWeight: page===p ? 700 : 500, fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>{l}</button>
          ))}
          {user ? (
            <>
              <button onClick={() => navigate("orders")} style={{ background: page==="orders" ? acc+"18" : "transparent", border: "none", borderRadius: 8, padding: "7px 13px", cursor: "pointer", color: page==="orders" ? acc : sub, fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>অর্ডার</button>
              {user.isAdmin && <button onClick={() => navigate("admin")} style={{ background: "#ef444418", color: "#ef4444", border: "none", borderRadius: 8, padding: "7px 13px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "'Poppins',sans-serif" }}>Admin</button>}
              <div style={{ display: "flex", alignItems: "center", gap: 7, marginLeft: 4, padding: "4px 10px", background: acc+"15", borderRadius: 20 }}>
                <div style={{ width: 27, height: 27, borderRadius: "50%", background: acc, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>{user.name?.[0]?.toUpperCase()}</div>
                <span style={{ fontSize: 13, fontWeight: 600, color: text, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</span>
              </div>
              <button onClick={logout} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", color: sub, fontSize: 13, fontFamily: "'Poppins',sans-serif" }}>বের হন</button>
            </>
          ) : (
            <button onClick={() => navigate("login")} style={{ background: acc, border: "none", borderRadius: 8, padding: "8px 18px", cursor: "pointer", color: "#fff", fontSize: 13, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>লগইন</button>
          )}
          <button onClick={() => setDark(!dark)} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 15 }}>{dark ? "☀️" : "🌙"}</button>
        </div>
        {/* Mobile right */}
        <div className="sd-mobile-nav" style={{ display: "none", alignItems: "center", gap: 8 }}>
          <button onClick={() => setDark(!dark)} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 10px", cursor: "pointer", fontSize: 15 }}>{dark ? "☀️" : "🌙"}</button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 18, color: text, fontFamily: "'Poppins',sans-serif" }}>{menuOpen ? "✕" : "☰"}</button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sd-mobile-nav" style={{ display: "block", background: card, borderTop: `1px solid ${border}`, padding: "12px 16px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[["হোম","home"],["পণ্য","products"]].map(([l,p]) => (
              <button key={p} onClick={() => { navigate(p); setMenuOpen(false); }} style={{ background: page===p ? acc+"18" : "transparent", border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: page===p ? acc : sub, fontWeight: page===p ? 700 : 500, fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "left" }}>{l}</button>
            ))}
            {user ? (
              <>
                <button onClick={() => { navigate("orders"); setMenuOpen(false); }} style={{ background: "transparent", border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: sub, fontSize: 14, fontFamily: "'Poppins',sans-serif", textAlign: "left" }}>📦 অর্ডার</button>
                {user.isAdmin && <button onClick={() => { navigate("admin"); setMenuOpen(false); }} style={{ background: "#ef444418", color: "#ef4444", border: "none", borderRadius: 8, padding: "10px 14px", cursor: "pointer", fontWeight: 700, fontSize: 13, fontFamily: "'Poppins',sans-serif", textAlign: "left" }}>⚙️ Admin</button>}
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: acc+"15", borderRadius: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: acc, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>{user.name?.[0]?.toUpperCase()}</div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: text }}>{user.name}</span>
                </div>
                <button onClick={() => { logout(); setMenuOpen(false); }} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", color: sub, fontSize: 13, fontFamily: "'Poppins',sans-serif", textAlign: "left" }}>বের হন</button>
              </>
            ) : (
              <button onClick={() => { navigate("login"); setMenuOpen(false); }} style={{ background: acc, border: "none", borderRadius: 10, padding: "11px 14px", cursor: "pointer", color: "#fff", fontSize: 14, fontWeight: 700, fontFamily: "'Poppins',sans-serif" }}>লগইন করুন</button>
            )}
          </div>
        </div>
      )}
      <style>{`
        @media (max-width: 640px) {
          .sd-desktop-nav { display: none !important; }
          .sd-mobile-nav { display: flex !important; }
        }
      `}</style>
    </nav>
  );
}

function HomePage() {
  const { acc, accentLight, sub, card, border, products, navigate, site } = useTheme();
  const [filter, setFilter] = useState("All");
  const list = filter === "All" ? products : products.filter(p => p.category === filter);
  return (
    <div>
      <div style={{ textAlign: "center", padding: "64px 0 44px" }}>
        <div style={{ display: "inline-block", background: accentLight, color: acc, borderRadius: 20, padding: "5px 18px", fontSize: 13, fontWeight: 700, marginBottom: 18 }}>🛍️ ডিজিটাল প্রোডাক্ট স্টোর</div>
        <h1 style={{ fontSize: "clamp(26px,5vw,46px)", fontWeight: 900, margin: "0 0 14px", lineHeight: 1.25 }}>
          সেরা দামে <span style={{ color: acc }}>OTT & Software</span><br />সাবস্ক্রিপশন পান
        </h1>
        <p style={{ color: sub, fontSize: 15, marginBottom: 30 }}>{site.tagline}</p>
        <Btn label="সব পণ্য দেখুন →" onClick={() => navigate("products")} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 30, flexWrap: "wrap" }}>
        {["All","OTT","Software"].map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ background: filter===c ? acc : card, color: filter===c ? "#fff" : sub, border: `1px solid ${filter===c ? acc : border}`, borderRadius: 20, padding: "8px 20px", cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "'Poppins',sans-serif", transition: "all .2s" }}>
            {c === "All" ? "সব" : c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18, paddingBottom: 60 }}>
        {list.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

function ProductsPage() {
  const { sub, card, border, acc, products } = useTheme();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const list = products.filter(p => (filter === "All" || p.category === filter) && p.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ paddingTop: 32, paddingBottom: 60 }}>
      <h2 style={{ fontWeight: 800, fontSize: 24, marginBottom: 6 }}>সব পণ্য</h2>
      <p style={{ color: sub, marginBottom: 20 }}>আপনার পছন্দের সাবস্ক্রিপশন বেছে নিন</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 22 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="পণ্য খুঁজুন..." style={{ flex: 1, minWidth: 180, padding: "10px 14px", borderRadius: 10, border: `1px solid ${border}`, background: card, fontSize: 14, outline: "none", fontFamily: "'Poppins',sans-serif" }} />
        {["All","OTT","Software"].map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ background: filter===c ? acc : card, color: filter===c ? "#fff" : sub, border: `1px solid ${filter===c ? acc : border}`, borderRadius: 20, padding: "8px 18px", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "'Poppins',sans-serif" }}>
            {c === "All" ? "সব" : c}
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
        {list.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}

function ProductCard({ p }) {
  const { card, border, text, sub, acc, accentLight, navigate } = useTheme();
  return (
    <div onClick={() => navigate("product", { product: p })}
      style={{ background: card, border: `1px solid ${border}`, borderRadius: 16, padding: 20, cursor: "pointer", transition: "all .22s", position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
      {p.badge && <span style={{ position: "absolute", top: 12, right: 12, background: acc, color: "#fff", borderRadius: 6, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{p.badge}</span>}
      <div style={{ marginBottom: 14 }}><BrandLogo p={p} size={58} /></div>
      <div style={{ fontWeight: 700, fontSize: 15, color: text, marginBottom: 4 }}>{p.name}</div>
      <div style={{ color: sub, fontSize: 13, marginBottom: 14, minHeight: 36 }}>{p.desc}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><span style={{ fontWeight: 800, fontSize: 19, color: acc }}>৳{p.price}</span><span style={{ color: sub, fontSize: 12 }}> / {p.duration}</span></div>
        <button style={{ background: accentLight, color: acc, border: "none", borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Poppins',sans-serif" }}>কিনুন</button>
      </div>
    </div>
  );
}

function ProductPage({ data }) {
  const { card, border, sub, acc, accentLight, bg, navigate } = useTheme();
  const p = data.product;
  if (!p) { navigate("home"); return null; }
  return (
    <div style={{ paddingTop: 32, paddingBottom: 60 }}>
      <button onClick={() => navigate("products")} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: sub, marginBottom: 24, fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>← ফিরে যান</button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
        <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BrandLogo p={p} size={130} />
        </div>
        <div>
          <div style={{ background: accentLight, color: acc, display: "inline-block", borderRadius: 8, padding: "4px 12px", fontSize: 12, fontWeight: 700, marginBottom: 12 }}>{p.category}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>{p.name}</h1>
          <p style={{ color: sub, marginBottom: 20, lineHeight: 1.7 }}>{p.desc}</p>
          <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 20, marginBottom: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: sub }}>মূল্য</span>
              <span style={{ fontWeight: 800, color: acc, fontSize: 22 }}>৳{p.price}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: sub }}>মেয়াদ</span>
              <span style={{ fontWeight: 600 }}>{p.duration}</span>
            </div>
          </div>
          <Btn label="এখনই কিনুন →" onClick={() => navigate("checkout", { product: p })} full />
          <div style={{ marginTop: 14, padding: 14, background: bg, borderRadius: 12, fontSize: 13, color: sub, lineHeight: 1.9 }}>
            ✅ ম্যানুয়াল কনফার্মেশন &nbsp;•&nbsp; ✅ দ্রুত ডেলিভারি &nbsp;•&nbsp; ✅ সাপোর্ট সহ
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ data }) {
  const { card, border, sub, navigate } = useTheme();
  const p = data.product;
  if (!p) { navigate("home"); return null; }
  return (
    <div style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 500, margin: "0 auto" }}>
      <button onClick={() => navigate("product", { product: p })} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: sub, marginBottom: 24, fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>← ফিরে যান</button>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 24, marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>চেকআউট</h2>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${border}`, paddingTop: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>{p.name}</span>
          <span style={{ fontWeight: 800, color: "#6c63ff" }}>৳{p.price}</span>
        </div>
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 6 }}>💳 পেমেন্ট পদ্ধতি বেছে নিন</h3>
        <p style={{ color: sub, fontSize: 14, marginBottom: 18 }}>আপনার পছন্দের অপশন সিলেক্ট করুন</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <PayOpt icon="🟣" name="বিকাশ" color="#e2136e" onClick={() => navigate("bkash", { product: p })} />
          <PayOpt icon="🟠" name="নগদ"   color="#f7941d" onClick={() => navigate("nagad",  { product: p })} />
        </div>
      </div>
    </div>
  );
}

function PayOpt({ icon, name, color, onClick }) {
  const { card, border } = useTheme();
  return (
    <button onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 14, background: card, border: `2px solid ${border}`, borderRadius: 14, padding: "16px 20px", cursor: "pointer", width: "100%", textAlign: "left", transition: "all .18s", fontFamily: "'Poppins',sans-serif" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateX(4px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = "none"; }}>
      <span style={{ fontSize: 30 }}>{icon}</span>
      <div><div style={{ fontWeight: 700, fontSize: 15, color }}>{name}</div><div style={{ fontSize: 12, color: "#888" }}>ক্লিক করে পেমেন্ট করুন</div></div>
      <span style={{ marginLeft: "auto", color: "#aaa" }}>→</span>
    </button>
  );
}

function PaymentPage({ data, method }) {
  const { card, border, sub, navigate } = useTheme();
  const p = data.product;
  const isBkash = method === "bkash";
  const color  = isBkash ? "#e2136e" : "#f7941d";
  const label  = isBkash ? "বিকাশ" : "নগদ";
  const icon   = isBkash ? "🟣" : "🟠";
  const bgClr  = isBkash ? "#fff0f5" : "#fff8f0";
  const number = "01889711012";

  const [form, setForm]       = useState({ name: "", email: "", phone: "", senderPhone: "", txId: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "নাম দিন";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "সঠিক ইমেইল দিন";
    if (!form.phone.trim() || form.phone.length < 11) e.phone = "সঠিক ফোন নম্বর দিন";
    if (!form.senderPhone.trim() || form.senderPhone.length < 11) e.senderPhone = "সঠিক নম্বর দিন";
    if (!form.txId.trim()) e.txId = "ট্রানজেকশন আইডি দিন";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      const orders = gs(K.orders, []);
      orders.push({ id: Date.now(), product: p.name, price: p.price, method: label, name: form.name, email: form.email, phone: form.phone, senderPhone: form.senderPhone, txId: form.txId, status: "pending", date: new Date().toLocaleString("bn-BD") });
      ss(K.orders, orders);
      navigate("success", { product: p });
    }, 1100);
  };

  if (!p) { navigate("home"); return null; }
  return (
    <div style={{ paddingTop: 32, paddingBottom: 60, maxWidth: 480, margin: "0 auto" }}>
      <button onClick={() => navigate("checkout", { product: p })} style={{ background: "transparent", border: `1px solid ${border}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: sub, marginBottom: 24, fontSize: 14, fontFamily: "'Poppins',sans-serif" }}>← ফিরে যান</button>
      <div style={{ background: card, border: `2px solid ${color}`, borderRadius: 20, padding: 24, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <h2 style={{ fontSize: 18, fontWeight: 800, color, margin: 0 }}>{label}এ পেমেন্ট করুন</h2>
        </div>
        <div style={{ background: bgClr, borderRadius: 12, padding: 16, lineHeight: 2.1, fontSize: 14, color: "#333" }}>
          ১. {label} অ্যাপ খুলুন → <strong>Send Money</strong><br />
          ২. এই নম্বরে টাকা পাঠান:<br />
          <span style={{ fontSize: 20, fontWeight: 900, color, display: "block", margin: "2px 0 4px" }}>📱 {number}</span>
          ৩. পরিমাণ: <strong style={{ color }}>৳{p.price}</strong><br />
          ৪. পেমেন্টের পর নিচে তথ্য দিন
        </div>
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 24 }}>
        <h3 style={{ fontWeight: 700, marginBottom: 18, fontSize: 16 }}>📋 পেমেন্ট তথ্য দিন</h3>
        <Field label="আপনার নাম" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="পূর্ণ নাম লিখুন" error={errors.name} />
        <Field label="ইমেইল ঠিকানা" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="email@example.com" type="email" error={errors.email} />
        <Field label="আপনার ফোন নম্বর" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="01XXXXXXXXX" error={errors.phone} />
        <Field label="যে নম্বর থেকে টাকা পাঠিয়েছেন" value={form.senderPhone} onChange={v => setForm({ ...form, senderPhone: v })} placeholder="01XXXXXXXXX" error={errors.senderPhone} />
        <Field label="ট্রানজেকশন আইডি (TrxID)" value={form.txId} onChange={v => setForm({ ...form, txId: v })} placeholder="যেমন: 8A3FG2HJ9K" error={errors.txId} />
        <Btn label={loading ? "সাবমিট হচ্ছে..." : "✅ অর্ডার কনফার্ম করুন"} onClick={submit} color={color} full disabled={loading} />
      </div>
    </div>
  );
}

function SuccessPage({ data }) {
  const { accentLight, border, navigate } = useTheme();
  const p = data.product;
  return (
    <div style={{ paddingTop: 60, paddingBottom: 60, textAlign: "center", maxWidth: 440, margin: "0 auto" }}>
      <div style={{ fontSize: 68, marginBottom: 14 }}>🎉</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>অর্ডার সফলভাবে সম্পন্ন!</h2>
      <p style={{ color: "#666", marginBottom: 24, lineHeight: 1.7 }}>আপনার অর্ডার রিভিউয়ের জন্য পাঠানো হয়েছে।<br />কনফার্মেশনের পর সাবস্ক্রিপশন পাবেন।</p>
      <div style={{ background: accentLight, borderRadius: 14, padding: 18, marginBottom: 24, textAlign: "left" }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>📦 {p?.name}</div>
        <div style={{ fontSize: 13, color: "#888" }}>স্ট্যাটাস: <span style={{ color: "#f59e0b", fontWeight: 700 }}>⏳ পেন্ডিং রিভিউ</span></div>
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <Btn label="হোমে যান" onClick={() => navigate("home")} />
        <Btn label="অর্ডার দেখুন" onClick={() => navigate("orders")} outline />
      </div>
    </div>
  );
}

function LoginPage() {
  const { card, border, text, sub, acc, inp, navigate } = useTheme();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email: "", password: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showP, setShowP]     = useState(false);

  const submit = () => {
    const e = {};
    if (!form.email.trim()) e.email = "ইমেইল দিন";
    if (!form.password) e.password = "পাসওয়ার্ড দিন";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASS) { login({ name: "Admin", email: ADMIN_EMAIL, isAdmin: true }); navigate("admin"); return; }
      const u = gs(K.users, []).find(u => u.email === form.email && u.password === form.password);
      setLoading(false);
      if (!u) { setErrors({ password: "ইমেইল বা পাসওয়ার্ড ভুল।" }); return; }
      login(u); navigate("home");
    }, 800);
  };

  return (
    <div style={{ paddingTop: 60, paddingBottom: 60, maxWidth: 420, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: acc, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 24, margin: "0 auto 12px" }}>S</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>স্বাগতম!</h2>
        <p style={{ color: sub, fontSize: 14 }}>আপনার S Digital অ্যাকাউন্টে লগইন করুন</p>
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 28 }}>
        <button onClick={() => { login({ name: "Google User", email: `g_${Date.now()}@gmail.com`, isAdmin: false }); navigate("home"); }}
          style={{ width: "100%", background: inp, border: `1px solid ${border}`, borderRadius: 10, padding: 12, cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: text, fontFamily: "'Poppins',sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8h11.7C34.2 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/></svg>
          Google দিয়ে লগইন করুন
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: border }} /><span style={{ color: sub, fontSize: 12 }}>অথবা</span><div style={{ flex: 1, height: 1, background: border }} />
        </div>
        <Field label="ইমেইল" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="email@example.com" error={errors.email} />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 5, color: text }}>পাসওয়ার্ড</label>
          <div style={{ position: "relative" }}>
            <input type={showP ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="পাসওয়ার্ড দিন"
              style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10, border: `1.5px solid ${errors.password ? "#ef4444" : border}`, background: inp, color: text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Poppins',sans-serif" }}
              onFocus={e => e.target.style.borderColor = acc} onBlur={e => e.target.style.borderColor = errors.password ? "#ef4444" : border} />
            <button onClick={() => setShowP(!showP)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: sub }}>{showP ? "🙈" : "👁️"}</button>
          </div>
          {errors.password && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 3 }}>{errors.password}</p>}
        </div>
        <Btn label={loading ? "লগইন হচ্ছে..." : "লগইন করুন"} onClick={submit} full disabled={loading} />
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: sub }}>অ্যাকাউন্ট নেই? <span onClick={() => navigate("register")} style={{ color: acc, cursor: "pointer", fontWeight: 700 }}>রেজিস্টার করুন</span></p>
      </div>
    </div>
  );
}

function RegisterPage() {
  const { card, border, text, sub, acc, inp, navigate } = useTheme();
  const { login } = useAuth();
  const [form, setForm]       = useState({ name: "", phone: "", email: "", password: "", confirm: "" });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [showP, setShowP]     = useState(false);

  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = "নাম দিন";
    if (!form.phone.trim() || form.phone.length < 11) e.phone = "সঠিক নম্বর দিন";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "সঠিক ইমেইল দিন";
    if (form.password.length < 6) e.password = "কমপক্ষে ৬ অক্ষর";
    if (form.password !== form.confirm) e.confirm = "পাসওয়ার্ড মিলছে না";
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      const users = gs(K.users, []);
      if (users.find(u => u.email === form.email)) { setErrors({ email: "এই ইমেইল আগেই ব্যবহার হয়েছে।" }); setLoading(false); return; }
      const u = { name: form.name, phone: form.phone, email: form.email, password: form.password, isAdmin: false };
      users.push(u); ss(K.users, users); login(u); navigate("home");
    }, 800);
  };

  return (
    <div style={{ paddingTop: 60, paddingBottom: 60, maxWidth: 420, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: acc, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 24, margin: "0 auto 12px" }}>S</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 4 }}>অ্যাকাউন্ট তৈরি করুন</h2>
        <p style={{ color: sub, fontSize: 14 }}>S Digital-এ যোগ দিন</p>
      </div>
      <div style={{ background: card, border: `1px solid ${border}`, borderRadius: 20, padding: 28 }}>
        <button onClick={() => { login({ name: "Google User", email: `g_${Date.now()}@gmail.com`, isAdmin: false }); navigate("home"); }}
          style={{ width: "100%", background: inp, border: `1px solid ${border}`, borderRadius: 10, padding: 12, cursor: "pointer", fontWeight: 600, fontSize: 14, marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: text, fontFamily: "'Poppins',sans-serif" }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M44.5 20H24v8h11.7C34.2 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/></svg>
          Google দিয়ে যোগ দিন
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: border }} /><span style={{ color: sub, fontSize: 12 }}>অথবা</span><div style={{ flex: 1, height: 1, background: border }} />
        </div>
        <Field label="পূর্ণ নাম" value={form.name} onChange={v => setForm({...form,name:v})} placeholder="আপনার নাম" error={errors.name} />
        <Field label="ফোন নম্বর" value={form.phone} onChange={v => setForm({...form,phone:v})} placeholder="01XXXXXXXXX" error={errors.phone} />
        <Field label="ইমেইল" value={form.email} onChange={v => setForm({...form,email:v})} placeholder="email@example.com" error={errors.email} />
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 13, marginBottom: 5, color: text }}>পাসওয়ার্ড</label>
          <div style={{ position: "relative" }}>
            <input type={showP ? "text" : "password"} value={form.password} onChange={e => setForm({...form,password:e.target.value})} placeholder="কমপক্ষে ৬ অক্ষর"
              style={{ width: "100%", padding: "11px 44px 11px 14px", borderRadius: 10, border: `1.5px solid ${errors.password ? "#ef4444" : border}`, background: inp, color: text, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "'Poppins',sans-serif" }}
              onFocus={e => e.target.style.borderColor = acc} onBlur={e => e.target.style.borderColor = errors.password ? "#ef4444" : border} />
            <button onClick={() => setShowP(!showP)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 15, color: sub }}>{showP ? "🙈" : "👁️"}</button>
          </div>
          {errors.password && <p style={{ color: "#ef4444", fontSize: 12, marginTop: 3 }}>{errors.password}</p>}
        </div>
        <Field label="পাসওয়ার্ড নিশ্চিত" value={form.confirm} onChange={v => setForm({...form,confirm:v})} placeholder="আবার পাসওয়ার্ড দিন" type="password" error={errors.confirm} />
        <Btn label={loading ? "তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"} onClick={submit} full disabled={loading} />
        <p style={{ textAlign: "center", marginTop: 18, fontSize: 14, color: sub }}>আগেই আছে? <span onClick={() => navigate("login")} style={{ color: acc, cursor: "pointer", fontWeight: 700 }}>লগইন করুন</span></p>
      </div>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();
  const { card, border, sub, acc, text, inp, navigate, products, updProds, site, updSite } = useTheme();
  const [tab, setTab]         = useState("orders");
  const [orders, setOrders]   = useState(gs(K.orders, []));
  const [pinOK, setPinOK]     = useState(false);
  const [pin, setPin]         = useState("");
  const [pinErr, setPinErr]   = useState("");
  const [editId, setEditId]   = useState(null);
  const [editF, setEditF]     = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [newP, setNewP]       = useState({ name:"", category:"OTT", price:"", duration:"১ মাস", brandColor:"#ffffff", brandBg:"#333333", logoText:"", desc:"", badge:"" });
  const [siteF, setSiteF]     = useState(site);

  if (!user?.isAdmin) return <div style={{ textAlign:"center", padding:60, color:sub }}>⛔ অনুমতি নেই।</div>;

  if (!pinOK) return (
    <div style={{ paddingTop:60, paddingBottom:60, maxWidth:340, margin:"0 auto" }}>
      <div style={{ background:card, border:`1px solid ${border}`, borderRadius:20, padding:32, textAlign:"center" }}>
        <div style={{ fontSize:40, marginBottom:12 }}>🔐</div>
        <h2 style={{ fontWeight:800, marginBottom:6 }}>Admin PIN</h2>
        <p style={{ color:sub, fontSize:14, marginBottom:18 }}>Panel এ প্রবেশ করতে PIN দিন</p>
        <input type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="PIN"
          style={{ width:"100%", padding:"12px", borderRadius:10, border:`1.5px solid ${pinErr?"#ef4444":border}`, background:inp, color:text, fontSize:20, textAlign:"center", letterSpacing:8, outline:"none", boxSizing:"border-box", marginBottom:6, fontFamily:"'Poppins',sans-serif" }} />
        {pinErr && <p style={{ color:"#ef4444", fontSize:13, marginBottom:8 }}>{pinErr}</p>}
        <div style={{ marginTop:12 }}><Btn label="প্রবেশ করুন" onClick={() => { if(pin===ADMIN_PIN){setPinOK(true);}else{setPinErr("PIN ভুল।");setPin("");} }} full /></div>
      </div>
    </div>
  );

  const updStatus = (id, status) => { const u=orders.map(o=>o.id===id?{...o,status}:o); setOrders(u); ss(K.orders,u); };
  const startEdit = p => { setEditId(p.id); setEditF({...p}); };
  const saveEdit  = () => { const u=products.map(p=>p.id===editId?{...editF,price:Number(editF.price)}:p); updProds(u); setEditId(null); };
  const deleteP   = id => { if(window.confirm("এই পণ্য মুছে ফেলবেন?")) updProds(products.filter(p=>p.id!==id)); };
  const addProduct = () => {
    if(!newP.name||!newP.price||!newP.logoText){alert("নাম, লোগো টেক্সট ও মূল্য আবশ্যক।");return;}
    updProds([...products,{...newP,id:Date.now(),price:Number(newP.price)}]);
    setNewP({name:"",category:"OTT",price:"",duration:"১ মাস",brandColor:"#ffffff",brandBg:"#333333",logoText:"",desc:"",badge:""});
    setShowAdd(false);
  };
  const saveSite = () => { updSite(siteF); alert("সাইট সেটিংস সেভ হয়েছে!"); };

  const pending   = orders.filter(o=>o.status==="pending");
  const confirmed = orders.filter(o=>o.status==="confirmed");
  const TABS = [
    {id:"orders",  label:`📦 অর্ডার (${orders.length})`},
    {id:"pending", label:`⏳ পেন্ডিং (${pending.length})`},
    {id:"products",label:"🛍️ পণ্য"},
    {id:"site",    label:"⚙️ সাইট সেটিংস"},
  ];
  const inpStyle = { width:"100%", padding:"9px 12px", borderRadius:8, border:`1px solid ${border}`, background:inp, color:text, fontSize:13, outline:"none", boxSizing:"border-box", fontFamily:"'Poppins',sans-serif" };

  return (
    <div style={{ paddingTop:32, paddingBottom:60 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:22, flexWrap:"wrap", gap:10 }}>
        <div><h2 style={{ fontWeight:800, fontSize:22, marginBottom:3 }}>⚙️ Admin Panel</h2><p style={{ color:sub, fontSize:13, margin:0 }}>S Digital ড্যাশবোর্ড</p></div>
        <button onClick={()=>setPinOK(false)} style={{ background:"#fee2e2", color:"#ef4444", border:"none", borderRadius:8, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:"'Poppins',sans-serif" }}>🔒 লক করুন</button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))", gap:14, marginBottom:24 }}>
        {[[`📦`,orders.length,"মোট অর্ডার",acc],[`⏳`,pending.length,"পেন্ডিং","#f59e0b"],[`✅`,confirmed.length,"কনফার্মড","#10b981"]].map(([ic,v,l,c])=>(
          <div key={l} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:"16px 12px", textAlign:"center" }}>
            <div style={{ fontSize:24 }}>{ic}</div>
            <div style={{ fontSize:24, fontWeight:800, color:c }}>{v}</div>
            <div style={{ color:sub, fontSize:12, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap" }}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{ background:tab===t.id?acc:card, color:tab===t.id?"#fff":sub, border:`1px solid ${tab===t.id?acc:border}`, borderRadius:8, padding:"8px 14px", cursor:"pointer", fontWeight:600, fontSize:13, fontFamily:"'Poppins',sans-serif" }}>{t.label}</button>
        ))}
      </div>

      {(tab==="orders"||tab==="pending") && (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {(tab==="orders"?orders:pending).length===0 && <div style={{ color:sub, textAlign:"center", padding:40 }}>কোনো অর্ডার নেই</div>}
          {(tab==="orders"?orders:pending).map(o=>(
            <div key={o.id} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:18 }}>
              <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
                <div>
                  <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{o.product}</div>
                  <div style={{ color:sub, fontSize:13 }}>👤 {o.name} &nbsp;|&nbsp; 📧 {o.email}</div>
                  <div style={{ color:sub, fontSize:13 }}>💳 {o.method} &nbsp;|&nbsp; 📱 {o.phone || o.senderPhone}</div>
                  <div style={{ color:sub, fontSize:13 }}>🔖 TrxID: <strong>{o.txId}</strong></div>
                  <div style={{ color:sub, fontSize:12, marginTop:3 }}>🕐 {o.date}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:8, alignItems:"flex-end" }}>
                  <span style={{ fontWeight:800, color:acc, fontSize:17 }}>৳{o.price}</span>
                  <StatusBadge status={o.status} />
                  {o.status==="pending" && (
                    <div style={{ display:"flex", gap:6 }}>
                      <Btn label="কনফার্ম" onClick={()=>updStatus(o.id,"confirmed")} color="#10b981" size="sm" />
                      <Btn label="রিজেক্ট" onClick={()=>updStatus(o.id,"rejected")} color="#ef4444" size="sm" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="products" && (
        <div>
          <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
            <Btn label="＋ নতুন পণ্য যোগ করুন" onClick={()=>setShowAdd(!showAdd)} />
          </div>
          {showAdd && (
            <div style={{ background:card, border:`2px solid ${acc}`, borderRadius:16, padding:22, marginBottom:20 }}>
              <h3 style={{ fontWeight:700, marginBottom:16, fontSize:16 }}>➕ নতুন পণ্য</h3>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:12 }}>
                {[["পণ্যের নাম","name"],["লোগো টেক্সট","logoText"],["মূল্য (৳)","price"],["মেয়াদ","duration"],["ব্যাজ","badge"]].map(([l,k])=>(
                  <div key={k}><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>{l}</label><input value={newP[k]} onChange={e=>setNewP({...newP,[k]:e.target.value})} style={inpStyle} /></div>
                ))}
                <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>ক্যাটাগরি</label><select value={newP.category} onChange={e=>setNewP({...newP,category:e.target.value})} style={inpStyle}><option>OTT</option><option>Software</option></select></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>লোগো টেক্সট রঙ</label><div style={{ display:"flex", gap:8, alignItems:"center" }}><input type="color" value={newP.brandColor} onChange={e=>setNewP({...newP,brandColor:e.target.value})} style={{ width:40, height:36, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer" }} /><input value={newP.brandColor} onChange={e=>setNewP({...newP,brandColor:e.target.value})} style={{ ...inpStyle, flex:1 }} /></div></div>
                <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>লোগো ব্যাকগ্রাউন্ড</label><div style={{ display:"flex", gap:8, alignItems:"center" }}><input type="color" value={newP.brandBg} onChange={e=>setNewP({...newP,brandBg:e.target.value})} style={{ width:40, height:36, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer" }} /><input value={newP.brandBg} onChange={e=>setNewP({...newP,brandBg:e.target.value})} style={{ ...inpStyle, flex:1 }} /></div></div>
              </div>
              <div style={{ marginBottom:12 }}><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>বিবরণ</label><textarea rows={2} value={newP.desc} onChange={e=>setNewP({...newP,desc:e.target.value})} style={{ ...inpStyle, resize:"vertical" }} /></div>
              <div style={{ marginBottom:12 }}><label style={{ fontSize:12, color:sub, display:"block", marginBottom:6 }}>লোগো প্রিভিউ:</label><BrandLogo p={newP} size={54} /></div>
              <div style={{ display:"flex", gap:8 }}><Btn label="✅ পণ্য যোগ করুন" onClick={addProduct} color="#10b981" size="sm" /><Btn label="বাতিল" onClick={()=>setShowAdd(false)} outline size="sm" /></div>
            </div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {products.map(p=>(
              <div key={p.id} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:18 }}>
                {editId===p.id ? (
                  <div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:12, marginBottom:12 }}>
                      {[["পণ্যের নাম","name"],["লোগো টেক্সট","logoText"],["মূল্য (৳)","price"],["মেয়াদ","duration"],["ব্যাজ","badge"]].map(([l,k])=>(
                        <div key={k}><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>{l}</label><input value={editF[k]||""} onChange={e=>setEditF({...editF,[k]:e.target.value})} style={inpStyle} /></div>
                      ))}
                      <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>ক্যাটাগরি</label><select value={editF.category} onChange={e=>setEditF({...editF,category:e.target.value})} style={inpStyle}><option>OTT</option><option>Software</option></select></div>
                      <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>লোগো টেক্সট রঙ</label><div style={{ display:"flex", gap:8, alignItems:"center" }}><input type="color" value={editF.brandColor} onChange={e=>setEditF({...editF,brandColor:e.target.value})} style={{ width:40, height:36, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer" }} /><input value={editF.brandColor} onChange={e=>setEditF({...editF,brandColor:e.target.value})} style={{ ...inpStyle, flex:1 }} /></div></div>
                      <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>লোগো ব্যাকগ্রাউন্ড</label><div style={{ display:"flex", gap:8, alignItems:"center" }}><input type="color" value={editF.brandBg} onChange={e=>setEditF({...editF,brandBg:e.target.value})} style={{ width:40, height:36, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer" }} /><input value={editF.brandBg} onChange={e=>setEditF({...editF,brandBg:e.target.value})} style={{ ...inpStyle, flex:1 }} /></div></div>
                    </div>
                    <div style={{ marginBottom:12 }}><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:4 }}>বিবরণ</label><textarea rows={2} value={editF.desc} onChange={e=>setEditF({...editF,desc:e.target.value})} style={{ ...inpStyle, resize:"vertical" }} /></div>
                    <div style={{ marginBottom:12 }}><label style={{ fontSize:12, color:sub, display:"block", marginBottom:6 }}>লোগো প্রিভিউ:</label><BrandLogo p={editF} size={50} /></div>
                    <div style={{ display:"flex", gap:8 }}><Btn label="✅ সেভ" onClick={saveEdit} color="#10b981" size="sm" /><Btn label="বাতিল" onClick={()=>setEditId(null)} outline size="sm" /></div>
                  </div>
                ) : (
                  <div style={{ display:"flex", alignItems:"center", gap:14, justifyContent:"space-between", flexWrap:"wrap" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                      <BrandLogo p={p} size={46} />
                      <div>
                        <div style={{ fontWeight:700, fontSize:14 }}>{p.name}</div>
                        <div style={{ color:sub, fontSize:12 }}>{p.desc}</div>
                        <div style={{ fontSize:13, marginTop:2 }}><span style={{ color:acc, fontWeight:800 }}>৳{p.price}</span> <span style={{ color:sub }}>/ {p.duration}</span>{p.badge&&<span style={{ background:acc, color:"#fff", borderRadius:4, padding:"1px 6px", fontSize:11, marginLeft:6 }}>{p.badge}</span>}</div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:8 }}>
                      <Btn label="✏️ এডিট" onClick={()=>startEdit(p)} outline size="sm" />
                      <Btn label="🗑️ মুছুন" onClick={()=>deleteP(p.id)} color="#ef4444" size="sm" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab==="site" && (
        <div style={{ background:card, border:`1px solid ${border}`, borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, marginBottom:20, fontSize:17 }}>⚙️ সাইট সেটিংস</h3>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:14, marginBottom:16 }}>
            <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:5 }}>সাইটের নাম</label><input value={siteF.logoText} onChange={e=>setSiteF({...siteF,logoText:e.target.value})} style={inpStyle} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:5 }}>লোগো অক্ষর</label><input value={siteF.logoLetter} onChange={e=>setSiteF({...siteF,logoLetter:e.target.value.slice(0,2)})} maxLength={2} style={inpStyle} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:5 }}>ট্যাগলাইন</label><input value={siteF.tagline} onChange={e=>setSiteF({...siteF,tagline:e.target.value})} style={inpStyle} /></div>
            <div><label style={{ fontSize:12, fontWeight:600, color:sub, display:"block", marginBottom:5 }}>প্রাথমিক রঙ</label><div style={{ display:"flex", gap:8, alignItems:"center" }}><input type="color" value={siteF.accentColor} onChange={e=>setSiteF({...siteF,accentColor:e.target.value})} style={{ width:40, height:36, borderRadius:6, border:`1px solid ${border}`, cursor:"pointer" }} /><input value={siteF.accentColor} onChange={e=>setSiteF({...siteF,accentColor:e.target.value})} style={{ ...inpStyle, flex:1 }} /></div></div>
          </div>
          <div style={{ background:"#f8f8f8", borderRadius:12, padding:14, marginBottom:18 }}>
            <p style={{ fontSize:12, color:sub, marginBottom:8 }}>প্রিভিউ:</p>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:siteF.accentColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:17 }}>{siteF.logoLetter}</div>
              <span style={{ fontWeight:800, color:siteF.accentColor, fontSize:17 }}>{siteF.logoText}</span>
            </div>
          </div>
          <Btn label="💾 সেটিংস সেভ করুন" onClick={saveSite} />
        </div>
      )}
    </div>
  );
}

function MyOrders() {
  const { user } = useAuth();
  const { card, border, sub, acc, navigate } = useTheme();
  const orders = gs(K.orders, []);
  if (!user) return (
    <div style={{ textAlign:"center", padding:60 }}>
      <p style={{ color:sub, marginBottom:16 }}>অর্ডার দেখতে লগইন করুন।</p>
      <Btn label="লগইন করুন" onClick={()=>navigate("login")} />
    </div>
  );
  return (
    <div style={{ paddingTop:32, paddingBottom:60 }}>
      <h2 style={{ fontWeight:800, fontSize:22, marginBottom:22 }}>আমার অর্ডার</h2>
      {orders.length===0 && <div style={{ textAlign:"center", color:sub, padding:60 }}>কোনো অর্ডার নেই।</div>}
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {orders.map(o=>(
          <div key={o.id} style={{ background:card, border:`1px solid ${border}`, borderRadius:14, padding:18, display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
            <div>
              <div style={{ fontWeight:700, marginBottom:4 }}>{o.product}</div>
              <div style={{ color:sub, fontSize:13 }}>💳 {o.method} &nbsp;|&nbsp; TrxID: {o.txId}</div>
              <div style={{ color:sub, fontSize:12, marginTop:2 }}>{o.date}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontWeight:800, color:acc, marginBottom:6, fontSize:17 }}>৳{o.price}</div>
              <StatusBadge status={o.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Footer() {
  const { card, border, sub, acc, navigate } = useTheme();
  return (
    <footer style={{ background:card, borderTop:`1px solid ${border}`, padding:"26px 16px" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:14, alignItems:"center" }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28, height:28, borderRadius:7, background:acc, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:14 }}>S</div>
          <span style={{ fontWeight:800, color:acc }}>Digital</span>
        </div>
        <div style={{ display:"flex", gap:18 }}>
          {[["হোম","home"],["পণ্য","products"],["লগইন","login"]].map(([l,p])=>(
            <span key={p} onClick={()=>navigate(p)} style={{ color:sub, cursor:"pointer", fontSize:14 }}>{l}</span>
          ))}
        </div>
        <div style={{ color:sub, fontSize:12 }}>© 2024 S Digital. সকল স্বত্ব সংরক্ষিত।</div>
      </div>
    </footer>
  );
}

function SupportBtns() {
  return (
    <div style={{ position:"fixed", bottom:22, right:22, display:"flex", flexDirection:"column", gap:10, zIndex:999 }}>
      <a href="https://wa.me/8801325951604" target="_blank" rel="noreferrer" style={{ width:50, height:50, borderRadius:"50%", background:"#25d366", boxShadow:"0 4px 16px rgba(37,211,102,.4)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", fontSize:22 }}>💬</a>
      <a href="https://t.me/sdigitalsupport" target="_blank" rel="noreferrer" style={{ width:50, height:50, borderRadius:"50%", background:"#0088cc", boxShadow:"0 4px 16px rgba(0,136,204,.4)", display:"flex", alignItems:"center", justifyContent:"center", textDecoration:"none", fontSize:22 }}>✈️</a>
    </div>
  );
}
