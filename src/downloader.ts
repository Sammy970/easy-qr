export class QRCodeDownloader {
  downloadQRCode(data: string, filename: string): void {
    const link = document.createElement("a");
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default QRCodeDownloader;
