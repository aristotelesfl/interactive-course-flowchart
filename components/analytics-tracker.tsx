"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { registrarPageView } from "@/lib/firebase";

function RastreadorDeRota() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    registrarPageView(
      query ? `${pathname}?${query}` : pathname,
      document.title
    );
    // searchParams muda de identidade a cada navegação; a string é o
    // que realmente importa para disparar de novo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams.toString()]);

  return null;
}

/**
 * Registra um page_view no Firebase Analytics a cada navegação
 * client-side (troca de rota ou de query params). Sem
 * NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID configurada, registrarPageView()
 * é um no-op.
 */
export function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <RastreadorDeRota />
    </Suspense>
  );
}
