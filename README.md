# 🌟 StarMap

A Next.js application that helps users discover places based on star ratings and location preferences. Find restaurants, hotels, attractions, and more within your specified criteria.

## 🚀 Features

### Current Features
- ✅ **User Authentication System**: Complete registration and login with JWT tokens
- ✅ **User Preferences Management**: Set and save search criteria (local + cloud storage)
- ✅ **Google Maps Integration**: Interactive map with advanced markers and info windows
- ✅ **Google Places API**: Real-time place search with geocoding support
- ✅ **Region Selection**: Search any city/region worldwide or use current location
- ✅ **Place Type Filtering**: Restaurants, hotels, tourist attractions, shopping centers, healthcare
- ✅ **Star Rating Control**: Minimum star ratings (1-5 stars) with visual slider
- ✅ **Search Radius**: Customizable radius (1-10 km) with optimization
- ✅ **Search History**: Database-stored search history for authenticated users
- ✅ **Place Details**: Rich info windows with photos, ratings, and Google Maps links
- ✅ **Responsive Design**: Mobile-optimized with burger menu and touch interactions
- ✅ **Smart Caching**: API call optimization with debouncing and result caching
- ✅ **Geolocation Support**: One-click current location detection


## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript/JavaScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with HTTP-only cookies
- **Maps**: Google Maps API with Places API
- **Styling**: CSS Modules
- **State Management**: React Context API + Hooks (useState, useEffect)
- **Storage**: localStorage (client-side) + PostgreSQL (server-side)
- **Icons**: Lucide React Icons
- **Animations**: Framer Motion & GSAP
- **Spinners**: React Spinners
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/app/
├── layout.tsx                    # Root layout with global header
├── page.tsx                      # Home page
├── globals.css                   # Global styles
├── AuthProvider.tsx              # Authentication context provider
├── components/
│   ├── Header.tsx               # Navigation header with auth
│   ├── Header.module.css        # Header styles
│   └── Logo.tsx                 # Logo component
├── preferences/
│   └── page.tsx                 # User preferences configuration
├── map/
│   └── page.tsx                 # Interactive map with place markers
├── history/
│   └── page.tsx                 # Search history for authenticated users
├── auth/
│   ├── login/
│   │   └── page.tsx            # User login
│   └── register/
│       └── page.tsx            # User registration
└── api/
    ├── auth/
    │   ├── login/route.ts      # Login API endpoint
    │   ├── register/route.ts   # Registration API endpoint
    │   └── me/route.ts         # User profile endpoint
    └── search-history/
        └── route.ts            # Search history API
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd starmap
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

1. **Set Preferences**: Visit `/preferences` to configure your search criteria
   - Choose your region/city or use current location
   - Select place types (restaurants, hotels, tourist attractions, shopping, healthcare)
   - Set minimum star rating (1-5 stars)
   - Define search radius (1-10 km)
   - Click "Save & Search" to find places

2. **View Map**: Go to `/map` to see places matching your criteria
   - Interactive map with custom markers
   - Click markers to see place details with photos
   - Direct links to Google Maps for navigation
   - Responsive sidebar with place list

3. **Search History**: Register/login to save your searches
   - View past searches at `/history`
   - Click any search to reload those results
   - Clear history or view statistics

4. **Authentication**: Optional but recommended
   - Register at `/auth/register` for automatic login
   - Login at `/auth/login` to access saved searches
   - All preferences sync between devices

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic routing and navigation
- [x] Preferences management
- [x] Local storage integration
- [x] Responsive design

### Phase 2: Map Integration ✅
- [x] Google Maps integration
- [x] Place search API integration
- [x] Real-time place filtering
- [x] Place details with photos

### Phase 3: User System ✅
- [x] User authentication
- [x] Cloud preferences sync
- [x] User profiles
- [x] Search history


## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- Font optimization with [Geist](https://vercel.com/font)

---

**Status**: 🚧 In Development | **Version**: 0.1.0 | **Last Updated**: August 2025