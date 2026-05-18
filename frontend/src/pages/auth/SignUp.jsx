import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"

function Register() {
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [agreed, setAgreed] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" })
  }

  const validate = () => {
    const newErrors = {}
    if (!user.name.trim()) newErrors.name = "Full name is required"
    if (!user.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(user.email)) newErrors.email = "Invalid email address"
    if (!user.password) newErrors.password = "Password is required"
    else if (user.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (!user.confirmPassword) newErrors.confirmPassword = "Please confirm your password"
    else if (user.password !== user.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!agreed) newErrors.agreed = "You must accept the terms"
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:8000/api/register", {
        name: user.name,
        email: user.email,
        password: user.password,
      })
      navigate('/signIn')
    } catch (error) {
      alert(error.response?.data?.detail || error.response?.data?.message || "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 flex flex-col relative overflow-hidden">

      {/* Background glow blobs */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-teal-500 opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-400 opacity-10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-teal-700 opacity-5 rounded-full blur-2xl pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          {/* Shield icon */}
          <svg className="w-8 h-8 text-teal-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white font-bold text-xl tracking-tight">
            Nyaya<span className="text-teal-400">Vanni</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200">
            Hire a Lawyer
          </a>
          <a
            href="/signIn"
            className="text-sm font-semibold text-teal-400 border border-teal-400 px-5 py-2 rounded-md hover:bg-teal-400 hover:text-slate-900 transition-all duration-200"
          >
            Sign In
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 w-full max-w-6xl">

          {/* Left hero */}
          <div className="hidden lg:flex flex-col gap-6 flex-1 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium px-4 py-2 rounded-full w-fit">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
              Powered by Advanced AI
            </div>
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Understand Indian Legal Documents in{" "}
              <span className="text-teal-400">Seconds.</span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed">
              Upload any notice, contract, or FIR. NyayaVanni decodes complex legal jargon, detects risks, and explains your rights in simple terms.
            </p>
            <div className="flex flex-col gap-4 mt-2">
              {[
                { icon: "📄", label: "Instant document analysis" },
                { icon: "⚖️", label: "Know your legal rights" },
                { icon: "🔒", label: "Bank-grade encryption" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-lg shadow-inner">
                    {icon}
                  </div>
                  <span className="text-slate-300 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Sign Up Card */}
          <div className="w-full max-w-md">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-black/40 p-8">

              <div className="mb-7">
                <h2 className="text-2xl font-bold text-white mb-1">Create your account</h2>
                <p className="text-slate-400 text-sm">Join NyayaVanni and understand your rights today</p>
              </div>

              {/* Google Button */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/60 text-white font-medium py-3 rounded-xl transition-all duration-200 mb-4 group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-slate-700/60" />
                <span className="text-slate-500 text-xs">or continue with email</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className={`flex items-center gap-3 bg-slate-800/60 border rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-teal-500/60 focus-within:bg-slate-800/80 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.08)] ${errors.name ? "border-red-500/60" : "border-slate-700/50"}`}>
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      placeholder="your name"
                      className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* Username (optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Username <span className="text-slate-600 normal-case font-normal">(optional)</span>
                  </label>
                  <div className="flex items-center gap-3 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-teal-500/60 focus-within:bg-slate-800/80 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.08)]">
                    <span className="text-slate-500 text-sm shrink-0">@</span>
                    <input
                      type="text"
                      name="username"
                      value={user.username}
                      onChange={handleChange}
                      placeholder="@username"
                      className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className={`flex items-center gap-3 bg-slate-800/60 border rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-teal-500/60 focus-within:bg-slate-800/80 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.08)] ${errors.email ? "border-red-500/60" : "border-slate-700/50"}`}>
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className={`flex items-center gap-3 bg-slate-800/60 border rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-teal-500/60 focus-within:bg-slate-800/80 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.08)] ${errors.password ? "border-red-500/60" : "border-slate-700/50"}`}>
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className={`flex items-center gap-3 bg-slate-800/60 border rounded-xl px-4 py-3 transition-all duration-200 focus-within:border-teal-500/60 focus-within:bg-slate-800/80 focus-within:shadow-[0_0_0_3px_rgba(20,184,166,0.08)] ${errors.confirmPassword ? "border-red-500/60" : user.confirmPassword && user.password === user.confirmPassword ? "border-teal-500/50" : "border-slate-700/50"}`}>
                    <svg className="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <input
                      type={showConfirm ? "text" : "password"}
                      name="confirmPassword"
                      value={user.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="flex-1 bg-transparent text-white placeholder-slate-500 text-sm outline-none"
                    />
                    {user.confirmPassword && user.password === user.confirmPassword && (
                      <svg className="w-4 h-4 text-teal-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirm ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => {
                          setAgreed(e.target.checked)
                          if (errors.agreed) setErrors({ ...errors, agreed: "" })
                        }}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${agreed ? "bg-teal-500 border-teal-500" : "bg-slate-800 border-slate-600 group-hover:border-slate-500"}`}>
                        {agreed && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-slate-400 text-sm leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors">Terms of Service</a>{" "}
                      and{" "}
                      <a href="#" className="text-teal-400 hover:text-teal-300 underline underline-offset-2 transition-colors">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agreed && <p className="text-red-400 text-xs mt-1 ml-7">{errors.agreed}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full relative overflow-hidden bg-teal-500 hover:bg-teal-400 disabled:bg-teal-700 disabled:cursor-not-allowed text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-200 hover:shadow-[0_0_24px_rgba(20,184,166,0.4)] active:scale-[0.98] mt-1 text-sm tracking-wide"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Create Account
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>

              </form>

              {/* Sign In link */}
              <p className="text-center text-slate-500 text-sm mt-5">
                Already have an account?{" "}
                <a
                  href="/signIn"
                  className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
                >
                  Sign In →
                </a>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Register