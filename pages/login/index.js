import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here, e.g., API call
    const request = {
        email: email,
        password: password,
    };
    const response = await fetch('api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    });
    const data = await response.json();
    if (response.ok) {
        //console.log('logged in', data);
     //   localStorage.setItem('adminId', data.userId);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        router.push('/dashboard');
        //await createSession(data.userId);
        
        //setError('Login Successful.');
    } else {;
        if (response.status === 401) {
            setError('Invalid credentials');
        } else {
            setError('An error occurred. Please try again!.');
        }
    }
   // console.log('Logging in with:', { email, password });
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Login</h2>
          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-md focus:border-blue-500 focus:ring-blue-500 text-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-2 block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-md focus:border-blue-500 focus:ring-blue-500 text-lg p-3 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-semibold dark:focus:ring-offset-gray-900"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
