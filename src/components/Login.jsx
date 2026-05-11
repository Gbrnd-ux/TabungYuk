import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  // Tambahkan resetPassword dari destructuring useAuth
  const { login, register, signInWithGoogle, resetPassword } = useAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [error, setError] = useState("");
  
  // State baru untuk fitur lupa password dan pesan sukses
  const [isResetting, setIsResetting] = useState(false);
  const [message, setMessage] = useState("");
  
  const [loadingType, setLoadingType] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage(""); // Hapus pesan sukses sebelumnya (jika ada)
    setLoadingType("form");
    try {
      if (isNew) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err) {
      const msg = err.message
        .replace("Firebase: ", "")
        .replace(/\(auth\/.*\)/, "");
      setError(msg || "Terjadi kesalahan.");
    } finally {
      setLoadingType(null);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setMessage("");
    setLoadingType("google");
    try {
      await signInWithGoogle();
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
        setError("Gagal masuk dengan Google.");
      }
    } finally {
      setLoadingType(null);
    }
  };

  // Fungsi baru untuk menangani reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoadingType("reset");
    try {
      await resetPassword(email);
      setMessage("Tautan reset password telah dikirim! Silakan periksa kotak masuk atau folder spam email kamu.");
    } catch (err) {
      const msg = err.message
        .replace("Firebase: ", "")
        .replace(/\(auth\/.*\)/, "");
      setError(msg || "Gagal mengirim email reset password. Pastikan email benar.");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 m-0 p-0">
      {/* Kolom Kiri (Branding) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-center items-center p-12 text-white">
        <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur flex items-center justify-center mb-8 shadow-2xl">
          <span className="text-7xl">💰</span>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">TabungYuk</h1>
        <p className="text-xl max-w-md text-center text-white/80 leading-relaxed">
          Kelola keuanganmu dengan mudah, real-time, dan aman. Mulai perjalanan finansialmu sekarang!
        </p>
        <div className="mt-12 flex gap-4">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
          <div className="w-3 h-3 rounded-full bg-white animate-pulse delay-100" />
          <div className="w-3 h-3 rounded-full bg-white animate-pulse delay-200" />
        </div>
      </div>

      {/* Kolom Kanan (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-lg bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10">
          
          <div className="md:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/30 backdrop-blur mb-3">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white">TabungYuk</h2>
          </div>

          <h3 className="text-2xl font-bold text-white mb-6 text-center md:text-left">
            {isResetting ? "Reset Password" : isNew ? "Daftar Akun" : "Masuk ke Akun"}
          </h3>

          {/* Menampilkan Pesan Error */}
          {error && (
            <div className="bg-red-100/90 text-red-700 px-4 py-3 rounded-xl text-sm animate-shake mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Menampilkan Pesan Sukses untuk Reset Password */}
          {message && (
            <div className="bg-green-100/90 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
              ✅ {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={isResetting ? handleResetPassword : handleSubmit} className="space-y-5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">✉️</span>
              <input
                type="email"
                placeholder="Alamat Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-500 text-gray-800"
                required
                disabled={loadingType !== null}
              />
            </div>
            
            {/* Kolom Password disembunyikan jika sedang mode Reset Password */}
            {!isResetting && (
              <div className="relative space-y-2">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔒</span>
                  <input
                    type="password"
                    placeholder="Password (min. 6 karakter)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/80 rounded-xl border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/60 placeholder-gray-500 text-gray-800"
                    required
                    disabled={loadingType !== null}
                  />
                </div>
                
                {/* Tautan Lupa Password (Hanya muncul saat Login) */}
                {!isNew && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetting(true);
                        setError("");
                        setMessage("");
                      }}
                      className="text-sm text-white/80 hover:text-white underline transition"
                      disabled={loadingType !== null}
                    >
                      Lupa Password?
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loadingType !== null}
              className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loadingType !== null && loadingType !== "google" && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
              )}
              {isResetting 
                ? (loadingType === "reset" ? "Mengirim Email..." : "Kirim Link Reset")
                : (loadingType === "form" ? "Memproses..." : isNew ? "Daftar Sekarang" : "Masuk")}
            </button>
          </form>

          {/* Tombol "Kembali ke Login" jika sedang mode Reset Password */}
          {isResetting ? (
            <p className="mt-6 text-center text-white/90 text-sm">
              Sudah ingat passwordnya?{" "}
              <button
                onClick={() => { setIsResetting(false); setError(""); setMessage(""); }}
                className="font-bold underline hover:text-white transition"
                disabled={loadingType !== null}
              >
                Kembali untuk Masuk
              </button>
            </p>
          ) : (
            <>
              {/* Pembatas dan Login Google disembunyikan saat mode Reset Password */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/40" />
                <span className="px-4 text-white/70 text-sm">atau</span>
                <div className="flex-1 border-t border-white/40" />
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loadingType !== null}
                className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 py-3 rounded-xl shadow-md hover:bg-gray-50 transition disabled:opacity-50"
              >
                {loadingType === "google" ? (
                  <svg className="animate-spin h-5 w-5 text-gray-700" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span className="font-medium">
                  {loadingType === "google" ? "Membuka Google..." : "Lanjutkan dengan Google"}
                </span>
              </button>

              <p className="mt-6 text-center text-white/90 text-sm">
                {isNew ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
                <button
                  onClick={() => { setIsNew(!isNew); setError(""); setMessage(""); }}
                  className="font-bold underline hover:text-white transition"
                  disabled={loadingType !== null}
                >
                  {isNew ? "Masuk" : "Daftar"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}