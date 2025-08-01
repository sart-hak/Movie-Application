'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/auth-context';
import { LoginData, RegisterData } from '@/types';

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, register } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginData | RegisterData>();

  const onSubmit = async (data: LoginData | RegisterData) => {
    setIsLoading(true);
    try {
      if (isLogin) {
        await login({ ...(data as LoginData) }); // Pass rememberMe if needed
      } else {
        await register(data as RegisterData);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="text-center">
      <div className="mb-12">
        <h1 className="text-4xl font-semibold text-white mb-8">
          {isLogin ? 'Sign in' : 'Sign up'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <input
            {...registerField('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            className="input-field"
            placeholder="Email"
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-400 text-left">{errors.email.message}</p>
          )}
        </div>

        <div>
          <input
            {...registerField('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
            type="password"
            className="input-field"
            placeholder="Password"
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-400 text-left">{errors.password.message}</p>
          )}
        </div>

        
        {isLogin && (
          <div className="flex justify-center items-center text-center mt-4 mb-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-[#2BD17E] bg-[#224957] border-white/20 rounded focus:ring-[#2BD17E] focus:ring-2"
            />
            <label htmlFor="remember" className="ml-3 text-sm text-white/80">
              Remember me
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-8"
        >
          {isLoading ? 'Please wait...' : isLogin ? 'Login' : 'Sign up'}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={toggleMode}
            className="text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
