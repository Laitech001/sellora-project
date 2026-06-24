"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Mail, User, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { Form, TextInput, Label, Button } from '@/ui';
import { supabase } from "@/lib/supabase";
import { BrandLogoName } from "@/ui/Brand";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default function Authform() {
  const router = useRouter();
  const [signupError, setSignupError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"signup" | "login">("signup");
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // handle input change
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  formType: "signup" | "login"
  ) => {
    const { name, value } = e.target;

    if (formType === "signup") {
      setSignupData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setLoginData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // handle auth form submition
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const email = signupData.email
    const password = signupData.password
    const username = signupData.username

    try {
        if (!signupData.email || !signupData.password || !signupData.username) {
        setLoading(false);
        return alert('Please fill all the field');
      }
      console.log(signupData);

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          },

          emailRedirectTo: `${baseUrl}/signup`
        }
      });

      if (signUpError) {
        setSignupError(signUpError.message);
        return;
      }

      if (data) {
        setSignupSuccess(true);
        setSignupError(null);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSignupData({
        username: '',
        email: '',
        password: ''
      })
    } 
  }

  //handle Login form submition
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!loginData.email || !loginData.password) {
        setLoading(false);
        return alert('Please fill all the field')
      }

      const { data, error: loginError} = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      })

      console.log(data);

      if (loginError) {
        setLoginError(loginError.message);
        console.log(loginError.message);
        return;
      }

      if (data.user && data.session) {
        console.log('about to redirect');
        router.push('/dashboard');
        router.refresh();
      } else {
        console.log('no user and session')
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoginData({
        email: '',
        password: ''
      })
    }
  }

  // clear error when user switch between tabs
  const handleTabSwitch = (tab: "signup" | "login") => {
    setActiveTab(tab);
    setSignupError(null);
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col">

      {/* Mobile-only intro gives context above the form on small screens */}
      <div className="lg:hidden px-6 pt-10 pb-2 text-center">
        <div className="inline-flex items-center gap-1.5 bg-[rgba(124,58,237,0.15)] text-primary-300 border border-[rgba(124,58,237,0.28)] rounded-full px-3 py-1 text-[11px] font-medium mb-4">
          <Sparkles size={12} />
          Free to start. No card required
        </div>
        <h2 className="text-xl font-bold font-display text-white leading-snug mb-2">
          Take control of your<br />business online
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed max-w-xs mx-auto">
          Create your store, manage products, and track orders. All from one dashboard.
        </p>
      </div>

      <div className="flex-1 flex justify-center items-center px-4 sm:py-8">
        <div className="w-full max-w-md bg-card border border-border-soft font-semibold shadow-xl shadow-black/20 p-6 sm:px-8 sm:py-10 rounded-2xl">

          <div className="flex justify-center items-center mb-6">
            <BrandLogoName />
          </div>

          <div className="relative flex items-center w-full rounded-full bg-circle-background p-1 mb-6">

            {/* Sliding pill — sits behind buttons */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-linear-to-r from-primary-600 to-accent-600 shadow-md transition-transform duration-300 ${
                activeTab === "login" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
              }`}
            />

            {/* Buttons sit side by side, on top of the pill */}
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300 ${
                activeTab === "signup" ? "text-white" : "text-text-secondary"
              }`}
            >
              Sign Up
            </button>

            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className={`relative z-10 w-1/2 py-2 text-sm font-medium rounded-full cursor-pointer transition-colors duration-300 ${
                activeTab === "login" ? "text-white" : "text-text-secondary"
              }`}
            >
              Log In
            </button>
          </div>

          {/* Sign Up section */}
          {activeTab === "signup" && (
            <Form
              onSubmit={handleSignup} 
              className='animate-slide-in duration-300 border-none shadow-none space-y-4'
            >
              
              <div className="space-y-1 mb-2 flex flex-col items-center text-center">
                <h1 className="text-content text-lg md:text-xl font-semibold font-display">Start selling in minutes</h1>

                <p className="text-text-secondary text-sm font-normal">Create your free account and set up your store today.</p>
              </div>

              <div className="relative">
                <Label 
                  htmlFor="username"
                  className="text-content text-sm font-medium mb-1.5 block"
                >
                  Username <span className="text-xs text-text-secondary font-normal">(optional)</span>
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-2.5  text-text-secondary pointer-events-none" size={17} />
                  <TextInput
                    id='username'
                    name="username"
                    value={signupData.username}
                    onChange={(e) => handleChange(e, "signup")}
                    placeholder='Enter your username'
                    radius="medium"
                    className="pl-10 bg-circle-background border-border-soft text-content placeholder:text-text-secondary/60 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="email" className="text-content text-sm font-medium mb-1.5 block">
                  Email <span className="text-xs text-text-secondary font-normal">(required)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-text-secondary pointer-events-none" size={17} />
                  <TextInput
                    id='email'
                    name="email"
                    value={signupData.email}
                    onChange={(e) => handleChange(e, "signup")}
                    placeholder='youremail@gmail.com'
                    type='email'
                    radius="medium"
                    className="pl-10 bg-circle-background border-border-soft text-content placeholder:text-text-secondary/60 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Label
                  htmlFor="password"
                  className="text-content text-sm font-medium mb-1.5 block"
                >
                  Password <span className="text-xs text-text-secondary font-normal">(required)</span>
                </Label>
                <div className="relative">
                  <TextInput
                    id='password'
                    name="password"
                    value={signupData.password}
                    onChange={(e) => handleChange(e, "signup")}
                    placeholder='8+ characters'
                    type={showSignupPassword ? 'text' : 'password'}
                    radius="medium"
                    className="pr-10 bg-circle-background border-border-soft text-content placeholder:text-text-secondary/60 focus:border-primary-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3 top-2.5 cursor-pointer text-text-secondary hover:text-content transition-colors"
                  >
                    {showSignupPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {signupError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {signupError}
                </p>
              )}
              {signupSuccess && (
                <p className="text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                  Signup successful! Please check your email to confirm your account.
                </p>
              )}

              <Button 
                type='submit' 
                variant="gradient"
                disabled={loading}
                className='w-full rounded-full mt-2 bg-linear-to-r from-primary-600 to-accent-600 text-white font-medium py-2.5 hover:opacity-90 active:scale-[0.98] transition-all duration-200'
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mt-3">
                <ShieldCheck size={13} className="text-primary-400" />
                Your data is encrypted and secure
              </p>
            </Form>
          )}

          {/* Login section */}
          {activeTab === 'login' && (
            <Form
              onSubmit={handleLogin} 
              className='animate-slide-in duration-300 border-none shadow-none space-y-4'
            >
              <div className="space-y-1 mb-2 flex flex-col items-center text-center">
                <h1 className="text-content text-lg md:text-xl font-semibold font-display">Welcome Back</h1>
                <p className="text-text-secondary text-sm font-normal">
                  Log in to manage your store and track your business.
                </p>
              </div>
            
              <div className="relative">
                <Label 
                  htmlFor="login-email"
                  className="text-content text-sm font-medium mb-1.5 block"
                >
                  Email <span className="text-xs text-text-secondary font-normal">(required)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-text-secondary pointer-events-none" size={17} />
                  <TextInput
                    id='login-email'
                    name="email"
                    value={loginData.email}
                    onChange={(e) => handleChange(e, "login")}
                    placeholder='youremail@gmail.com'
                    type='email'
                    radius="medium"
                    className="pl-10 bg-circle-background border-border-soft text-content placeholder:text-text-secondary/60 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Label
                  htmlFor="login-password"
                  className="text-content text-sm font-medium mb-1.5 block"
                >
                  Password <span className="text-xs text-text-secondary font-normal">(required)</span>
                </Label>
                <div className="relative">
                  <TextInput
                    id='login-password'
                    name="password"
                    value={loginData.password}
                    onChange={(e) => handleChange(e, "login")}
                    placeholder='8+ characters'
                    type={showLoginPassword ? 'text' : 'password'}
                    radius="medium"
                    className="pr-10 bg-circle-background border-border-soft text-content placeholder:text-text-secondary/60 focus:border-primary-500"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-2.5 cursor-pointer text-text-secondary hover:text-content transition-colors"
                  >
                    {showLoginPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {loginError}
                </p>
              )}

              <Button 
                type='submit'
                variant="gradient" 
                disabled={loading}
                className='w-full rounded-full mt-2 bg-linear-to-r from-primary-600 to-accent-600 text-white font-medium py-2.5 hover:opacity-90 active:scale-[0.98] transition-all duration-200'
              >
                {loading ? 'Loging in...' : 'Log In'}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-text-secondary mt-3">
                <ShieldCheck size={13} className="text-primary-400" />
                Built with security and reliability at its core.
              </p>
            </Form>
          )}
    
        </div>
      </div>
    </div>
  )
}