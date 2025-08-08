"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function VerifySuccess() {
  const sp = useSearchParams();
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const t = sp.get("token");
    if (t) {
      // 1) Stocker le token
      localStorage.setItem("savage_rise_token", t);

      // 2) Rafraîchir l'utilisateur
      refreshUser();
    }

    // 3) Rediriger vers la page d'accueil après 1 seconde
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1000);

    return () => clearTimeout(timer);
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
