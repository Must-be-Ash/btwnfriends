import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { CameraView, Camera, BarcodeScanningResult } from 'expo-camera';
import { X } from 'lucide-react-native';

interface QRScanResult {
  walletAddress?: string;
  amount?: string;
  message?: string;
  name?: string;
  url?: string;
}

interface QRScannerProps {
  onScanSuccess: (result: QRScanResult) => void;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export function QRScanner({ onScanSuccess, onClose }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [lastScanTime, setLastScanTime] = useState(0);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const parseQRData = (data: string): QRScanResult => {
    console.log('🔍 Parsing QR data:', data);

    try {
      const url = new URL(data);
      const searchParams = url.searchParams;
      const walletAddress = searchParams.get('to') || searchParams.get('address');
      const amount = searchParams.get('amount');
      const message = searchParams.get('message') || searchParams.get('memo');
      const name = searchParams.get('name') || searchParams.get('displayName');

      return {
        walletAddress: walletAddress || undefined,
        amount: amount || undefined,
        message: message || undefined,
        name: name || undefined,
        url: data
      };
    } catch {
      if (data.startsWith('0x') && data.length === 42) {
        return {
          walletAddress: data,
          url: data
        };
      }

      return {
        url: data
      };
    }
  };

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    const now = Date.now();
    // Cooldown: Only process scans if 2 seconds have passed since last scan
    if (now - lastScanTime < 2000) {
      console.log('⏱️ Scan cooldown active, ignoring duplicate scan');
      return;
    }

    console.log('📷 QR Code scanned:', data);
    setLastScanTime(now);

    const parsedData = parseQRData(data);
    onScanSuccess(parsedData);
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Text className="text-white text-center mb-4 text-lg font-semibold">
          Camera Permission Required
        </Text>
        <Text className="text-white/70 text-center mb-6">
          Please enable camera access in your device settings to scan QR codes.
        </Text>
        <TouchableOpacity
          onPress={onClose}
          className="px-6 py-3 bg-white/20 rounded-xl"
        >
          <Text className="text-white font-semibold">Close</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleBarCodeScanned}
      />

      {/* Overlay with scanning frame */}
      <View className="flex-1">
        {/* Top bar with close button */}
        <View className="pt-12 px-4 pb-4 bg-black/50">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-white text-lg font-semibold">Scan QR Code</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-white/20"
            >
              <X size={24} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-white/70 mt-2">
            Position the QR code within the frame
          </Text>
        </View>

        {/* Center scanning frame */}
        <View className="flex-1 items-center justify-center">
          <View
            style={{
              width: width * 0.7,
              height: width * 0.7,
              borderWidth: 2,
              borderColor: 'white',
              borderRadius: 16,
              backgroundColor: 'transparent',
            }}
          >
            {/* Corner indicators */}
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
          </View>
        </View>

        {/* Bottom instruction */}
        <View className="pb-12 px-4 pt-4 bg-black/50">
          <Text className="text-white text-center">
            Scan a payment QR code from Between Friends
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cornerTopLeft: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#3b82f6',
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 30,
    height: 30,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#3b82f6',
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#3b82f6',
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#3b82f6',
    borderBottomRightRadius: 16,
  },
});
