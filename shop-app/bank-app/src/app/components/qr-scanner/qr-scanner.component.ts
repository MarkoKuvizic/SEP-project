import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import jsQR from 'jsqr';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.scss']
})
export class QrScannerComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  
  private canvasContext!: CanvasRenderingContext2D;
  private destroy$ = new Subject<void>();
  
  // Scanner state
  isScanning = false;
  scannerError: string | null = null;
  scanResult: string | null = null;
  isProcessing = false;
  
  // Camera settings
  facingMode: 'environment' | 'user' = 'environment';
  availableCameras: MediaDeviceInfo[] = [];
  selectedCameraId: string = '';
  
  // API configuration
  private apiEndpoint = 'https://demarcus-unphosphatised-gilbert.ngrok-free.dev/api/transactions/pay/qr'; 
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.loadAvailableCameras();
  }
  
  ngOnDestroy() {
    this.stopScanner();
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  async loadAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.availableCameras = devices.filter(device => device.kind === 'videoinput');
      if (this.availableCameras.length > 0) {
        // Prefer rear camera on mobile
        const rearCamera = this.availableCameras.find(cam => 
          cam.label.toLowerCase().includes('back') || 
          cam.label.toLowerCase().includes('rear') ||
          cam.label.toLowerCase().includes('environment')
        );
        this.selectedCameraId = rearCamera?.deviceId || this.availableCameras[0].deviceId;
      }
    } catch (error) {
      console.error('Error loading cameras:', error);
    }
  }
  
  async startScanner() {
    this.scannerError = null;
    this.scanResult = null;
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      this.scannerError = 'Camera API not supported in this browser';
      return;
    }
    
    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: this.facingMode,
        deviceId: this.selectedCameraId ? { exact: this.selectedCameraId } : undefined,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    };
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.videoElement.nativeElement.srcObject = stream;
      this.videoElement.nativeElement.play();
      
      this.canvasContext = this.canvasElement.nativeElement.getContext('2d')!;
      this.isScanning = true;
      
      // Start scanning loop
      this.scanQRCode();
    } catch (error: any) {
      this.handleCameraError(error);
    }
  }
  
  stopScanner() {
    this.isScanning = false;
    if (this.videoElement?.nativeElement.srcObject) {
      const stream = this.videoElement.nativeElement.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
    }
  }
  
  private async scanQRCode() {
    if (!this.isScanning || !this.canvasContext) return;
    
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    
    // Set canvas dimensions to match video
    if (video.videoWidth && video.videoHeight) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      this.canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get image data for QR processing
      const imageData = this.canvasContext.getImageData(0, 0, canvas.width, canvas.height);
      
      // Use jsQR to decode QR code
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      
      if (code) {
        // QR code found
        this.handleScanResult(code.data);
        return;
      }
    }
    
    // Continue scanning
    if (this.isScanning) {
      requestAnimationFrame(() => this.scanQRCode());
    }
  }
  
  private handleScanResult(qrData: string) {
    this.stopScanner();
    this.scanResult = qrData;
    
    // Parse the QR code data
    const parsedData = this.parseQRData(qrData);
    
    if (parsedData) {
      // Send to API endpoint
      this.sendToApi(parsedData);
    } else {
      this.scannerError = 'Invalid QR code format';
    }
  }
  
  public parseQRData(qrData: string): any | null {
    // Expected format: "K:PR|V:01|C:USD|R:123456789|N:John Doe|I:100.00|S:Payment"
    const pattern = /^K:PR\|V:(\d{2})\|C:([^|]+)\|R:([^|]+)\|N:([^|]+)\|I:([\d.]+)\|S:([^|]+)$/;
    const match = qrData.match(pattern);
    
    if (!match) {
      return null;
    }
    
    return {
      version: match[1],
      currency: match[2],
      receiverAccount: match[3],
      receiverName: match[4],
      amount: parseFloat(match[5]),
      purpose: match[6],
      rawData: qrData
    };
  }
  
  private sendToApi(data: any) {
    this.isProcessing = true;
    
    this.http.post(this.apiEndpoint, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isProcessing = false;
          console.log('API Response:', response);
          // Handle successful API response
          alert('Payment information sent successfully!');
        },
        error: (error) => {
          alert(error.message)
          this.isProcessing = false;
          console.error('API Error:', error);
          this.scannerError = 'Failed to send data to server. Please try again.';
        }
      });
  }
  
  private handleCameraError(error: any) {
    console.error('Camera error:', error);
    
    switch (error.name) {
      case 'NotAllowedError':
        this.scannerError = 'Camera access denied. Please allow camera access in your browser settings.';
        break;
      case 'NotFoundError':
        this.scannerError = 'No camera found on this device.';
        break;
      case 'NotSupportedError':
        this.scannerError = 'Camera not supported in this browser.';
        break;
      case 'NotReadableError':
        this.scannerError = 'Camera is already in use by another application.';
        break;
      default:
        this.scannerError = 'Unable to access camera. Please try again.';
    }
  }
  
  toggleCamera() {
    this.facingMode = this.facingMode === 'environment' ? 'user' : 'environment';
    if (this.isScanning) {
      this.stopScanner();
      setTimeout(() => this.startScanner(), 500);
    }
  }
  
  switchCamera(deviceId: string) {
    this.selectedCameraId = deviceId;
    if (this.isScanning) {
      this.stopScanner();
      setTimeout(() => this.startScanner(), 500);
    }
  }
  
  retryScan() {
    this.scannerError = null;
    this.scanResult = null;
    this.startScanner();
  }
}