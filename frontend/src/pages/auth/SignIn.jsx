import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"

function Login() {
  const [user, setUser] = useState({ email: "", password: "" })
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!user.email) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Enter a valid email"
    if (!user.password) newErrors.password = "Password is required"
    else if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    return newErrors
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setIsLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/api/login", user)
      if (res?.data?.token) {
        localStorage.setItem("authToken", res.data.token)
      }
      navigate('/')
    } catch (error) {
      setErrors({ api: error.response?.data?.detail || error.response?.data?.message || "Login failed. Please check your credentials." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 font-['Sora'] relative overflow-hidden flex flex-col">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-nyaya-500/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-600/20 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-5 relative z-10">
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-xl font-bold text-slate-50">Nyaya<span className="text-nyaya-500">Vanni</span></span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-400 text-sm font-medium hover:text-slate-200 transition-colors">Hire a Lawyer</a>
          <a href="/signUp" className="px-5 py-2 rounded-lg border border-nyaya-500/30 text-nyaya-500 text-sm font-semibold hover:bg-nyaya-500/5 transition-all">Sign Up</a>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center gap-20 px-12 py-10 relative z-5 animate-fadeIn">
        {/* Left panel */}
        <div className="flex-1 max-w-md">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-400/25 bg-cyan-400/7 text-teal-400 text-xs font-semibold tracking-wide mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-lg shadow-cyan-400/50" />
            Powered by Advanced AI
          </div>
          <h1 className="text-5xl font-black text-slate-50 leading-tight mb-5 tracking-tight">
            Understand Indian Legal<br />
            Documents in <span className="text-teal-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.4)]">Seconds.</span>
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed mb-8 font-['DM_Sans']">
            Upload any notice, contract, or FIR. NyayaVanni decodes complex legal jargon, detects risks, and explains your rights in simple terms.
          </p>
          <div className="space-y-3.5">
            {[
              { icon: "📄", text: "Instant document analysis" },
              { icon: "⚖️", text: "Know your legal rights" },
              { icon: "🔒", text: "Bank-grade encryption" },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center bg-cyan-400/10 border border-cyan-400/20 rounded-lg text-lg flex-shrink-0">{f.icon}</div>
                <span className="text-slate-400 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — Sign In card */}
        <div className="w-96 flex-shrink-0">
          <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-9 overflow-hidden shadow-lg border border-slate-700/50">
            {/* Card glow */}
            <div className="absolute -top-20 -right-20 w-48 h-48 bg-gradient-radial from-nyaya-500/8 to-transparent rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl font-bold text-slate-50 mb-1.5 tracking-tight">Welcome back</h2>
            <p className="text-xs text-slate-600 mb-7 font-['DM_Sans']">Sign in to your NyayaVanni account</p>

            {/* Social logins */}
            <button className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-white/8 bg-white/4 hover:bg-nyaya-500/7 hover:border-nyaya-500/40 text-slate-300 text-sm font-medium transition-all duration-200 mb-6">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-white/6" />
              <span className="text-xs text-slate-500 font-medium tracking-wide">or continue with email</span>
              <div className="flex-1 h-px bg-white/6" />
            </div>

            {/* API error */}
            {errors.api && (
              <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-xs mb-5 font-['DM_Sans']">
                <span>⚠️</span>{errors.api}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 flex items-center pointer-events-none">
                    <MailIcon active={focusedField === "email"} />
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={user.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-['DM_Sans'] text-slate-200 placeholder-slate-600/50 outline-none transition-all duration-200 border ${
                      focusedField === "email" 
                        ? "border-nyaya-500/40 bg-nyaya-500/4 shadow-[0_0_0_3px_rgba(20,184,166,0.07)]" 
                        : errors.email
                        ? "border-red-500/40 bg-red-500/4 shadow-[0_0_0_3px_rgba(239,68,68,0.07)]"
                        : "border-white/7 bg-white/3"
                    }`}
                  />
                </div>
                {errors.email && <span className="text-xs text-red-400 font-['DM_Sans']">{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
                  <a href="/forgot-password" className="text-xs text-nyaya-500 hover:opacity-70 font-medium transition-opacity">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 flex items-center pointer-events-none">
                    <LockIcon active={focusedField === "password"} />
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={user.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm font-['DM_Sans'] text-slate-200 placeholder-slate-600/50 outline-none transition-all duration-200 border ${
                      focusedField === "password"
                        ? "border-nyaya-500/40 bg-nyaya-500/4 shadow-[0_0_0_3px_rgba(20,184,166,0.07)]"
                        : errors.password
                        ? "border-red-500/40 bg-red-500/4 shadow-[0_0_0_3px_rgba(239,68,68,0.07)]"
                        : "border-white/7 bg-white/3"
                    }`}
                  />
                </div>
                {errors.password && <span className="text-xs text-red-400 font-['DM_Sans']">{errors.password}</span>}
              </div>

              {/* Remember me */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <div
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4.5 h-4.5 rounded-sm border flex items-center justify-center flex-shrink-0 transition-all duration-150 ${
                    rememberMe 
                      ? "bg-nyaya-500 border-nyaya-500" 
                      : "border-white/12 bg-white/3"
                  }`}
                >
                  {rememberMe && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span className="text-sm text-slate-600 font-['DM_Sans']">Remember me for 30 days</span>
              </label>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-nyaya-500 hover:bg-nyaya-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-nyaya-500/25 hover:shadow-lg hover:shadow-nyaya-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 mt-2 hover:enabled:-translate-y-0.5"
              >
                {isLoading ? (
                  <span className="w-4.5 h-4.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-600 mt-5 font-['DM_Sans']">
              Don't have an account?{" "}
              <a href="/signUp" className="text-nyaya-500 font-semibold hover:opacity-80 transition-opacity">Create one free →</a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&display=swap');

        @keyframes blobFloat1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes blobFloat2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-25px, 15px) scale(0.95); }
        }
        @keyframes blobFloat3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(15px, 25px) scale(1.08); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out both;
        }

        input::placeholder {
          color: rgba(148, 163, 184, 0.5);
        }
        input::-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px rgba(15, 23, 42, 0.8) inset !important;
          -webkit-text-fill-color: #e2e8f0 !important;
        }

        @supports (-webkit-backdrop-filter: blur(20px)) {
          body {
            -webkit-backdrop-filter: blur(20px);
          }
        }
      `}</style>
    </div>
  )
}

// ---- Sub-components ----

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function MailIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={active ? "#14b8a6" : "#475569"} strokeWidth="1.8"/>
      <path d="M22 6l-10 7L2 6" stroke={active ? "#14b8a6" : "#475569"} strokeWidth="1.8"/>
    </svg>
  )
}

function LockIcon({ active }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke={active ? "#14b8a6" : "#475569"} strokeWidth="1.8"/>
      <path d="M7 11V7a5 5 0 0110 0v4" stroke={active ? "#14b8a6" : "#475569"} strokeWidth="1.8"/>
    </svg>
  )
}

export default Login