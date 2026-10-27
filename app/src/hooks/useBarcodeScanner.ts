import { useCallback, useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

const BARCODE_SCANNER_ELEMENT_ID = "barcode-scanner-reader";

export const useBarcodeScanner = (onScan: (code: string) => void) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  });

  const stop = useCallback(async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;
    try {
      if (scanner.isScanning) {
        await scanner.stop();
      }
    } catch {
      // Scanner déjà arrêté
    }
    scannerRef.current = null;
    setIsScanning(false);
  }, []);

  const start = useCallback(async () => {
    const scanner = new Html5Qrcode(BARCODE_SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;
    setError(null);
    setIsScanning(true);
    await scanner.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        void (async () => {
          await stop();
          onScanRef.current(decodedText);
        })();
      },
      () => {},
    );
  }, [stop]);

  useEffect(() => {
    return () => {
      void stop();
    };
  }, [stop]);

  return { start, stop, isScanning, error };
};
