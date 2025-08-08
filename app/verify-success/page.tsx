"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifySuccess() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        // Lire le token sans useSearchParams (évite Suspense)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
          // 1) Stocker le token
          localStorage.setItem("savage_rise_token", token);

          // 2) Rafraîchir l'utilisateur
          await refreshUser();

          // 3) Nettoyer l'URL
          params.delete("token");
          const clean = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
          window.history.replaceState({}, "", clean);
        }
      } catch (e) {
        console.error("verify-success:", e);
      } finally {
        // Redirection immédiate
        router.replace("/");
      }
    })();
  }, [refreshUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-lg mb-2">Vérification réussie ✅</p>
        <p className="text-gray-400">Connexion en cours...</p>
      </div>
    </div>
  );
}
