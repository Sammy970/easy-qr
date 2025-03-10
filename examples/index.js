// example-esm.js
import { QRCodeGenerator, QRCodeDownloader } from "easy-qr";
import fs from "fs";

async function generateQR() {
  const generator = new QRCodeGenerator();
  const url = "https://example.com";

  const qrData = await generator.generateQRCode(url, {
    size: 300,
    margin: 1,
    color: {
      dark: "#000000ff",
      light: "#ffffffff",
    },
    logo: "https://example.com/logo.png",
    logoWidth: 70,
    logoHeight: 70,
  });
  console.log("QR Code generated!");

  // Save to file
  const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("qr-code.png", base64Data, "base64");
}

generateQR().catch(console.error);
