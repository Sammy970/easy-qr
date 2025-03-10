# easy-qr

A simple and efficient npm package to generate QR codes from URLs with customizable logos and styling.

## Features

- Generate QR codes from URLs
- Add custom logos (both local file paths and remote URLs)
- Customize QR code appearance (size, color, margins)
- Style the logo area (background color, border radius, transparency)
- Download QR codes as PNG images
- Works in both Node.js and browser environments

## Installation

```bash
npm install easy-qr
```

## Usage

### ES Modules (Node.js)

```javascript
import { QRCodeGenerator } from "easy-qr";
import fs from "fs";

async function generateQR() {
  // Create a QR code generator
  const generator = new QRCodeGenerator();

  // Generate a simple QR code
  const qrData = await generator.generateQRCode("https://github.com");

  // Save to file
  const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("github-qr.png", base64Data, "base64");
  console.log("QR code saved as github-qr.png");
}

generateQR();
```

### CommonJS (Node.js)

```javascript
const { QRCodeGenerator } = require("easy-qr");
const fs = require("fs");

async function generateQR() {
  const generator = new QRCodeGenerator();
  const qrData = await generator.generateQRCode("https://github.com");

  // Save to file
  const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("github-qr.png", base64Data, "base64");
}

generateQR();
```

### Browser Usage

```html
<!DOCTYPE html>
<html>
  <head>
    <title>easy-qr Demo</title>
  </head>
  <body>
    <div id="qrcode"></div>
    <button id="download">Download QR Code</button>

    <script src="./node_modules/easy-qr/dist/browser/easy-qr.min.js"></script>
    <script>
      const { QRCodeGenerator, QRCodeDownloader } = easyQR;

      async function generateAndDisplayQR() {
        const generator = new QRCodeGenerator();
        const qrData = await generator.generateQRCode("https://github.com");

        // Display QR code
        const img = document.createElement("img");
        img.src = qrData;
        document.getElementById("qrcode").appendChild(img);

        // Set up download
        document.getElementById("download").onclick = () => {
          const downloader = new QRCodeDownloader();
          downloader.downloadQRCode(qrData, "github-qr.png");
        };
      }

      generateAndDisplayQR();
    </script>
  </body>
</html>
```

## Adding a Logo

### Custom Logo from Local File (Node.js)

```javascript
import { QRCodeGenerator } from "easy-qr";
import fs from "fs";
import path from "path";

async function generateQRWithLogo() {
  const generator = new QRCodeGenerator();
  const logoPath = path.join(process.cwd(), "logo.png");

  const qrData = await generator.generateQRCode("https://github.com", {
    width: 300,
    margin: 4,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
    logo: logoPath,
    logoWidth: 60,
    logoHeight: 60,
    logoBackgroundColor: "#ffffff",
    logoRadius: 10,
    logoMargin: 5,
  });

  // Save to file
  const base64Data = qrData.replace(/^data:image\/png;base64,/, "");
  fs.writeFileSync("github-qr-with-logo.png", base64Data, "base64");
}

generateQRWithLogo();
```

### Using a Remote Logo URL (Browser)

```javascript
const generator = new QRCodeGenerator();

// Generate QR with a logo from URL
const qrData = await generator.generateQRCode("https://github.com", {
  width: 300,
  margin: 4,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
  logo: "https://github.com/github-logo.png",
  logoWidth: 60,
  logoHeight: 60,
  logoBackgroundColor: "transparent",
  logoRadius: 10,
  logoOpacity: 0.9,
});

// Display the QR code
document.getElementById("qrcode").innerHTML = `<img src="${qrData}">`;
```

## API Reference

### QRCodeGenerator

`generateQRCode(url: string, options?: QRCodeOptions): Promise<string>`

Generates a QR code and returns it as a data URL string.

#### Options

| Option                | Type   | Default         | Description                              |
| --------------------- | ------ | --------------- | ---------------------------------------- |
| `width`               | number | 300             | Width of the QR code in pixels           |
| `margin`              | number | 4               | White space around the QR code           |
| `color`               | object |                 | Color configuration                      |
| `color.dark`          | string | '#000000'       | Color of QR code modules                 |
| `color.light`         | string | '#ffffff'       | Background color                         |
| `logo`                | string | undefined       | URL or file path to the logo             |
| `logoWidth`           | number | 20% of QR width | Width of the logo in pixels              |
| `logoHeight`          | number | logoWidth       | Height of the logo in pixels             |
| `logoBackgroundColor` | string | 'transparent'   | Background color behind the logo         |
| `logoMargin`          | number | 5               | Margin around the logo in pixels         |
| `logoRadius`          | number | 0               | Border radius of the logo area in pixels |
| `logoOpacity`         | number | 1               | Opacity of the logo (0-1)                |

### QRCodeDownloader

`downloadQRCode(data: string, filename: string): void`

Downloads a QR code as an image file.

| Parameter  | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `data`     | string | The data URL of the QR code  |
| `filename` | string | Name of the file to download |

## Browser Compatibility

The package works in all modern browsers. For older browsers, you might need to use polyfills for features like `canvas` or `Blob`.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
