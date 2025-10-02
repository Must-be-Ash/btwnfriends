import structuredClone from "@ungap/structured-clone";
import { install } from "react-native-quick-crypto";
import "react-native-get-random-values";

// Install crypto polyfills
if (!("structuredClone" in globalThis)) {
  globalThis.structuredClone = structuredClone as any;
}

install(); // Install react-native-quick-crypto
