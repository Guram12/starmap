'use client'


import { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: "Login to StarMap",
  description: "Sign in to your StarMap account to save preferences and access your search history.",
  keywords: ["login", "StarMap account", "sign in", "preferences", "search history"],
  openGraph: {
    title: "Login to StarMap",
    description: "Sign in to your StarMap account to save preferences and access your search history.",
    url: "https://starmp.space/auth/login",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Login to StarMap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Login to StarMap",
    description: "Sign in to your StarMap account to save preferences and access your search history.",
    images: ["/og-image.jpg"],
  },
};





export default function Login() {
  return <LoginClient />;
}

