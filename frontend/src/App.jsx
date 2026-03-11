import { useState } from "react";
import axios from "axios";
import QRCode from "react-qr-code";
import QRCodeGenerator from "qrcode";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setshortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qrImage, setQrImage] = useState("");

  const handleshorten = async () => {
    if (!url) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/shorten`, {
        originalUrl: url,
      });

      const newShortUrl = res.data.shortUrl;
      setshortUrl(newShortUrl);
      setCopied(false);

      const qr = await QRCodeGenerator.toDataURL(newShortUrl);
      setQrImage(qr);
    } catch (err) {
      console.log(err);
      alert("Something Went Wrong");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">URL Shortner</h1>

      <div className="flex flex-col gap-3 w-full max-w-3xl">
        <input
          type="text"
          className="input input-success w-full"
          placeholder="Enter The Long URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="btn btn-primary w-full sm:auto"
          onClick={handleshorten}
        >
          Shorten
        </button>
      </div>

      {shortUrl && (
        <div className="flex flex-col items-center max-w-3xl w-full">
          <p font-medium mb-2>
            Your Short Link
          </p>
          <a className="link link-primary break-all" href={shortUrl}>
            {shortUrl}
          </a>
          <button
            onClick={handleCopy}
            className={`btn mt-2 w-full ${copied ? "btn-success" : "btn-secondary"}`}
          >
            {copied ? "Copied" : "Copy"}
          </button>

          <div className="bg-white p-4 rounded-lg shadow mt-6">
            <p className="mb-2 text-center font-semibold text-gray-800">
              Scan QR Code
            </p>
            <QRCode value={shortUrl} size={180} />
          </div>

          {qrImage && (
            <a
              className="btn btn-accent mt-3 w-full"
              download="qr.code.png"
              href={qrImage}
            >
              Download QR Code
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
