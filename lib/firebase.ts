import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

/**
 * Config do app web do Firebase, vinda de variáveis de ambiente
 * (.env.local no dev, GitHub Secrets no deploy — ver .env.example).
 *
 * Atenção: esses valores NÃO são secretos. Como o app é um export
 * estático, o Next.js os inlina no bundle do cliente no build e eles
 * ficam visíveis no navegador de qualquer forma. Mantê-los em env
 * apenas os tira do controle de versão — a segurança de verdade vem
 * das security rules do Firestore (firestore.rules).
 *
 * Os nomes precisam ser referenciados literalmente (não por acesso
 * dinâmico tipo process.env[chave]) para o Next.js conseguir inliná-los.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Se as variáveis não estiverem definidas, o app funciona só com os
 * JSONs estáticos de public/data (os hooks tratam esse caso).
 */
export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
);

export function getDb(): Firestore {
  const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  return getFirestore(app);
}
