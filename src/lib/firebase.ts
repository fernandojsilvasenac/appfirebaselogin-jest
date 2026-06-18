import { initializeApp, getApps, getApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
};

const missingFirebaseEnvVars = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseEnvVars.length > 0) {
  console.warn(
    "Firebase config incompleta. Verifique as variaveis EXPO_PUBLIC_* no arquivo .env:",
    missingFirebaseEnvVars
  );
} else {
  console.log("Firebase config carregada:", {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    hasApiKey: Boolean(firebaseConfig.apiKey),
    hasAppId: Boolean(firebaseConfig.appId),
    hasMessagingSenderId: Boolean(firebaseConfig.messagingSenderId)
  });
}

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const getRNPersistence = () => {
  try {
    const rn = require("firebase/auth/react-native");
    return rn.getReactNativePersistence;
  } catch {
    const authModule = require("firebase/auth");
    return authModule.getReactNativePersistence;
  }
};

export const auth = (() => {
  try {
    const getReactNativePersistence = getRNPersistence();
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  } catch {
    return getAuth(app);
  }
})();

export const db = getFirestore(app);

export async function debugFirebaseAuthNetwork() {
  const authUrl = "https://identitytoolkit.googleapis.com";

  try {
    const response = await fetch(authUrl);

    console.log("Teste de rede Firebase Auth:", {
      url: authUrl,
      status: response.status,
      ok: response.ok
    });
  } catch (error: any) {
    console.error("Falha no teste de rede Firebase Auth:", {
      url: authUrl,
      message: error?.message,
      name: error?.name,
      stack: error?.stack
    });
  }
}
