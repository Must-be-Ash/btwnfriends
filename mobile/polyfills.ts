// @ts-ignore - no types available for @ungap/structured-clone
import structuredClone from "@ungap/structured-clone";
import { install } from "react-native-quick-crypto";
import "react-native-get-random-values";

console.log('[Polyfills] Starting polyfill installation...');

try {
  // Install crypto polyfills
  if (!("structuredClone" in globalThis)) {
    console.log('[Polyfills] Installing structuredClone polyfill...');
    globalThis.structuredClone = structuredClone as any;
  } else {
    console.log('[Polyfills] structuredClone already available');
  }

  console.log('[Polyfills] Installing react-native-quick-crypto...');
  install(); // Install react-native-quick-crypto
  console.log('[Polyfills] ✓ All polyfills installed successfully');
} catch (error) {
  console.error('[Polyfills] ERROR installing crypto polyfills:', error);
  console.error('[Polyfills] This may cause CDP initialization to fail');
  console.error('[Polyfills] Error details:', JSON.stringify(error, null, 2));

  // Don't throw - allow app to continue and handle error at CDP level
  // This prevents immediate crash and allows error boundary to catch it
}
