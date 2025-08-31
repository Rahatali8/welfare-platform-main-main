"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Star, Lock, User } from "lucide-react";

export default function SurveyLoginPage() {
  const [cnic, setCnic] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnic, password }),
      });
      if (res.ok) {
        router.push("/survey-dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Login failed");
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-100 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left: VIP Branding */}
        <section className="hidden lg:flex flex-col justify-center gap-6 p-12 rounded-3xl bg-gradient-to-br from-yellow-600 to-amber-400 text-white shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl shadow-lg">
              <ShieldCheck className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold">Survey Team Portal</h2>
              <p className="text-amber-100/90 mt-1">VIP access for verified survey officers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-white/90" />
              <div>
                <div className="font-semibold">Priority Cases</div>
                <div className="text-sm text-amber-100/80">See the newest forwarded requests first</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-white/90" />
              <div>
                <div className="font-semibold">Secure Workflow</div>
                <div className="text-sm text-amber-100/80">SSO-ready and audited actions for traceability</div>
              </div>
            </div>
          </div>

          <p className="text-sm text-white/80 max-w-sm">
            As a member of the Survey Team you get a dedicated, fast workflow to claim and complete surveys. Treat this area with confidentiality.
          </p>
        </section>

        {/* Right: Form */}
        <section className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-3xl p-[1px] bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 shadow-[0_10px_40px_-12px_rgba(250,185,0,0.35)]">
              <Card className="rounded-3xl border border-amber-100 bg-white">
                <CardHeader className="text-center">
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-amber-700" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Survey Team Sign In</CardTitle>
                      <CardDescription className="text-amber-600">VIP access for verified officers</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">CNIC</label>
                      <Input
                        value={cnic}
                        onChange={(e) => setCnic(e.target.value)}
                        placeholder="35202-1234567-1"
                        required
                        className="rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-700 mb-1">Password</label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                        className="rounded-xl"
                      />
                    </div>

                    {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

                    <div className="flex items-center justify-between gap-4">
                      <Button type="submit" className="flex-1 bg-amber-600 hover:bg-amber-700 text-white rounded-xl" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>
                      <Button type="button" variant="outline" className="ml-2" onClick={() => { setCnic(""); setPassword(""); }}>
                        Clear
                      </Button>
                    </div>

                    <p className="text-xs text-gray-500 text-center">By signing in you agree to the organization's security policy.</p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
