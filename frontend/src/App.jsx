import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setshortUrl] = useState("");
  const [copied, setCopied] = useState("");
  const [qrImage, setqrImage] = useState("");

  const handleshorten = async () => {
    if (!url) return;

    try {
      const res = await axios.post();
    } catch (err) {
      console.log(err);
      alert("Something Went Wrong");
    }
  };

  return <div>Mern URL</div>;
}

export default App;
