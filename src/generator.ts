import QRCode from "qrcode";
import { isValidURL } from "./utils/helpers.js";
import { createCanvas, loadImage } from "canvas";

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  logo?: string; // Can be a URL or a local file path
  logoPath?: string; // For backward compatibility
  logoWidth?: number;
  logoHeight?: number;
  logoBackgroundColor?: string; // Optional background color for the logo area
  logoOpacity?: number; // Optional opacity for the logo (0-1)
  logoMargin?: number; // Optional margin around the logo
  logoRadius?: number; // Optional border radius for the logo area
}

export class QRCodeGenerator {
  async generateQRCode(
    url: string,
    options: QRCodeOptions = {}
  ): Promise<string> {
    if (!isValidURL(url)) {
      throw new Error("Invalid URL");
    }

    try {
      // If no logo is provided, just return the simple QR code
      if (!options.logo && !options.logoPath) {
        return await QRCode.toDataURL(url, {
          width: options.width || 300,
          margin: options.margin || 4,
          color: {
            dark: options.color?.dark || "#000000",
            light: options.color?.light || "#ffffff",
          },
        });
      }

      // Create a QR code with logo
      return await this.generateQRCodeWithLogo(url, options);
    } catch (error) {
      throw new Error(`Failed to generate QR code: ${error}`);
    }
  }

  private async generateQRCodeWithLogo(
    url: string,
    options: QRCodeOptions
  ): Promise<string> {
    const width = options.width || 300;
    const margin = options.margin || 4;
    const logoWidth = options.logoWidth || width * 0.2; // Default logo width is 20% of QR code
    const logoHeight = options.logoHeight || logoWidth; // Square logo by default
    const logoMargin = options.logoMargin !== undefined ? options.logoMargin : 5;
    const logoBackgroundColor = options.logoBackgroundColor || "transparent";
    const logoOpacity = options.logoOpacity !== undefined ? options.logoOpacity : 1;
    const logoRadius = options.logoRadius || 0;
    
    // Support for both logo and logoPath (for backward compatibility)
    const logoSource = options.logo || options.logoPath;

    if (!logoSource) {
      throw new Error("Logo source is required");
    }

    // Create a canvas to draw on
    const canvas = createCanvas(width, width);
    const ctx = canvas.getContext("2d");

    // Generate the QR code without logo
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width,
      margin,
      color: {
        dark: options.color?.dark || "#000000",
        light: options.color?.light || "#ffffff",
      },
      errorCorrectionLevel: "H", // High error correction for logo insertion
    });

    // Load the QR code onto the canvas
    const qrCodeImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrCodeImage, 0, 0, width, width);

    try {
      // Load and draw the logo in the center
      const logo = await loadImage(logoSource);
      const logoX = (width - logoWidth) / 2;
      const logoY = (width - logoHeight) / 2;
      
      if (logoBackgroundColor !== "transparent") {
        // Create a background for the logo
        ctx.fillStyle = logoBackgroundColor;
        
        if (logoRadius > 0) {
          // Rounded rectangle for the logo background
          this.roundRect(
            ctx,
            logoX - logoMargin,
            logoY - logoMargin,
            logoWidth + (logoMargin * 2),
            logoHeight + (logoMargin * 2),
            logoRadius
          );
          ctx.fill();
        } else {
          // Regular rectangle for the logo background
          ctx.fillRect(
            logoX - logoMargin,
            logoY - logoMargin,
            logoWidth + (logoMargin * 2),
            logoHeight + (logoMargin * 2)
          );
        }
      }

      // Apply opacity if needed
      if (logoOpacity < 1) {
        ctx.globalAlpha = logoOpacity;
      }
      
      // Draw the logo (if radius > 0, clip to rounded rectangle)
      if (logoRadius > 0) {
        ctx.save();
        this.roundRect(
          ctx, 
          logoX, 
          logoY, 
          logoWidth, 
          logoHeight, 
          logoRadius
        );
        ctx.clip();
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
        ctx.restore();
      } else {
        ctx.drawImage(logo, logoX, logoY, logoWidth, logoHeight);
      }
      
      // Reset globalAlpha
      ctx.globalAlpha = 1;

      // Return the combined image as data URL
      return canvas.toDataURL("image/png");
    } catch (error) {
      throw new Error(`Failed to add logo to QR code: ${error}`);
    }
  }
  
  // Helper function to draw rounded rectangles
  private roundRect(
    ctx: any,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    return ctx;
  }
}

export default QRCodeGenerator;