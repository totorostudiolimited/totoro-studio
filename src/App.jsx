import { useState, useEffect, useRef } from "react";

const BRAND = "#ced0c9";
const CHARCOAL = "#1A1A1A";
const WHITE = "#FFFFFF";

/* ─── Scroll hook ─── */
function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

/* ─── Intersection observer hook ─── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ─── Magnetic button ─── */
function MagneticBtn({ children, className, onClick }) {
  const btnRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setPos({ x: (e.clientX - cx) * 0.35, y: (e.clientY - cy) * 0.35 });
  };
  const handleMouseLeave = () => setPos({ x: 0, y: 0 });
  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={className}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transition: pos.x === 0 && pos.y === 0 ? "transform 0.5s cubic-bezier(0.23,1,0.32,1)" : "transform 0.1s ease",
      }}
    >
      {children}
    </button>
  );
}

/* ─── Nav ─── */
function Nav({ scrollY }) {
  const scrolled = scrollY > 60;
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: scrolled ? "14px 48px" : "24px 48px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
      backdropFilter: scrolled ? "blur(18px)" : "none",
      borderBottom: scrolled ? `1px solid ${BRAND}55` : "none",
      transition: "all 0.45s ease",
    }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.35rem", letterSpacing: "0.04em", color: CHARCOAL }}>
        TOTORO<span style={{ color: BRAND, fontStyle: "italic" }}>.</span>
      </div>
      <div style={{ display: "flex", gap: "36px" }}>
        {["About", "Work", "Contact"].map(link => (
          <a key={link} href={`#${link.toLowerCase()}`} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.82rem",
            letterSpacing: "0.12em", textTransform: "uppercase",
            color: CHARCOAL, textDecoration: "none", opacity: 0.7,
            transition: "opacity 0.2s",
          }}
            onMouseEnter={e => e.target.style.opacity = 1}
            onMouseLeave={e => e.target.style.opacity = 0.7}
          >{link}</a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Hero ─── */
function Hero({ scrollY }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const parallaxY = scrollY * 0.38;

  return (
    <section style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
      background: WHITE,
    }}>
      {/* Parallax background orb */}
      <div style={{
        position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
        transform: `translateY(${parallaxY}px)`,
        transition: "transform 0.05s linear",
        pointerEvents: "none",
      }}>
        <div style={{
          width: "680px", height: "680px", borderRadius: "50%",
          background: `radial-gradient(ellipse at 40% 40%, ${BRAND}cc 0%, ${BRAND}55 45%, transparent 70%)`,
          filter: "blur(2px)",
          opacity: 0.65,
        }} />
      </div>

      {/* Decorative lines */}
      <div style={{ position: "absolute", top: "18%", left: "7%", width: "180px", height: "1px", background: `${BRAND}99` }} />
      <div style={{ position: "absolute", bottom: "22%", right: "8%", width: "120px", height: "1px", background: `${BRAND}99` }} />
      <div style={{ position: "absolute", top: "28%", right: "10%", width: "1px", height: "100px", background: `${BRAND}77` }} />

      {/* Content */}
      <div style={{ textAlign: "center", zIndex: 2, padding: "0 24px", maxWidth: "780px" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: BRAND, marginBottom: "28px",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(14px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          PR Agency · Hong Kong
        </p>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          fontSize: "clamp(2.8rem, 6vw, 5.2rem)", lineHeight: 1.08,
          color: CHARCOAL, margin: "0 0 28px",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(24px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.25s",
          letterSpacing: "-0.01em",
        }}>
          Shaping Narratives,<br />
          <em style={{ fontStyle: "italic", color: "#5a5c57" }}>Driving Influence.</em>
        </h1>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "1.05rem", color: "#555", lineHeight: 1.75,
          marginBottom: "48px", maxWidth: "560px", margin: "0 auto 48px",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(18px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.45s",
        }}>
          專注公關策略、媒體關係及數碼營銷，為品牌打造真實影響力與媒體聲量。
        </p>
        <div style={{
          display: "flex", gap: "16px", justifyContent: "center",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.6s",
        }}>
          <MagneticBtn
            className="btn-primary"
            style={{}}
            onClick={() => document.getElementById("work")?.scrollIntoView({ behavior: "smooth" })}
          >
            <style>{`
              .btn-primary {
                background: ${CHARCOAL}; color: ${WHITE};
                border: none; padding: 16px 38px;
                font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
                letter-spacing: 0.15em; text-transform: uppercase;
                cursor: pointer; border-radius: 2px;
              }
              .btn-primary:hover { background: #333; }
              .btn-outline {
                background: transparent; color: ${CHARCOAL};
                border: 1px solid ${BRAND}; padding: 16px 38px;
                font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
                letter-spacing: 0.15em; text-transform: uppercase;
                cursor: pointer; border-radius: 2px;
              }
              .btn-outline:hover { background: ${BRAND}33; }
            `}</style>
            View Our Work
          </MagneticBtn>
          <MagneticBtn
            className="btn-outline"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get in Touch
          </MagneticBtn>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: "48px", justifyContent: "center", marginTop: "56px",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(16px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.75s",
        }}>
          {[
            { num: "50+", label: "服務品牌" },
            { num: "HK$500萬+", label: "創造媒體價值" },
            { num: "200+", label: "KOL合作" },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)", color: CHARCOAL,
                letterSpacing: "-0.01em", lineHeight: 1,
              }}>{num}</div>
              <div style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
                letterSpacing: "0.12em", color: "#888", marginTop: "6px",
              }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{
        position: "absolute", bottom: "36px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: loaded ? 0.45 : 0, transition: "opacity 1s ease 1.2s",
      }}>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: CHARCOAL }}>Scroll</span>
        <div style={{ width: "1px", height: "40px", background: `linear-gradient(to bottom, ${CHARCOAL}, transparent)`, animation: "scrollPulse 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}

/* ─── Icon components ─── */
const IconPR = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="10" r="5" stroke={BRAND} strokeWidth="1.5" />
    <path d="M6 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke={BRAND} strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="24" cy="8" r="3" stroke={BRAND} strokeWidth="1.2" />
    <path d="M27 14c1.5 1 3 2.5 3 5" stroke={BRAND} strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);
const IconSocial = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="8" cy="16" r="4" stroke={BRAND} strokeWidth="1.5" />
    <circle cx="24" cy="8" r="4" stroke={BRAND} strokeWidth="1.5" />
    <circle cx="24" cy="24" r="4" stroke={BRAND} strokeWidth="1.5" />
    <line x1="12" y1="14" x2="20" y2="10" stroke={BRAND} strokeWidth="1.5" />
    <line x1="12" y1="18" x2="20" y2="22" stroke={BRAND} strokeWidth="1.5" />
  </svg>
);
const IconMedia = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="3" y="8" width="26" height="16" rx="2" stroke={BRAND} strokeWidth="1.5" />
    <path d="M13 12l8 4-8 4V12z" stroke={BRAND} strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

/* ─── About ─── */
function About() {
  const [ref, inView] = useInView();
  return (
    <section id="about" ref={ref} style={{
      padding: "120px 48px", background: "#fafaf9",
      borderTop: `1px solid ${BRAND}44`,
    }}>
      <style>{`
        @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Label */}
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: BRAND, marginBottom: "16px",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease",
        }}>
          The Expertise
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
          {/* Left col */}
          <div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.15,
              color: CHARCOAL, margin: "0 0 32px",
              opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)",
              transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
            }}>
              策略公關，<br /><em>為品牌發聲。</em>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#666",
              lineHeight: 1.8, marginBottom: "24px",
              opacity: inView ? 1 : 0, transition: "opacity 0.9s ease 0.25s",
            }}>
              我們深諳媒體生態，透過精準的公關策略、新聞稿撰寫、媒體邀請及記者關係，為品牌建立真實可信的媒體聲量。無論是新產品發布、企業形象管理，還是危機公關，Totoro Studio 均能為您提供全方位的策略支援。
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#666",
              lineHeight: 1.8,
              opacity: inView ? 1 : 0, transition: "opacity 0.9s ease 0.35s",
            }}>
              配合社交媒體管理、KOL合作及內地全媒體營銷，我們打通線上線下傳播渠道，讓品牌故事觸達最精準的受眾。
            </p>
          </div>

          {/* Right col — service cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { Icon: IconPR, title: "公關及媒體關係", desc: "新聞稿撰寫、媒體邀請、記者關係管理及品牌聲量建立" },
              { Icon: IconSocial, title: "社交媒體及廣告", desc: "跨平台內容策劃、廣告投放及社群管理，覆蓋IG、FB及小紅書" },
              { Icon: IconMedia, title: "KOL及內容營銷", desc: "KOL/KOC合作、內容創作及內地全媒體整合營銷方案" },
            ].map(({ Icon, title, desc }, i) => (
              <div key={title} style={{
                padding: "28px 28px 24px",
                background: `rgba(206,208,201,0.18)`,
                border: `1px solid ${BRAND}55`,
                borderRadius: "12px",
                backdropFilter: "blur(8px)",
                boxShadow: `0 2px 24px ${BRAND}22`,
                opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
                transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.12}s`,
              }}>
                <div style={{ marginBottom: "12px" }}><Icon /></div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "1.2rem", color: CHARCOAL, margin: "0 0 8px" }}>{title}</h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", color: "#777", lineHeight: 1.65, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── PR Process ─── */
function PRProcess() {
  const [ref, inView] = useInView(0.1);
  const steps = [
    { num: "01", title: "深度品牌研究", desc: "了解品牌定位、目標受眾及媒體環境" },
    { num: "02", title: "制定公關策略", desc: "撰寫新聞基調、媒體名單及傳播計劃" },
    { num: "03", title: "執行與媒體推廣", desc: "發送新聞稿、安排媒體邀請及跟進報道" },
    { num: "04", title: "數據分析與報告", desc: "統計媒體曝光、評估成效並優化策略" },
  ];

  return (
    <section ref={ref} style={{
      padding: "100px 48px",
      background: WHITE,
      borderTop: `1px solid ${BRAND}44`,
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: BRAND, marginBottom: "16px",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease",
        }}>The Process</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          fontSize: "clamp(1.8rem, 3vw, 2.6rem)", color: CHARCOAL,
          margin: "0 0 64px", lineHeight: 1.15,
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          公關執行流程
        </h2>

        {/* Timeline */}
        <div style={{ position: "relative" }}>
          {/* Connector line */}
          <div style={{
            position: "absolute",
            top: "28px",
            left: "calc(12.5% - 1px)",
            right: "calc(12.5% - 1px)",
            height: "2px",
            background: `${BRAND}55`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
          }} />

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "32px",
            position: "relative",
          }}>
            {steps.map(({ num, title, desc }, i) => (
              <div key={num} style={{
                textAlign: "center",
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(28px)",
                transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${0.15 + i * 0.12}s`,
              }}>
                {/* Step circle */}
                <div style={{
                  width: "56px", height: "56px", borderRadius: "50%",
                  background: WHITE, border: `2px solid ${BRAND}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 24px",
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                  fontSize: "1rem", color: CHARCOAL,
                  position: "relative", zIndex: 1,
                  boxShadow: `0 0 0 6px ${WHITE}`,
                }}>{num}</div>

                <h3 style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                  fontSize: "1.15rem", color: CHARCOAL,
                  margin: "0 0 12px", lineHeight: 1.25,
                }}>{title}</h3>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem",
                  color: "#777", lineHeight: 1.65, margin: 0,
                }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Project image map ─── */
const PROJECT_IMAGES = {
  "LKS Foundation · Histotripsy 2.0": "/slides/lks_foundation.jpg",
  "LKS Foundation · KOL Matrix": "/slides/lks_foundation.jpg",
  "Wing Lok Noodle — Pop-up Launch": "/slides/wing_lok_1.jpg",
  "Wing Lok Noodle — Social Media": "/slides/wing_lok_2.jpg",
  "Master Ngan": "/slides/master_ngan.jpg",
  "Mittoappu — Kuala Lumpur TRX": "/slides/mittoappu.jpg",
  "Caligari Curry — Sha Tin Opening": "/slides/caligari_two_sisters.jpg",
  "Caligari Curry — Social Media": "/slides/caligari_two_sisters.jpg",
  "Two Sisters Cold Skin Noodles": "/slides/caligari_two_sisters.jpg",
  "Nagamoto — Central Omakase": "/slides/nagamoto_jc_levelmind.jpg",
  "JC LevelMind — Youth Mental Health": "/slides/nagamoto_jc_levelmind.jpg",
  "JC LevelMind — PR Campaign": "/slides/nagamoto_jc_levelmind.jpg",
};

/* ─── Project Modal ─── */
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const image = PROJECT_IMAGES[project.title];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        animation: "modalFadeIn 0.3s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      <style>{`
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlideUp { from { opacity: 0; transform: translateY(32px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: WHITE,
          borderRadius: "20px",
          maxWidth: "720px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "modalSlideUp 0.35s cubic-bezier(0.16,1,0.3,1)",
          position: "relative",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "20px", right: "20px", zIndex: 10,
            width: "36px", height: "36px", borderRadius: "50%",
            border: `1px solid ${BRAND}88`,
            background: "rgba(255,255,255,0.9)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.1rem", color: CHARCOAL, lineHeight: 1,
          }}
          aria-label="Close"
        >×</button>

        {/* Slide image */}
        {image && (
          <div style={{ borderRadius: "20px 20px 0 0", overflow: "hidden", maxHeight: "380px" }}>
            <img
              src={image}
              alt={project.title}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        )}

        {/* Content */}
        <div style={{ padding: "36px 40px 40px" }}>
          {/* Tag */}
          <div style={{
            display: "inline-block",
            background: `${BRAND}cc`, borderRadius: "40px",
            padding: "4px 14px", marginBottom: "16px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
            letterSpacing: "0.16em", textTransform: "uppercase", color: CHARCOAL,
          }}>{project.tag}</div>

          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
            fontSize: "1.9rem", color: CHARCOAL, margin: "0 0 16px", lineHeight: 1.2,
          }}>{project.title}</h2>

          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "1rem",
            color: "#555", lineHeight: 1.75, marginBottom: "24px",
          }}>{project.desc}</p>

          {project.metric && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: `${BRAND}22`, border: `1px solid ${BRAND}88`,
              borderRadius: "6px", padding: "8px 16px",
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
              letterSpacing: "0.1em", color: CHARCOAL, textTransform: "uppercase",
            }}>
              <span style={{ fontSize: "0.85rem" }}>◆</span>
              {project.metric}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Portfolio card ─── */
function PortfolioCard({ project, delay, inView, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        gridColumn: project.wide ? "span 2" : "span 1",
        gridRow: project.tall ? "span 2" : "span 1",
        position: "relative", overflow: "hidden",
        borderRadius: "18px",
        background: hovered
          ? `rgba(206,208,201,0.55)`
          : `rgba(206,208,201,0.28)`,
        border: `1px solid ${BRAND}66`,
        backdropFilter: "blur(10px)",
        boxShadow: hovered
          ? `0 20px 60px ${BRAND}55, 0 4px 20px rgba(0,0,0,0.07)`
          : `0 4px 20px ${BRAND}33`,
        transform: hovered ? "scale(1.02)" : "scale(1)",
        opacity: inView ? 1 : 0,
        transition: `transform 0.5s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease, background 0.4s ease, opacity 0.9s ease ${delay}s`,
        cursor: "pointer",
        minHeight: project.tall ? "420px" : "240px",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "28px",
        paddingTop: "72px",
      }}
    >

      {/* Tag */}
      <div style={{
        position: "absolute", top: "22px", left: "22px",
        background: `${BRAND}bb`, borderRadius: "40px",
        padding: "5px 14px",
        fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem",
        letterSpacing: "0.16em", textTransform: "uppercase", color: CHARCOAL,
      }}>
        {project.tag}
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          fontSize: project.wide ? "1.55rem" : "1.2rem", color: CHARCOAL,
          margin: "0 0 6px", lineHeight: 1.2,
        }}>{project.title}</h3>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.83rem",
          color: "#555", margin: "0 0 12px", lineHeight: 1.55,
        }}>{project.desc}</p>

        {/* Metric chip */}
        {project.metric && (
          <div style={{
            display: "inline-block",
            background: `${CHARCOAL}11`, border: `1px solid ${BRAND}99`,
            borderRadius: "4px", padding: "4px 10px", marginBottom: "14px",
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.7rem",
            letterSpacing: "0.1em", color: "#555", textTransform: "uppercase",
          }}>{project.metric}</div>
        )}

        {/* CTA */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          opacity: hovered ? 1 : 0, transform: hovered ? "translateY(0)" : "translateY(8px)",
          transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <span style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.78rem",
            letterSpacing: "0.16em", textTransform: "uppercase",
            color: CHARCOAL, borderBottom: `1px solid ${CHARCOAL}`,
            paddingBottom: "2px",
          }}>View Case Study</span>
          <span style={{ fontSize: "0.85rem" }}>→</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Portfolio filter tabs ─── */
const FILTERS = ["All", "Social Media & Ad Placement", "PR", "KOL Engagement"];

/* ─── Portfolio ─── */
function Portfolio() {
  const [ref, inView] = useInView(0.1);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const allProjects = [
    // PR & Mainland China
    {
      title: "LKS Foundation · Histotripsy 2.0",
      desc: "Full-media PR campaign for Asia's first non-invasive liver cancer tissue ablation system, donated to CUHK. Covered by 22 mainstream outlets, viral seeding via drama tie-in, 80% search volume indexed on Baidu.",
      tag: "PR",
      metric: "3.53M+ Impressions · 4.23M+ KOL Reach",
      wide: true,
    },
    {
      title: "Wing Lok Noodle — Pop-up Launch",
      desc: "Planned a media tour, drafted press releases and coordinated journalist tastings for Wing Lok Noodle's department store pop-up, securing 15+ local lifestyle media features and significantly raising brand awareness.",
      tag: "PR",
      metric: "15+ Media Features",
    },
    {
      title: "Caligari Curry — Sha Tin Opening",
      desc: "Media event strategy for the second Hong Kong outlet of Japanese curry destination Caligari, including exclusive journalist tastings that placed the brand firmly on the city's food-media map.",
      tag: "PR",
      metric: "Media Relations",
    },
    // Social Media
    {
      title: "Wing Lok Noodle — Social Media",
      desc: "Full social media management since April 2023: paid ads, creative design, content production, community management and 200+ KOL/MI collaborations. Festive campaigns achieved a peak ROAS of 44.33× (industry benchmark: 8×), with an overall average ROAS of 137.18×.",
      tag: "Social Media & Ad Placement",
      metric: "Peak ROAS 137× · 200+ KOL Collabs",
      wide: true,
    },
    {
      title: "Mittoappu — Kuala Lumpur TRX",
      desc: "Bilingual social media management, paid advertising and KOL partnerships (including KL Foodie with 1.3M followers) for Malaysia's first Wakayama wagyu Japanese restaurant. Generated 40+ enquiries within half a day at a cost-per-lead as low as $9.",
      tag: "Social Media & Ad Placement",
      metric: "244K Views · $9 Cost-per-Lead",
    },
    {
      title: "Boucake — Kuala Lumpur TRX",
      desc: "Bilingual social media management and paid advertising for a modern Japanese dessert café at TRX, with cross-platform KOL collaborations spanning Instagram, Facebook and Xiaohongshu.",
      tag: "Social Media & Ad Placement",
      metric: "Multi-platform · KOL Collabs",
    },
    {
      title: "Master Ngan",
      desc: "Full social media management and new-product launches: campaign planning and ad placement, promotional material design, KOL partnerships, WhatsApp and email marketing (including chatbot setup), with over 100 KOL/MI collaborations.",
      tag: "Social Media & Ad Placement",
      metric: "100+ KOL/MI",
    },
    {
      title: "Magic Me Time",
      desc: "Social media management and advertising strategy for a bird's nest health-food brand. Grew Instagram followers to nearly 1,000 in under six months, encompassing KOL partnerships, product photography and brand PR.",
      tag: "Social Media & Ad Placement",
      metric: "~1K Followers in 6 Months",
    },
    {
      title: "Two Sisters Cold Skin Noodles",
      desc: "Social media management for a Sichuan-style snack shop that has earned the Michelin Bib Gourmand three consecutive years, leveraging the signature cold skin noodles to attract both locals and tourists and build brand reputation.",
      tag: "Social Media & Ad Placement",
      metric: "Michelin Bib Gourmand",
    },
    {
      title: "Nagamoto — Central Omakase",
      desc: "Social media management for the Hong Kong Central omakase restaurant opened by former Osaka Michelin three-star kaiseki chef Teruhiko Nagamoto, building a premium Japanese brand identity around the concept of seasonal cuisine.",
      tag: "Social Media & Ad Placement",
      metric: "Fine Dining · Michelin-Starred Chef",
    },
    {
      title: "Caligari Curry — Social Media",
      desc: "Ongoing social media management for Caligari Curry's Hong Kong outlets, with coconut curry and Premium Spice Curry as content pillars to craft the brand's distinctive tone of voice.",
      tag: "Social Media & Ad Placement",
      metric: "Japanese Brand · HK Outlets",
    },
    {
      title: "Smartist Learning Centre",
      desc: "Built the social media presence from scratch for a Mong Kok English tutoring centre, establishing a professional brand through English-learning content and driving enquiries and enrolments via Facebook advertising.",
      tag: "Social Media & Ad Placement",
      metric: "Lead Generation",
    },
    {
      title: "Gui Tea — Xiaohongshu KOL Campaign",
      desc: "Activated 50+ KOLs on Xiaohongshu in video and graphic formats for a premium tea brand, timed to coincide with a Hong Kong department store promotion and directly driving in-store sales.",
      tag: "KOL Engagement",
      metric: "50+ KOLs · Xiaohongshu",
    },
    {
      title: "Coffee Festival — KOC Campaign",
      desc: "KOC activations across five consecutive Coffee Festival editions, coordinating multiple KOC/KOL check-in posts for leading coffee brands on Xiaohongshu, generating an organic check-in effect with 100K+ total reach and 20K+ engagements.",
      tag: "KOL Engagement",
      metric: "100K+ Reach · 20K+ Engagements",
      wide: true,
    },
    {
      title: "LKS Foundation · KOL Matrix",
      desc: "A KOL network spanning healthcare, technology and lifestyle verticals, reaching 4.23M+ people in support of the Histotripsy 2.0 project and generating 5,755 high-quality engagements (likes, comments, saves and shares).",
      tag: "KOL Engagement",
      metric: "4.23M+ KOL Reach · 5,755 Engagements",
    },
    {
      title: "JC LevelMind — Youth Mental Health",
      desc: "Social media content and email marketing for the Jockey Club's destigmatisation programme for youth mental health, reaching diverse age groups through an integrated community, school and online approach alongside a PR communications strategy.",
      tag: "Social Media & Ad Placement",
      metric: "NGO · Social Media + PR",
    },
    {
      title: "JC LevelMind — PR Campaign",
      desc: "PR communications strategy for the Jockey Club's youth mental health programme, raising public awareness and building a positive, label-free brand image through an integrated community, school and digital outreach plan.",
      tag: "PR",
      metric: "NGO · PR Strategy",
    },
  ];

  const projects = activeFilter === "All" ? allProjects : allProjects.filter(p => p.tag === activeFilter);
  return (
    <section id="work" ref={ref} style={{ padding: "120px 48px", background: WHITE }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: BRAND, marginBottom: "16px",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease",
        }}>The Work</p>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
            fontSize: "clamp(2rem, 3.5vw, 3rem)", color: CHARCOAL, margin: 0, lineHeight: 1.1,
            opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(16px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
          }}>
            Selected<br /><em>Projects.</em>
          </h2>
          <p style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: "0.88rem", color: "#888",
            maxWidth: "280px", lineHeight: 1.6, textAlign: "right",
            opacity: inView ? 1 : 0, transition: "opacity 0.9s ease 0.2s",
          }}>
            Campaigns spanning PR, media relations, KOL strategy and social media across Hong Kong, Mainland China & Southeast Asia.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "40px", flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              padding: "9px 22px", borderRadius: "40px",
              border: `1px solid ${activeFilter === f ? CHARCOAL : BRAND}`,
              background: activeFilter === f ? CHARCOAL : "transparent",
              color: activeFilter === f ? WHITE : "#777",
              cursor: "pointer",
              transition: "all 0.25s ease",
            }}>
              {f}
            </button>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridAutoRows: "minmax(200px, auto)",
          gap: "16px",
        }}>
          {projects.map((p, i) => (
            <PortfolioCard key={p.title} project={p} delay={0.05 + i * 0.05} inView={inView} onClick={() => setSelectedProject(p)} />
          ))}
        </div>
      </div>
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
}

/* ─── Contact ─── */
function Contact() {
  const [ref, inView] = useInView();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [focused, setFocused] = useState(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (form.name && form.email) { setSent(true); }
  };

  return (
    <section id="contact" ref={ref} style={{
      padding: "120px 48px 80px",
      background: CHARCOAL,
      position: "relative", overflow: "hidden",
    }}>
      {/* Background orb */}
      <div style={{
        position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
        width: "600px", height: "400px",
        background: `radial-gradient(ellipse, ${BRAND}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: "640px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 2 }}>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem", letterSpacing: "0.28em",
          textTransform: "uppercase", color: BRAND, marginBottom: "20px",
          opacity: inView ? 1 : 0, transition: "opacity 0.7s ease",
        }}>The Connection</p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: WHITE,
          lineHeight: 1.1, margin: "0 0 16px",
          opacity: inView ? 1 : 0, transform: inView ? "none" : "translateY(24px)",
          transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          Let's Shape Your<br /><em style={{ color: BRAND }}>Next Chapter.</em>
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#aaa",
          lineHeight: 1.7, marginBottom: "56px",
          opacity: inView ? 1 : 0, transition: "opacity 0.9s ease 0.2s",
        }}>
          Ready to elevate your brand's presence? Book a complimentary consultation with our strategists.
        </p>

        {sent ? (
          <div style={{
            padding: "40px", border: `1px solid ${BRAND}55`,
            borderRadius: "12px", background: `${BRAND}11`,
          }}>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: WHITE, margin: 0 }}>
              Thank you. We'll be in touch shortly.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px", textAlign: "left" }}>
            {[
              { key: "name", label: "Full Name", type: "text" },
              { key: "email", label: "Email Address", type: "email" },
            ].map(({ key, label, type }) => (
              <div key={key} style={{ position: "relative" }}>
                <label style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: focused === key ? BRAND : "#666",
                  display: "block", marginBottom: "10px",
                  transition: "color 0.3s",
                }}>{label}</label>
                <input
                  type={type}
                  value={form[key]}
                  onFocus={() => setFocused(key)}
                  onBlur={() => setFocused(null)}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    borderBottom: `1px solid ${focused === key ? BRAND : "#444"}`,
                    padding: "10px 0", color: WHITE, outline: "none",
                    fontFamily: "'DM Sans', sans-serif", fontSize: "1rem",
                    boxSizing: "border-box",
                    boxShadow: focused === key ? `0 2px 0 0 ${BRAND}66` : "none",
                    transition: "border-color 0.3s, box-shadow 0.3s",
                  }}
                />
              </div>
            ))}
            <div>
              <label style={{
                fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
                letterSpacing: "0.18em", textTransform: "uppercase",
                color: focused === "message" ? BRAND : "#666",
                display: "block", marginBottom: "10px",
                transition: "color 0.3s",
              }}>Message (optional)</label>
              <textarea
                rows={3}
                value={form.message}
                onFocus={() => setFocused("message")}
                onBlur={() => setFocused(null)}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  borderBottom: `1px solid ${focused === "message" ? BRAND : "#444"}`,
                  padding: "10px 0", color: WHITE, outline: "none", resize: "none",
                  fontFamily: "'DM Sans', sans-serif", fontSize: "1rem",
                  boxSizing: "border-box",
                  boxShadow: focused === "message" ? `0 2px 0 0 ${BRAND}66` : "none",
                  transition: "border-color 0.3s, box-shadow 0.3s",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              <MagneticBtn
                className="btn-book"
                onClick={handleSubmit}
              >
                <style>{`
                  .btn-book {
                    background: ${BRAND}; color: ${CHARCOAL};
                    border: none; padding: 18px 52px;
                    font-family: 'DM Sans', sans-serif; font-size: 0.82rem;
                    letter-spacing: 0.18em; text-transform: uppercase;
                    cursor: pointer; border-radius: 2px;
                    font-weight: 600;
                    box-shadow: 0 0 40px ${BRAND}44;
                  }
                  .btn-book:hover { background: #d8dbd4; box-shadow: 0 0 60px ${BRAND}66; }
                `}</style>
                Book a Consultation
              </MagneticBtn>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: "100px", paddingTop: "32px",
        borderTop: "1px solid #333",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: "1100px", margin: "100px auto 0",
      }}>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.2rem", color: WHITE, letterSpacing: "0.04em" }}>
          TOTORO<span style={{ color: BRAND, fontStyle: "italic" }}>.</span>
        </span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "0.75rem", color: "#555", letterSpacing: "0.08em" }}>
          © 2026 Totoro Studio. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "24px" }}>
          {["Instagram", "LinkedIn", "Twitter"].map(s => (
            <a key={s} href="#" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.72rem",
              letterSpacing: "0.14em", textTransform: "uppercase",
              color: "#555", textDecoration: "none",
            }}
              onMouseEnter={e => e.target.style.color = BRAND}
              onMouseLeave={e => e.target.style.color = "#555"}
            >{s}</a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Google Fonts injection ─── */
function FontLoader() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
  return null;
}

/* ─── Root ─── */
export default function TotoroStudio() {
  const scrollY = useScrollY();
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: WHITE, overflowX: "hidden" }}>
      <FontLoader />
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::selection { background: ${BRAND}; color: ${CHARCOAL}; }
        @media (max-width: 768px) {
          nav { padding: 16px 20px !important; }
          nav > div:last-child { gap: 20px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
          .portfolio-grid { grid-template-columns: 1fr !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
      <Nav scrollY={scrollY} />
      <Hero scrollY={scrollY} />
      <About />
      <PRProcess />
      <Portfolio />
      <Contact />
    </div>
  );
}