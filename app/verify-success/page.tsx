"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { trackMetaPixelEvent } from "@/lib/meta-pixel";
import { trackStoreEvent } from "@/lib/store-analytics";

export default function VerifySuccess() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("access_token") || params.get("token");

        if (token) {
          localStorage.setItem("savage_rise_token", token);
          await refreshUser();
          trackMetaPixelEvent("CompleteRegistration", {
            content_name: "Verified store account",
            status: true,
          });
          trackStoreEvent("login", {
            metadata: {
              method: "email_verification",
            },
          });

          params.delete("access_token");
          params.delete("token");
          params.delete("token_type");
          params.delete("verified");
          const clean = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
          window.history.replaceState({}, "", clean);
        }
      } catch (e) {
      } finally {
        router.replace("/");
      }
    })();
  }, [refreshUser, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <p className="text-lg mb-2">Verification successful</p>
        <p className="text-gray-400">Signing you in...</p>
      </div>
    </div>
  );
}
