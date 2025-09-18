import { Metadata } from 'next'
import RegisterClient from './RegisterClient'
import StructuredData from '@/app/StructuredData';





export const metadata: Metadata = {
  title: "Register for StarMap",
  description: "Create your StarMap account to save preferences, access search history, and get personalized recommendations.",
  keywords: ["register", "create account", "StarMap account", "sign up"],
  openGraph: {
    title: "Register for StarMap",
    description: "Create your StarMap account to save preferences and access search history.",
    url: "https://starmp.space/auth/register",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Register for StarMap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Register for StarMap",
    description: "Create your StarMap account to save preferences and access search history.",
    images: ["/og-image.jpg"],
  },
};

const registerStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Register for StarMap",
  "description": "Create your StarMap account to save preferences, access search history, and get personalized recommendations.",
  "url": "https://starmp.space/auth/register",
  "isPartOf": {
    "@type": "WebSite",
    "name": "StarMap",
    "url": "https://starmp.space"
  },
  "potentialAction": {
    "@type": "RegisterAction",
    "target": "https://starmp.space/auth/register",
    "name": "Create StarMap Account"
  }
};

export default function Register() {
  return (
    <>
      <StructuredData data={registerStructuredData} />
      <RegisterClient />
    </>
  );
}