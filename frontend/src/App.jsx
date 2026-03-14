import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=cabinet-grotesk@400,500,700,800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --coral:   #ff5c3a;
    --amber:   #ffb020;
    --teal:    #00c9a7;
    --sky:     #38b6ff;
    --violet:  #8b5cf6;
    --bg:      #0d0d0f;
    --surface: rgba(255,255,255,0.05);
    --border:  rgba(255,255,255,0.10);
    --text:    #f5f3ef;
    --muted:   rgba(245,243,239,0.45);
  }

  body {
    font-family: 'Cabinet Grotesk', 'DM Sans', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  /* ── Animated mesh background ── */
  .mesh {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background:
      radial-gradient(ellipse 70% 55% at 15% 10%,  rgba(255,92,58,0.22)  0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 85% 20%,  rgba(56,182,255,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 55% 60% at 70% 80%,  rgba(0,201,167,0.20)  0%, transparent 55%),
      radial-gradient(ellipse 50% 45% at 20% 75%,  rgba(255,176,32,0.16) 0%, transparent 50%),
      #0d0d0f;
    animation: meshShift 14s ease-in-out infinite alternate;
  }
  @keyframes meshShift {
    0%   { filter: hue-rotate(0deg)   brightness(1); }
    50%  { filter: hue-rotate(18deg)  brightness(1.05); }
    100% { filter: hue-rotate(-12deg) brightness(0.97); }
  }

  /* Floating blobs */
  .blob {
    position: fixed; border-radius: 50%; filter: blur(90px);
    pointer-events: none; z-index: 0; opacity: 0.55;
  }
  .blob-1 { width: 420px; height: 420px; background: var(--coral);  top: -140px; left: -80px;  animation: float1 20s ease-in-out infinite alternate; }
  .blob-2 { width: 340px; height: 340px; background: var(--teal);   bottom: -80px; right: -60px; animation: float2 16s ease-in-out infinite alternate; }
  .blob-3 { width: 260px; height: 260px; background: var(--amber);  top: 45%; left: 55%; animation: float3 18s ease-in-out infinite alternate; }
  @keyframes float1 { to { transform: translate(60px, 80px) scale(1.1); } }
  @keyframes float2 { to { transform: translate(-50px, -60px) scale(1.08); } }
  @keyframes float3 { to { transform: translate(30px, -40px) scale(0.92); } }

  /* ── Layout ── */
  .page {
    position: relative; z-index: 1;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    align-items: stretch;
  }

  /* Left column — branding */
  .left-col {
    display: flex; flex-direction: column; justify-content: center;
    padding: 4rem 3rem 4rem 4rem;
    border-right: 1px solid var(--border);
    animation: fadeLeft 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fadeLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .brand-tag {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--amber); margin-bottom: 1.8rem;
  }
  .brand-tag-dot {
    width: 8px; height: 8px; border-radius: 50%; background: var(--amber);
    animation: pulseDot 2s ease-in-out infinite;
  }
  @keyframes pulseDot {
    0%,100% { box-shadow: 0 0 0 0 rgba(255,176,32,0.6); }
    50%      { box-shadow: 0 0 0 8px rgba(255,176,32,0); }
  }

  .big-title {
    font-family: 'Clash Display', 'Syne', sans-serif;
    font-size: clamp(2.8rem, 4.5vw, 4.2rem);
    font-weight: 700; line-height: 1.0; letter-spacing: -0.03em;
    margin-bottom: 1.2rem;
  }
  .gradient-word {
    background: linear-gradient(135deg, var(--coral) 0%, var(--amber) 45%, var(--teal) 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
    background-size: 200% 200%;
    animation: gradShift 5s ease-in-out infinite alternate;
  }
  @keyframes gradShift {
    from { background-position: 0% 50%; }
    to   { background-position: 100% 50%; }
  }

  .left-desc {
    font-size: 15px; color: var(--muted); line-height: 1.7; max-width: 340px;
    margin-bottom: 2.5rem; font-weight: 500;
  }

  /* Feature pills */
  .pills { display: flex; flex-direction: column; gap: 10px; }
  .pill {
    display: inline-flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 600; color: var(--muted);
    animation: fadeLeft 0.7s cubic-bezier(0.16,1,0.3,1) both;
  }
  .pill:nth-child(2) { animation-delay: 0.08s; }
  .pill:nth-child(3) { animation-delay: 0.16s; }
  .pill-icon {
    width: 28px; height: 28px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
  .pi-coral  { background: rgba(255,92,58,0.2);  color: var(--coral); }
  .pi-teal   { background: rgba(0,201,167,0.2);  color: var(--teal); }
  .pi-amber  { background: rgba(255,176,32,0.2); color: var(--amber); }

  /* Right column — form */
  .right-col {
    display: flex; flex-direction: column; justify-content: center;
    padding: 4rem 4rem 4rem 3rem;
    animation: fadeRight 0.7s 0.15s cubic-bezier(0.16,1,0.3,1) both;
  }
  @keyframes fadeRight {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .card {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2rem;
    backdrop-filter: blur(20px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08);
  }

  .card-label {
    font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--muted); margin-bottom: 1.2rem;
  }

  .input-wrap {
    display: flex; flex-direction: column; gap: 10px; margin-bottom: 1rem;
  }

  .url-input {
    width: 100%; background: rgba(255,255,255,0.06);
    border: 1px solid var(--border); border-radius: 12px;
    outline: none; color: var(--text);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 14px; font-weight: 500;
    padding: 0.85rem 1.1rem;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .url-input::placeholder { color: rgba(245,243,239,0.22); }
  .url-input:focus {
    border-color: var(--coral);
    box-shadow: 0 0 0 3px rgba(255,92,58,0.15);
  }

  /* ── THE BUTTON with conic spin ring ── */
  .btn-wrap {
    position: relative; width: 100%;
  }
  .btn-shorten {
    position: relative; width: 100%; z-index: 1;
    padding: 0.9rem 1.5rem; border: none; border-radius: 12px; cursor: pointer;
    font-family: 'Clash Display', sans-serif; font-size: 15px; font-weight: 600;
    letter-spacing: 0.02em; color: #fff;
    background: linear-gradient(135deg, var(--coral) 0%, var(--amber) 50%, var(--teal) 100%);
    background-size: 200% 200%;
    transition: transform 0.15s, box-shadow 0.15s, background-position 0.4s;
    box-shadow: 0 8px 32px rgba(255,92,58,0.35);
    overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .btn-shorten:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(255,92,58,0.5);
    background-position: 100% 100%;
  }
  .btn-shorten:active:not(:disabled) { transform: translateY(0); }
  .btn-shorten:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Shimmer sweep on button */
  .btn-shorten::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
    transform: translateX(-100%);
  }
  .btn-shorten:hover::after { animation: shimmer 0.6s ease forwards; }
  @keyframes shimmer {
    to { transform: translateX(100%); }
  }

  /* Conic spinning ring — the star of the show */
  .spin-ring {
    position: relative; width: 22px; height: 22px; flex-shrink: 0;
  }
  .spin-ring::before {
    content: '';
    position: absolute; inset: 0;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      rgba(255,255,255,0)   0%,
      rgba(255,255,255,0.3) 30%,
      rgba(255,255,255,0.9) 60%,
      rgba(255,255,255,1)   80%,
      rgba(255,255,255,0)   100%
    );
    animation: conicSpin 0.9s linear infinite;
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 2px));
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 2px));
  }
  @keyframes conicSpin { to { transform: rotate(360deg); } }

  /* ── Result section ── */
  .result-section {
    margin-top: 1.4rem;
    animation: popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes popUp {
    from { opacity: 0; transform: translateY(16px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border), transparent);
    margin: 1.2rem 0;
  }

  .result-chip {
    display: flex; align-items: center; gap: 10px;
    background: rgba(0,201,167,0.08); border: 1px solid rgba(0,201,167,0.2);
    border-radius: 10px; padding: 0.75rem 1rem;
    margin-bottom: 0.8rem;
  }
  .result-link {
    flex: 1; min-width: 0;
    font-family: 'Clash Display', sans-serif; font-size: 14px; font-weight: 600;
    color: var(--teal); text-decoration: none; word-break: break-all;
    transition: color 0.15s;
  }
  .result-link:hover { color: #4dffd8; }

  .btn-copy {
    flex-shrink: 0; padding: 0.3rem 0.8rem; border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.12);
    background: rgba(255,255,255,0.07); color: rgba(245,243,239,0.7);
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 12px; font-weight: 700;
    cursor: pointer; transition: all 0.2s;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .btn-copy:hover { background: rgba(255,255,255,0.12); color: var(--text); }
  .btn-copy.copied {
    background: rgba(0,201,167,0.15); border-color: rgba(0,201,167,0.4); color: var(--teal);
  }

  /* QR area */
  .qr-area {
    display: flex; gap: 1.2rem; align-items: flex-start;
    animation: popUp 0.45s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  .qr-box {
    background: #fff; border-radius: 12px; padding: 10px; flex-shrink: 0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3),
                0 0 0 1px rgba(255,255,255,0.1),
                0 0 30px rgba(0,201,167,0.2);
  }
  .qr-info { display: flex; flex-direction: column; gap: 0.7rem; justify-content: center; }
  .qr-desc { font-size: 13px; color: var(--muted); line-height: 1.6; font-weight: 500; }

  .btn-dl {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 0.5rem 1rem; border-radius: 9px;
    background: linear-gradient(135deg, rgba(56,182,255,0.15), rgba(0,201,167,0.15));
    border: 1px solid rgba(56,182,255,0.25);
    color: var(--sky); text-decoration: none;
    font-family: 'Cabinet Grotesk', sans-serif; font-size: 12px; font-weight: 700;
    letter-spacing: 0.06em; text-transform: uppercase;
    transition: all 0.2s; width: fit-content;
  }
  .btn-dl:hover {
    background: linear-gradient(135deg, rgba(56,182,255,0.25), rgba(0,201,167,0.25));
    box-shadow: 0 4px 16px rgba(56,182,255,0.2);
  }

  /* Responsive */
  @media (max-width: 700px) {
    .page { grid-template-columns: 1fr; }
    .left-col { padding: 3rem 1.5rem 1.5rem; border-right: none; border-bottom: 1px solid var(--border); }
    .right-col { padding: 1.5rem; }
    .big-title { font-size: 2.2rem; }
  }
`;

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShorten = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });
      const newShortUrl = res.data.shortUrl;
      setShortUrl(newShortUrl);
      setCopied(false);
      const qr = await QRCodeGenerator.toDataURL(newShortUrl, {
        margin: 1,
        width: 140,
      });
      setQrImage(qr);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="mesh" />
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="page">
        {/* Left — branding */}
        <div className="left-col">
          <div className="brand-tag">
            <span className="brand-tag-dot" />
            URL Shortener
          </div>

          <h1 className="big-title">
            Make your
            <br />
            links <span className="gradient-word">brilliant.</span>
          </h1>

          <p className="left-desc">
            Paste any long URL and transform it into a clean, shareable link
            with a QR code — in under a second.
          </p>

          <div className="pills">
            <div className="pill">
              <div className="pill-icon pi-coral">⚡</div>
              Instant shortening, no signup
            </div>
            <div className="pill">
              <div className="pill-icon pi-teal">◈</div>
              Auto-generated QR code
            </div>
            <div className="pill">
              <div className="pill-icon pi-amber">↓</div>
              Download QR as PNG
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="right-col">
          <div className="card">
            <p className="card-label">Paste your URL</p>

            <div className="input-wrap">
              <input
                className="url-input"
                type="url"
                placeholder="https://example.com/your/very/long/link..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              />

              <div className="btn-wrap">
                <button
                  className="btn-shorten"
                  onClick={handleShorten}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spin-ring" />
                      Shortening…
                    </>
                  ) : (
                    "Shorten Link →"
                  )}
                </button>
              </div>
            </div>

            {shortUrl && (
              <div className="result-section">
                <div className="divider" />

                <div className="result-chip">
                  <a
                    className="result-link"
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {shortUrl}
                  </a>
                  <button
                    className={`btn-copy${copied ? " copied" : ""}`}
                    onClick={handleCopy}
                  >
                    {copied ? "✓ Done" : "Copy"}
                  </button>
                </div>

                <div className="qr-area">
                  <div className="qr-box">
                    <QRCode value={shortUrl} size={110} />
                  </div>
                  <div className="qr-info">
                    <p className="qr-desc">
                      Scan with any camera app to open the link on any device.
                    </p>
                    {qrImage && (
                      <a
                        className="btn-dl"
                        href={qrImage}
                        download="qr-code.png"
                      >
                        ↓ Download QR
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
