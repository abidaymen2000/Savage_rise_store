"use client";

export const dynamic = "force-dynamic"; // empêche le prerender

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
        // Lire token depuis l'URL côté client
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
          localStorage.setItem("savage_rise_token", token);
          await refreshUser();

          // Nettoyer l'URL
          params.delete("token");
          const clean = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
          window.history.replaceState({}, "", clean);
        }
      } catch (e) {
        console.error("Erreur vérification :", e);
      } finally {
        // Redirection vers accueil
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
