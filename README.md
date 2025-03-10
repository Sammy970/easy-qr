# easy-qr

Easy-QR is a simple and efficient npm package that allows you to generate QR codes from URLs and provides functionality to download them as image files.

## Installation

To install the package, run the following command:

```
npm install easy-qr
```

## Usage

Here is a basic example of how to use the Easy-QR package:

```javascript
const { QRCodeGenerator } = require('easy-qr');
const { QRCodeDownloader } = require('easy-qr');

const generator = new QRCodeGenerator();
const downloader = new QRCodeDownloader();

const url = 'https://example.com';
const qrCodeData = generator.generateQRCode(url);

// To download the QR code
downloader.downloadQRCode(qrCodeData, 'my-qrcode.png');
```

## API

### QRCodeGenerator

- `generateQRCode(url: string): string`
  - Generates a QR code from the provided URL and returns the QR code data.

### QRCodeDownloader

- `downloadQRCode(data: string, filename: string): void`
  - Downloads the generated QR code as an image file with the specified filename.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.