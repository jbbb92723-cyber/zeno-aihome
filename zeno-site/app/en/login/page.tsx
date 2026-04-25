'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import Container from '@/components/Container'
import PasswordInput from '@/components/PasswordInput'

function mapAuthError(error: string | null): string {
  if (!error) return ''
  switch (error) {
    case 'CredentialsSignin':      return 'Incorrect email or password.'
    case 'OAuthSignin':            return 'Google sign-in failed. Please try again.'
    case 'OAuthCallback':          return 'Google sign-in callback error. Please try again.'
    case 'OAuthAccountNotLinked':  return 'This email is already registered. Please sign in with email and password first. You can link Google later in account settings.'
    case 'SessionRequired':        return 'Please sign in to access this page.'
    case 'Configuration':          return 'Server configuration error. Please try again later.'
    default:                       return 'Something went wrong. Please try again.'
  }
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/en/account'
  const errorParam  = searchParams.get('error')

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(mapAuthError(errorParam))
  const [loading, setLoading]   = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(mapAuthError(result.error))
        setLoading(false)
      } else if (result?.ok) {
        window.location.href = callbackUrl
      } else {
        setError('Sign-in failed. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please check your connection.')
      setLoading(false)
    }
  }

  async function handleGoogle() {
    if (googleLoading) return
    setGoogleLoading(true)
    try {
      await signIn('google', { callbackUrl })
    } catch {
      setError('Google sign-in failed. Please try again.')
      setGoogleLoading(false)
    }
  }

  return (
    <Container size="content" className="py-section">
      <div className="max-w-[28rem] mx-auto">
        <div className="mb-10">
          <p className="page-label mb-3">Sign in</p>
          <h1 className="text-2xl font-semibold text-ink tracking-tight">Welcome back</h1>
          <p className="text-sm text-ink-muted mt-3 leading-relaxed">
            Sign in to access resources and leave comments. Public content is always free.
          </p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-800 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Email + Password */}
        <form onSubmit={handleCredentials} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full text-sm text-ink bg-surface border border-border px-3 py-2 placeholder:text-ink-faint focus:outline-none focus:border-stone transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm text-ink-muted mb-1.5">Password</label>
            <PasswordInput
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full text-sm font-medium text-white bg-stone px-4 py-2.5 hover:bg-stone/85 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-ink-faint">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-ink border border-border px-4 py-2.5 hover:bg-surface-warm disabled:opacity-50 transition-colors"
        >
          {googleLoading ? (
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"/>
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {googleLoading ? 'Redirecting…' : 'Continue with Google'}
        </button>

        {/* Footer links */}
        <div className="mt-6 space-y-1.5 text-center">
          <p className="text-sm text-ink-muted">
            No account?{' '}
            <Link href="/en/register" className="text-stone hover:underline underline-offset-2">
              Register
            </Link>
          </p>
          <p className="text-sm text-ink-muted">
            <Link href="/forgot-password" className="text-stone hover:underline underline-offset-2">
              Forgot password?
            </Link>
          </p>
        </div>

        <div className="mt-8 pt-5 border-t border-border">
          <p className="text-xs text-ink-faint leading-relaxed text-center">
            Public content is always free. Signing in unlocks resource downloads and comments.
          </p>
        </div>
      </div>
    </Container>
  )
}

export default function EnLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
