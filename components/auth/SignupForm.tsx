'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Form, TextInput, Button, Label } from '@/ui';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          },

          emailRedirectTo: `${baseUrl}/dashboard`
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
    } catch (error) {
      setError('An error occurred during signup.');
    } finally {
      setLoading(false);
    }

  }

  return (
    <Form onSubmit={handleSignup}>
      <h1>
        Create Account
      </h1>
      
      <Label htmlFor='username'>Username</Label>
      <TextInput
        id='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder='Enter your username'
        required
      />

      <Label htmlFor='email'>Email</Label>
      <TextInput
        id='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder='Enter your email'
        type='email'
        required
      />

      <Label htmlFor='password'>Password</Label>
      <TextInput
        id='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Enter your password'
        type='password'
      />

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
  )

}