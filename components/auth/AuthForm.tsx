"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Mail, User, Eye, EyeOff } from "lucide-react";
import { Form, TextInput, Label, Button } from '@/ui';
import { supabase } from "@/lib/supabase";

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
    <div className="min-h-screen flex justify-center items-center px-4 py-8">
      <div className="max-w-xl lg:min-w-md bg-white border-gray-200 font-semibold shadow-sm p-6 sm:px-8 sm:py-10 rounded-2xl">

        <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-semibold bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">Sellora</h1>
        </div>

        <div className="relative flex justify-evenly items-center w-full rounded-full bg-gray-200 p-1 mb-4">

          {/* Sliding pill — sits behind buttons */}
          <div
            className={`absolute top-1 bottom-1 w-[cal(50%-4px)] rounded-md shadow transition-all duration-300 ${
              activeTab === "login" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
            }`}
          />

          {/* Buttons sit side by side, on top of the pill */}
          <button
            type="button"
            onClick={() => handleTabSwitch("signup")}
            className={`relative z-10 w-1/2 py-1.5 text-base font-medium rounded-full cursor-pointer transition-colors duration-300 ${
              activeTab === "signup" ? "text-gray-900 bg-gray-50" : "text-gray-400"
            }`}
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => handleTabSwitch("login")}
            className={`relative z-10 w-1/2 py-1.5 text-base font-medium rounded-full cursor-pointer transition-colors duration-300 ${
              activeTab === "login" ? "text-gray-900 bg-gray-50" : "text-gray-400"
            }`}
          >
            Log In
          </button>
        </div>

        {/* Sign Up section */}
        {activeTab === "signup" && (
          <Form
            onSubmit={handleSignup} 
            variant="light"
            className='animate-slide-in duration-300 border-none shadow-none'
          >
            
            <div className="space-y-1 mb-6 flex flex-col items-center">
              <h1 className="text-gray-800 text-lg md:text-xl">Start selling in minutes</h1>

              <p className="text-gray-700 text-md font-light">Create your free account and set up your store today.</p>
            </div>

            <div className="relative">
              <Label 
                htmlFor="username" 
                variant="light"
              >
                Username <span className="text-sm text-gray-400">(optional)</span>
              </Label>

              <TextInput
                id='username'
                name="username"
                value={signupData.username}
                onChange={(e) => handleChange(e, "signup")}
                placeholder='Enter your username'
                radius="medium"
                variant="light"
                className="pl-10"
                required
              />

              <User className="absolute left-3 top-10 text-gray-700" size={18} />
            </div>

            <div className="relative">
              <Label htmlFor="email" variant="light">
                Email <span className="text-sm text-gray-400">(required)</span>
              </Label>
              <TextInput
                id='email'
                name="email"
                value={signupData.email}
                onChange={(e) => handleChange(e, "signup")}
                placeholder='youremail@gmail.com'
                type='email'
                radius="medium"
                variant="light"
                className="pl-10"
                required
              />

              <Mail className="absolute left-3 top-10 text-gray-700" size={18} />
            </div>

            <div className="relative">
              <Label
                htmlFor="password"
                variant="light"
              >
                Password <span className="text-sm text-gray-400">(required)</span>
              </Label>
              <TextInput
                id='password'
                name="password"
                value={signupData.password}
                onChange={(e) => handleChange(e, "signup")}
                placeholder='8+ characters'
                type={showSignupPassword ? 'text' : 'password'}
                radius="medium"
                variant="light"
                required
              />

              <button
                type="button"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                className="absolute right-3 top-9.5 cursor-pointer text-gray-700"
              >
                {showSignupPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
            {signupSuccess &&
              <p style={{ color: 'green' }}>Signup successful! Please check your email to confirm your account.</p>
            }

            <Button 
              type='submit' 
              variant="gradient"
              disabled={loading}
              className='w-full rounded-full mt-4 bg-primary-500'
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form>
        )}

        {/* Login section */}
        {activeTab === 'login' && (
          <Form
            onSubmit={handleLogin} 
            variant="light"
            className='animate-slide-in duration-300 border-none shadow-none'
          >
            <div className="space-y-1 mb-6 flex flex-col items-center">
              <h1 className="text-gray-800 text-lg md:text-xl">Welcome Back</h1>
              <p className="text-gray-700 text-md font-light">
                Log in to manage your store and track your business.
              </p>
            </div>
          
            <div className="relative">
              <Label 
                htmlFor="email" 
                variant="light"
              >
                Email <span className="text-sm text-gray-400">(required)</span>
              </Label>
              <TextInput
                id='email'
                name="email"
                value={loginData.email}
                onChange={(e) => handleChange(e, "login")}
                placeholder='youremail@gmail.com'
                type='email'
                radius="medium"
                variant="light"
                className="pl-10"
                required
              />

              <Mail className="absolute left-3 top-10 text-gray-700" size={18} />
            </div>

            <div className="relative">
              <Label
                htmlFor="password"
                variant="light"
              >
                Password <span className="text-sm text-gray-400">(required)</span>
              </Label>
              <TextInput
                id='password'
                name="password"
                value={loginData.password}
                onChange={(e) => handleChange(e, "login")}
                placeholder='8+ characters'
                type={showLoginPassword ? 'text' : 'password'}
                radius="medium"
                variant="light"
                required
              />

              <button
                type="button"
                onClick={() => setShowLoginPassword(!showLoginPassword)}
                className="absolute right-3 top-9.5 cursor-pointer text-gray-700"
              >
                {showLoginPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>

            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}

            <Button 
              type='submit'
              variant="gradient" 
              disabled={loading}
              className='w-full rounded-full mt-4'
            >
              {loading ? 'Loging in...' : 'Log In'}
            </Button>
          </Form>
        )}
  
      </div>
    
    </div>
  )
}