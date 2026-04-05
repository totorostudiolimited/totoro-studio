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
          marginBottom: "48px", maxWidth: "520px", margin: "0 auto 48px",
          opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(18px)",
          transition: "all 1s cubic-bezier(0.16,1,0.3,1) 0.45s",
        }}>
          Your strategic partner in PR and Digital Marketing Excellence.
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
              Where Stories Shape<br /><em>Brand Reputation.</em>
            </h2>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#666",
              lineHeight: 1.8, marginBottom: "24px",
              opacity: inView ? 1 : 0, transition: "opacity 0.9s ease 0.25s",
            }}>
              We bridge the gap between brands and media through professional PR, strategic storytelling and data-driven digital marketing — from media relations and event management to KOL campaigns, content creation and all-media marketing across Hong Kong, Mainland China and Southeast Asia.
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "1rem", color: "#666",
              lineHeight: 1.8,
              opacity: inView ? 1 : 0, transition: "opacity 0.9s ease 0.35s",
            }}>
              Totoro Studio works with governments, foundations, F&B brands, lifestyle labels and NGOs — ensuring every narrative carries both cultural resonance and measurable media impact.
            </p>
          </div>

          {/* Right col — service cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { Icon: IconPR, title: "Public Relations & Events", desc: "媒體關係、新聞稿、記者統籌及活動管理，創造真實報道及可量化媒體價值。" },
              { Icon: IconSocial, title: "Social Media & KOL Strategy", desc: "跨平台社媒內容、社群管理、KOL/KOC合作及付費廣告，覆蓋IG、FB、小紅書、微博、抖音等。" },
              { Icon: IconMedia, title: "內地全媒體營銷", desc: "整合小紅書、微信、抖音、微博等平台，制定品效合一的全域方案，配合KOL管理及數據分析優化投放。" },
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

/* ─── Portfolio card ─── */
function PortfolioCard({ project, delay, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      }}
    >
      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%231A1A1A' fill-rule='evenodd'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1z'/%3E%3C/g%3E%3C/svg%3E")`,
      }} />

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
const FILTERS = ["All", "PR & Mainland China", "Social Media", "KOL & Content"];

/* ─── Portfolio ─── */
function Portfolio() {
  const [ref, inView] = useInView(0.1);
  const [activeFilter, setActiveFilter] = useState("All");

  const allProjects = [
    // PR & Mainland China
    {
      title: "李嘉誠基金會 · Histotripsy 2.0",
      desc: "亞洲首台肝癌無創組織碎化系統捐贈予中大的全媒體公關推廣。22家主流媒體報道，利用《新聞女王2》進行病毒式傳播，80%搜尋量被百度收錄。",
      tag: "PR & Mainland China",
      metric: "3.53M+ 曝光 · 4.23M+ KOL觸及",
      wide: true,
    },
    {
      title: "Wing Lok Noodle — Pop-up Launch",
      desc: "為永樂麵廠百貨公司快閃店策劃媒體之旅、撰寫新聞稿及安排記者試食，成功獲得15+本地生活媒體報道，大幅提升品牌曝光。",
      tag: "PR & Mainland China",
      metric: "15+ 媒體報道",
    },
    {
      title: "Caligari Curry — 沙田新店開幕",
      desc: "日式咖喱名店 Caligari 香港第二分店開幕媒體活動策劃，安排記者獨家試食，成功打入香港美食媒體版圖。",
      tag: "PR & Mainland China",
      metric: "Media Relations",
    },
    {
      title: "Indonesia Trade & Investment Forum",
      desc: "印尼駐港總領事館主辦、香港首屆工貿旅投資論壇的全方位媒體服務：邀請媒體、策略性推介、發佈後跟進及媒體網絡廣播。",
      tag: "PR & Mainland China",
      metric: "67個媒體報道 · HK$236萬媒體價值",
    },
    {
      title: "Wellcome 米行慈善啟動禮",
      desc: "統籌惠康超市米捐贈慈善計劃啟動儀式，涵蓋高管出席、媒體機會及顧客互動活動，聯同Foodlink扶貧公益，獲逾30個廣播及印刷媒體報道。",
      tag: "PR & Mainland China",
      metric: "30+ 媒體報道",
    },
    {
      title: "飛高慈善體育計劃 2025",
      desc: "騰訊慈善基金會及嘉華國際主辦慈善體育活動的媒體服務：撰寫新聞邀請函、新聞稿及全面媒體網絡廣播，最大化活動曝光。",
      tag: "PR & Mainland China",
      metric: "騰訊慈善 · 嘉華國際",
    },
    {
      title: "環保署 T·PARK 正面形象工程",
      desc: "環保署廢物轉化能源設施KOL及媒體推廣，以家長及年輕人為目標受眾，扭轉大眾對焚化爐的負面印象，推廣環保社區設施。",
      tag: "PR & Mainland China",
      metric: "政府 · 環保署",
    },
    {
      title: "#SheMeansBusiness — Meta",
      desc: "Meta 女性創業旗艦計劃香港區策劃及執行：Facebook 直播培訓、座談會及5周年大型活動，聯動全港頂尖KOL，服務超過兩年。",
      tag: "PR & Mainland China",
      metric: "2020–2022 · Meta Program",
      wide: true,
    },
    // Social Media
    {
      title: "Wing Lok Noodle 永樂麵廠",
      desc: "自2023年4月起全面管理社交媒體：廣告投放、宣傳設計、內容創作、社媒管理及200+ KOL/MI合作。節慶推廣ROAS高達44.33倍（行業基準8倍），整體平均ROAS達137.18倍。",
      tag: "Social Media",
      metric: "ROAS 最高達137倍 · 200+ KOL合作",
      wide: true,
    },
    {
      title: "Mittoappu — 吉隆坡 TRX",
      desc: "馬來西亞首間和歌山和牛日式餐廳的雙語社媒管理、廣告投放及KOL合作（含130萬粉絲KL Foodie）。半天內獲40+查詢，每個潛在客戶成本低至$9。",
      tag: "Social Media",
      metric: "244K觀看 · $9每個潛客成本",
    },
    {
      title: "Boucake — 吉隆坡 TRX",
      desc: "TRX 現代日式甜品咖啡廳的雙語社媒管理、廣告投放，跨平台IG、FB 及小紅書KOL合作推廣。",
      tag: "Social Media",
      metric: "多平台 · KOL合作",
    },
    {
      title: "奀師傅",
      desc: "全面社媒管理及新產品推廣：廣告策劃及投放、宣傳物資設計、KOL合作、WhatsApp及電郵行銷（包括設置聊天機器人），合作超過100位KOL/MI。",
      tag: "Social Media",
      metric: "100+ KOL/MI",
    },
    {
      title: "Magic Me Time",
      desc: "燕窩健康輕食品牌社媒管理及廣告策略。不足6個月Instagram粉絲增長至近1,000，涵蓋KOL合作、產品造型攝影及品牌公關。",
      tag: "Social Media",
      metric: "6個月內增長至近1K粉絲",
    },
    {
      title: "兩姊妹涼皮",
      desc: "連續三年獲米芝蓮必比登推介的四川風味小食店社交媒體管理，以涼皮獨特賣點吸引本地及旅客，建立品牌口碑。",
      tag: "Social Media",
      metric: "米芝蓮必比登推介",
    },
    {
      title: "Nagamoto — 中環Omakase",
      desc: "前大阪米芝蓮三星懷石料理主廚長本輝彥於香港中環開設Omakase餐廳的社交媒體管理，以「旬料理」概念建立高端日式品牌形象。",
      tag: "Social Media",
      metric: "Fine Dining · 米芝蓮主廚",
    },
    {
      title: "Caligari Curry — 社交媒體管理",
      desc: "日式咖喱名店 Caligari 香港分店的社交媒體日常管理，以「椰香咖喱」及「Premium Spice Curry」為內容核心，打造品牌獨特調性。",
      tag: "Social Media",
      metric: "日本名店 · 香港分店",
    },

    {
      title: "Smartist Learning Centre",
      desc: "為旺角英文補習中心從零建立社交媒體形象，以英語學習內容建立專業品牌，並透過Facebook廣告推動查詢及報名。",
      tag: "Social Media",
      metric: "Lead Generation",
    },
    {
      title: "Gui Tea — 小紅書KOL推廣",
      desc: "配合香港百貨公司促銷活動，為高端茶葉品牌在小紅書啟動50+ KOL以視頻及圖文格式推廣，直接推動門店銷售。",
      tag: "KOL & Content",
      metric: "50+ KOLs · 小紅書",
    },
    {
      title: "咖啡節 KOC推廣",
      desc: "連續5屆咖啡節KOC推廣，協助各大咖啡品牌在小紅書平台聯合多位KOC/KOL打卡分享，形成自發性打卡效應，總流量突破10萬+，互動數超2萬+。",
      tag: "KOL & Content",
      metric: "10萬+流量 · 2萬+互動",
      wide: true,
    },
    {
      title: "李嘉誠基金會 · KOL矩陣",
      desc: "涵蓋醫療、科技及生活風格領域的KOL網絡，配合Histotripsy 2.0項目觸達423萬+人次，並透過互動內容（按讚、留言、收藏、分享）帶動5,755次高質互動。",
      tag: "KOL & Content",
      metric: "4.23M+ KOL觸及 · 5,755互動",
    },
    {
      title: "JC LevelMind 青少年精神健康",
      desc: "賽馬會無標籤青少年精神健康計劃的社媒內容及電郵行銷，以社區、學校及網上整合形式觸及不同年齡層。同時提供公關傳播策略，建立正面無標籤的品牌形象。",
      tag: "Social Media",
      metric: "NGO · 社媒 + 公關",
    },
    {
      title: "JC LevelMind — 公關推廣",
      desc: "賽馬會青少年精神健康計劃的公關傳播策略，提升社會對精神健康的關注，建立正面無標籤的品牌形象，配合整合社區、學校及網上的傳播方案。",
      tag: "PR & Mainland China",
      metric: "NGO · 公關策略",
    },
    {
      title: "香港旅遊發展局",
      desc: "為「發現香港」製作SEO內容攻略，涵蓋最佳實踐、策略及技巧，並配合專業攝影服務撰寫新文章，提升網站搜尋排名。",
      tag: "KOL & Content",
      metric: "SEO · 內容策略",
    },
    {
      title: "品牌全網營銷",
      desc: "整合跨渠道資源（社交媒體、電商平台、KOL、信息流廣告），制定品效合一的全域營銷方案。曾統籌知名品牌年度營銷，全網曝光量超1,000萬，轉化率提升300%。",
      tag: "KOL & Content",
      metric: "1,000萬+曝光 · 轉化率+300%",
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
            <PortfolioCard key={p.title} project={p} delay={0.05 + i * 0.05} inView={inView} />
          ))}
        </div>
      </div>
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
      <Portfolio />
      <Contact />
    </div>
  );
}