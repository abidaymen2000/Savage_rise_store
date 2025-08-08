"use client";

import { useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifySuccess() {
  const sp = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  // Evite d'exécuter l'effet 2x (React Strict Mode / re-render)
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = sp.get("token");

    (async () => {
      try {
        if (token) {
          // 1) Stocker le token
          localStorage.setItem("savage_rise_token", token);
          // 2) Rafraîchir l'utilisateur
          await refreshUser();
        }
      } catch (e) {
        // silencieux — on redirige quand même
        console.error("verify-success:", e);
      } finally {
        // 3) Redirection (immédiate)
        router.replace("/");
      }
    })();
  }, [sp, refreshUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-lg mb-2">Vérification réussie ✅</p>
        <p className="text-gray-400">Connexion en cours...</p>
      </div>
    </div>
  );
}
