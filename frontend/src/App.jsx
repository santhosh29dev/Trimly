import { useState, useEffect } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@500;600;700&family=Cabinet+Grotesk:wght@500;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }

  :root {
    --coral:   #ff5c3a;
    --amber:   #ffb020;
    --teal:    #00d4b8;
    --sky:     #40c4ff;
    --orange:  #ff8c00;     /* new - main orange */
    --dark-orange: #ff6200; /* deeper tone for gradient */
    --bg:      #0a0a0e;
    --surface: rgba(20,20,25,0.7);
    --border:  rgba(120,120,140,0.14);
    --text:    #f8f6f2;
    --muted:   rgba(240,235,225,0.48);
  }

  body {
    font-family: 'Cabinet Grotesk', system-ui, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Neon Hourglass Preloader (now orange) ── */
  .preloader {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    transition: opacity 0.7s ease 0.4s;
  }

  .preloader.hidden {
    opacity: 0;
    pointer-events: none;
    visibility: hidden;
  }

  .hourglass-container {
    position: relative;
    width: 90px;
    height: 140px;
  }

  .hourglass-svg {
    width: 100%;
    height: 100%;
  }

  .glow-ring {
    position: absolute;
    inset: -20px;
    border-radius: 50%;
    background: radial-gradient(circle at 50% 50%, rgba(255, 140, 0, 0.22) 0%, transparent 70%);
    animation: pulseGlow 3.2s ease-in-out infinite;
    pointer-events: none;
  }

  .particles {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 6px;
    height: 6px;
    background: var(--orange);
    border-radius: 50%;
    box-shadow: 0 0 12px var(--orange);
    opacity: 0;
    animation: fallParticles 2.8s infinite;
  }

  .particles:nth-child(2) { left: 42%; animation-delay: 0.4s; }
  .particles:nth-child(3) { left: 58%; animation-delay: 0.9s; }
  .particles:nth-child(4) { left: 35%; animation-delay: 1.6s; }

  @keyframes pulseGlow {
    0%, 100% { opacity: 0.3; transform: scale(0.9); }
    50%      { opacity: 0.75; transform: scale(1.18); }
  }

  @keyframes fallParticles {
    0%   { transform: translateY(-140px) scale(0); opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateY(160px) scale(0.4); opacity: 0; }
  }

  .loading-text {
    font-family: 'Clash Display', system-ui, sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    background: linear-gradient(90deg, var(--orange), var(--amber), var(--orange));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-size: 200% 100%;
    animation: textShimmer 3s ease-in-out infinite;
  }

  @keyframes textShimmer {
    0%   { background-position: 0% 50%; }
    100% { background-position: -200% 50%; }
  }

  /* ── Background (unchanged) ── */
  .mesh {
    position: fixed; inset: 0; z-index: -2;
    background:
      radial-gradient(ellipse 80% 60% at 10% 15%, rgba(255,82,82,0.18) 0%, transparent 65%),
      radial-gradient(ellipse 70% 55% at 90% 25%, rgba(64,196,255,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 60% 70% at 65% 85%, rgba(0,212,184,0.16) 0%, transparent 60%),
      var(--bg);
    animation: meshDrift 18s ease-in-out infinite alternate;
  }

  @keyframes meshDrift {
    0%   { background-position: 0% 0%; filter: hue-rotate(0deg) brightness(1); }
    100% { background-position: 30% 20%; filter: hue-rotate(10deg) brightness(1.04); }
  }

  .blob {
    position: fixed; border-radius: 50%; filter: blur(100px); opacity: 0.42;
    pointer-events: none; z-index: -1;
    animation: float infinite alternate ease-in-out;
  }
  .blob-1 { width: 480px; height: 480px; background: var(--coral);  top: -20vh; left: -15vw; animation-duration: 22s; }
  .blob-2 { width: 380px; height: 380px; background: var(--teal);   bottom: -10vh; right: -10vw; animation-duration: 26s; animation-delay: -4s; }
  .blob-3 { width: 300px; height: 300px; background: var(--amber);  top: 40%; left: 60%; animation-duration: 19s; animation-delay: -8s; }

  @keyframes float {
    to { transform: translate(60px, 80px) scale(1.15) rotate(6deg); }
  }

  /* Layout & rest of styles remain the same */
  .page { position: relative; z-index: 1; min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }

  .left-col {
    padding: 5rem 4rem;
    display: flex; flex-direction: column; justify-content: center;
    animation: slideInLeft 0.9s cubic-bezier(0.16,1,0.3,1) both;
  }

  .right-col {
    padding: 5rem 4rem;
    animation: slideInRight 1s cubic-bezier(0.16,1,0.3,1) 0.12s both;
  }

  @keyframes slideInLeft  { from { opacity:0; transform: translateX(-60px); } to { opacity:1; transform:none; } }
  @keyframes slideInRight { from { opacity:0; transform: translateX(60px);  } to { opacity:1; transform:none; } }

  .big-title {
    font-family: 'Clash Display', system-ui, sans-serif;
    font-size: clamp(3.2rem, 6vw, 5.2rem);
    font-weight: 800;
    line-height: 0.96;
    letter-spacing: -0.04em;
    margin-bottom: 1.4rem;
  }

  .gradient-word {
    background: linear-gradient(110deg, var(--coral), var(--amber), var(--teal));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    background-size: 180%;
    animation: hueFlow 7s ease-in-out infinite alternate;
  }

  @keyframes hueFlow {
    0%   { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }

  .left-desc {
    font-size: 15.5px; line-height: 1.65; color: var(--muted); max-width: 360px;
    margin-bottom: 2.4rem;
  }

  .pill {
    display: flex; align-items: center; gap: 12px;
    font-size: 13.5px; font-weight: 600; color: var(--muted);
    margin-bottom: 0.6rem;
    transition: all 0.3s ease;
  }

  .pill:hover { color: var(--text); transform: translateX(6px); }

  .pill-icon {
    width: 32px; height: 32px;
    border-radius: 10px;
    display: grid; place-items: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2.2rem 2rem;
    backdrop-filter: blur(22px);
    box-shadow: 0 20px 60px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
  }

  .card:hover { transform: translateY(-4px); box-shadow: 0 28px 80px rgba(0,0,0,0.45); }

  .url-input {
    width: 100%;
    padding: 1rem 1.3rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 14px;
    color: var(--text);
    font-size: 15px;
    transition: all 0.25s ease;
  }

  .url-input:focus {
    border-color: var(--coral);
    box-shadow: 0 0 0 4px rgba(255,92,58,0.14);
    transform: scale(1.01);
  }

  .btn-shorten {
    margin-top: 1.1rem;
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--coral), var(--amber) 60%, var(--teal));
    background-size: 300%;
    color: white;
    font-weight: 700;
    font-size: 15.5px;
    cursor: pointer;
    transition: all 0.28s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-shorten:hover {
    background-position: 100% 100%;
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(255,92,58,0.4);
  }

  .btn-shorten:active { transform: translateY(0); }

  .btn-shorten:disabled { opacity: 0.5; cursor: not-allowed; }

  .result-section {
    margin-top: 1.6rem;
    opacity: 0;
    transform: translateY(20px);
    animation: resultPop 0.6s cubic-bezier(0.34,1.6,0.64,1) 0.2s forwards;
  }

  @keyframes resultPop { to { opacity:1; transform:none; } }

  .result-chip {
    background: rgba(255,140,0,0.08);
    border: 1px solid rgba(255,140,0,0.2);
    border-radius: 12px;
    padding: 0.9rem 1.2rem;
    display: flex; align-items: center; gap: 12px;
    transition: all 0.3s ease;
  }

  .result-chip:hover { transform: scale(1.02); }

  .btn-copy {
    padding: 0.5rem 1rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: var(--muted);
    font-weight: 700;
    font-size: 12.5px;
    transition: all 0.22s ease;
    cursor: pointer;
  }

  .btn-copy.copied {
    background: rgba(255,140,0,0.18);
    border-color: var(--orange);
    color: var(--orange);
    transform: scale(1.08);
  }

  .qr-area {
    margin-top: 1.4rem;
    display: flex; gap: 1.4rem;
    opacity: 0;
    animation: fadeInUp 0.7s ease-out 0.5s forwards;
  }

  @keyframes fadeInUp { from { opacity:0; transform: translateY(18px); } to { opacity:1; transform:none; } }

  .qr-box {
    background: white;
    padding: 12px;
    border-radius: 14px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,140,0,0.15);
    transition: transform 0.4s ease;
  }

  .qr-box:hover { transform: scale(1.06) rotate(2deg); }

  @media (max-width: 780px) {
    .page { grid-template-columns: 1fr; }
    .left-col, .right-col { padding: 3rem 1.8rem; }
    .left-col { border-bottom: 1px solid var(--border); }
  }
`;

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleShorten = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });
      const newShort = res.data.shortUrl;
      setShortUrl(newShort);
      setCopied(false);

      const qrData = await QRCodeGenerator.toDataURL(newShort, {
        margin: 1,
        width: 160,
        color: { dark: "#000000", light: "#ffffff" },
      });
      setQrImage(qrData);
    } catch (err) {
      alert("Couldn't shorten the link — check the URL?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <style>{styles}</style>

      {/* Orange-themed preloader */}
      <div className={`preloader ${!showPreloader ? "hidden" : ""}`}>
        <div className="hourglass-container">
          <svg
            className="hourglass-svg"
            viewBox="0 0 100 160"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Outer frame */}
            <rect
              x="8"
              y="8"
              width="84"
              height="144"
              rx="12"
              fill="none"
              stroke="rgba(255,140,0,0.4)"
              strokeWidth="3"
            />

            {/* Top triangle */}
            <polygon
              points="20,30 80,30 50,80"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2"
            />

            {/* Bottom triangle */}
            <polygon
              points="20,130 80,130 50,80"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2"
            />

            {/* Falling sand - orange gradient */}
            <g clipPath="url(#sandClip)">
              <rect
                x="25"
                y="35"
                width="50"
                height="90"
                fill="url(#sandGradient)"
              >
                <animate
                  attributeName="height"
                  values="90;0;90"
                  dur="4.2s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values="35;125;35"
                  dur="4.2s"
                  repeatCount="indefinite"
                />
              </rect>
            </g>

            {/* Definitions */}
            <defs>
              <linearGradient
                id="sandGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="var(--orange)" />
                <stop offset="100%" stopColor="var(--dark-orange)" />
              </linearGradient>

              <clipPath id="sandClip">
                <rect x="25" y="35" width="50" height="90">
                  <animate
                    attributeName="height"
                    values="90;0;90"
                    dur="4.2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="y"
                    values="35;125;35"
                    dur="4.2s"
                    repeatCount="indefinite"
                  />
                </rect>
              </clipPath>
            </defs>
          </svg>

          <div className="glow-ring" />
          <div className="particles" />
          <div className="particles" />
          <div className="particles" />
          <div className="particles" />
        </div>

        <div className="loading-text">LOADING</div>
      </div>

      <div className="mesh" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="page">
        <div className="left-col">
          <div
            style={{
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.25em",
              color: "var(--amber)",
              marginBottom: "2rem",
              opacity: 0.9,
            }}
          >
            URL SHORTENER
          </div>

          <h1 className="big-title">
            Short links.
            <br />
            <span className="gradient-word">Big vibe.</span>
          </h1>

          <p className="left-desc">
            Drop a monster URL → get a clean link + scannable QR in one click.
            <br />
            No login. No nonsense.
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <div className="pill">
              <div
                className="pill-icon"
                style={{
                  background: "rgba(255,92,58,0.18)",
                  color: "var(--coral)",
                }}
              >
                ⚡
              </div>
              Zero-friction shortening
            </div>
            <div className="pill">
              <div
                className="pill-icon"
                style={{
                  background: "rgba(0,212,184,0.18)",
                  color: "var(--teal)",
                }}
              >
                ◈
              </div>
              QR code included
            </div>
            <div className="pill">
              <div
                className="pill-icon"
                style={{
                  background: "rgba(255,176,32,0.18)",
                  color: "var(--amber)",
                }}
              >
                ↯
              </div>
              Feels fast & satisfying
            </div>
          </div>
        </div>

        <div className="right-col">
          <div className="card">
            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                color: "var(--muted)",
                marginBottom: "1.1rem",
                textTransform: "uppercase",
              }}
            >
              Drop your link
            </div>

            <input
              className="url-input"
              type="url"
              placeholder="https://super-long-link.com/that-needs-shortening/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            />

            <button
              className="btn-shorten"
              onClick={handleShorten}
              disabled={loading}
            >
              {loading ? "Shortening..." : "Launch Link →"}
            </button>

            {shortUrl && (
              <div className="result-section">
                <div
                  style={{
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, var(--border), transparent)",
                    margin: "1.4rem 0",
                  }}
                />

                <div className="result-chip">
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      color: "var(--teal)",
                      fontWeight: 700,
                      fontSize: "14.5px",
                      textDecoration: "none",
                      wordBreak: "break-all",
                    }}
                  >
                    {shortUrl.replace(/^https?:\/\//, "")}
                  </a>
                  <button
                    className={`btn-copy ${copied ? "copied" : ""}`}
                    onClick={handleCopy}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>

                <div className="qr-area">
                  <div className="qr-box">
                    <QRCode value={shortUrl} size={124} />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.8rem",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13.5px",
                        color: "var(--muted)",
                        maxWidth: "220px",
                      }}
                    >
                      Point camera → instant access. Works everywhere.
                    </div>

                    {qrImage && (
                      <a
                        href={qrImage}
                        download="my-short-link-qr.png"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "0.6rem 1.1rem",
                          background:
                            "linear-gradient(135deg, rgba(64,196,255,0.12), rgba(0,212,184,0.12))",
                          border: "1px solid rgba(64,196,255,0.2)",
                          borderRadius: "10px",
                          color: "var(--sky)",
                          fontWeight: 700,
                          fontSize: "12.5px",
                          textDecoration: "none",
                          width: "fit-content",
                        }}
                      >
                        ↓ Save QR
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
