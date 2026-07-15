import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import {
  getAnalytics,
  isSupported as analyticsIsSupported,
  logEvent,
  type Analytics,
} from "firebase/analytics";
import { getFirestore, type Firestore } from "firebase/firestore";

declare global {
  interface Window {
    FIREBASE_APPCHECK_DEBUG_TOKEN?: boolean | string;
  }
}

/**
 * Config do app web do Firebase, vinda de variáveis de ambiente
 * (.env.local no dev, GitHub Secrets no deploy — ver .env.example).
 *
 * Atenção: esses valores NÃO são secretos. Como o app é um export
 * estático, o Next.js os inlina no bundle do cliente no build e eles
 * ficam visíveis no navegador de qualquer forma. Mantê-los em env
 * apenas os tira do controle de versão — a segurança de verdade vem
 * das security rules do Firestore (firestore.rules) e do App Check.
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
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
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

// Site key pública do reCAPTCHA v3 (não é secreta — é feita pra ir no
// cliente). O App Check é quem garante que só o app de verdade consegue
// gerar um token válido com ela.
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

let appCheckInicializado = false;

function getFirebaseApp(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
}

/**
 * Inicializa o Firebase App Check: impede que chamadas ao Firestore
 * feitas fora do app de verdade (scripts batendo direto na API REST,
 * como fizemos em testes) sejam aceitas — as security rules sozinhas só
 * validam o formato dos dados, não se a chamada veio do navegador
 * rodando este app.
 *
 * Chame uma única vez, o quanto antes (ver components/query-provider.tsx).
 * Sem NEXT_PUBLIC_RECAPTCHA_SITE_KEY configurada, é um no-op — o app
 * segue funcionando normalmente, só sem essa camada extra de proteção.
 */
export function inicializarAppCheck(): void {
  if (
    appCheckInicializado ||
    typeof window === "undefined" ||
    !recaptchaSiteKey
  ) {
    return;
  }
  appCheckInicializado = true;

  // reCAPTCHA v3 não valida em localhost: gera um token de depuração
  // fixo por navegador, que precisa ser cadastrado em Firebase Console
  // > App Check > Apps > gerenciar tokens de depuração.
  if (process.env.NODE_ENV !== "production") {
    window.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  }

  initializeAppCheck(getFirebaseApp(), {
    provider: new ReCaptchaV3Provider(recaptchaSiteKey),
    isTokenAutoRefreshEnabled: true,
  });
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Inicializa o Firebase Analytics (Google Analytics) uma única vez, só
 * no navegador — chamadas concorrentes (comum em dev com Strict Mode)
 * compartilham a mesma promise em vez de descartar a segunda. O SDK não
 * envia page_view sozinho ao navegar entre rotas client-side (isso é
 * comportamento do gtag.js clássico, não deste SDK) — cada mudança de
 * rota chama registrarPageView() explicitamente (ver
 * components/analytics-tracker.tsx).
 *
 * Sem NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID configurada, é um no-op.
 */
function garantirAnalytics(): Promise<Analytics | null> {
  if (!analyticsPromise) {
    analyticsPromise =
      typeof window === "undefined" || !firebaseConfig.measurementId
        ? Promise.resolve(null)
        : analyticsIsSupported().then((suportado) =>
            suportado ? getAnalytics(getFirebaseApp()) : null
          );
  }
  return analyticsPromise;
}

/** Registra uma visualização de página (chamado a cada troca de rota). */
export async function registrarPageView(
  caminho: string,
  titulo?: string
): Promise<void> {
  const instancia = await garantirAnalytics();
  if (!instancia) return;
  logEvent(instancia, "page_view", {
    page_path: caminho,
    page_title: titulo,
    page_location: window.location.href,
  });
}
