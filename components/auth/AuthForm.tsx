"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from "lucide-react";
import { Form, TextInput, Label, Button } from '@/ui';
import { supabase } from "@/lib/supabase";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export default function Authform() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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
        setError(signUpError.message);
        return;
      }

      if (data) {
        setSuccess(true);
        setError(null);
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
        setError(loginError.message);
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

  return (
    <div  className="min-h-screen flex justify-center items-center">
      <div className="border bg-linear-to-r from-blue-500 via-cyan-400 to-blue-500 bg-clip-border font-semibold shadow-sm p-3 rounded-md">
        <div className="text-center mb-4">
          <h1 className="text-xl md:text-2xl font-semibold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">Sellora</h1>
        </div>

        <div className="relative flex justify-evenly items-center w-70 rounded-full bg-gray-200 p-1 mb-4">

          {/* Sliding pill — sits behind buttons */}
          <div
            className={`absolute top-1 bottom-1 w-[cal(50%-4px)] rounded-md shadow transition-all duration-300 ${
              activeTab === "login" ? "translate-x-[calc(100%+4px)]" : "translate-x-0"
            }`}
          />

          {/* Buttons sit side by side, on top of the pill */}
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`relative z-10 w-1/2 py-1.5 text-base font-medium rounded-full transition-colors duration-300 ${
              activeTab === "signup" ? "text-gray-900 bg-gray-50" : "text-gray-400"
            }`}
          >
            Sign Up
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`relative z-10 w-1/2 py-1.5 text-base font-medium rounded-full transition-colors duration-300 ${
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
            className='animate-slide-in duration-300'
          >
            
            <div className="mb-4">
              <h1 className="text-gray-800 text-lg md:text-xl">Welcome to Sellora</h1>

              <p>Sign Up to set up your own store</p>
            </div>

            <div className="flex flex-col justify-center">
              <Label htmlFor="username" className="text-base text-gray-300">Username</Label>
              <TextInput
                id='username'
                name="username"
                value={signupData.username}
                onChange={(e) => handleChange(e, "signup")}
                placeholder='Enter your username'
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id='email'
                name="email"
                value={signupData.email}
                onChange={(e) => handleChange(e, "signup")}
                placeholder='Enter your email'
                type='email'
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <TextInput
                id='password'
                name="password"
                value={signupData.password}
                onChange={(e) => handleChange(e, "signup")}
                placeholder='Enter your password'
                type='password'
                required
              />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success &&
              <p style={{ color: 'green' }}>Signup successful! Please check your email to confirm your account.</p>
            }

            <Button 
              type='submit' 
              disabled={loading}
              className='w-full rounded-full mt-4'
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form>
        )}

        {/* Login section */}
        {activeTab === 'login' && (
          <Form
            onSubmit={handleLogin} 
            className='animate-slide-fade'
          >
            <div className="mb-4">
              <h1 className="text-gray-800 text-lg md:text-xl">Welcome Back</h1>
              <p>
                Login to your account to continue
              </p>
            </div>
          
            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id='email'
                name="email"
                value={loginData.email}
                onChange={(e) => handleChange(e, "login")}
                placeholder='Enter your email'
                type='email'
                required
              />
            </div>

            <div>
              <Label>Password</Label>
              <TextInput
                id='password'
                name="password"
                value={loginData.password}
                onChange={(e) => handleChange(e, "login")}
                placeholder='Enter your password'
                type='password'
              />
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Button 
              type='submit' 
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