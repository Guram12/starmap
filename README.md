# 🌟 StarMap

A modern, full-stack Next.js application that revolutionizes place discovery through intelligent filtering and interactive mapping. StarMap helps users find restaurants, hotels, tourist attractions, shopping centers, and healthcare facilities based on personalized preferences including star ratings, location proximity, and place types.

## ✨ Key Highlights

- 🗺️ **Interactive Maps**: Advanced Google Maps integration with custom markers and rich info windows
- 🔍 **Smart Search**: Advanced place discovery with real-time filtering and caching
- 👤 **User Accounts**: Secure authentication with JWT tokens and persistent search history
- 📱 **Mobile-First**: Responsive design with touch interactions and burger menu navigation
- 🌍 **Global Coverage**: Search any city or region worldwide with geocoding support
- 🚀 **Performance**: Optimized API calls with debouncing, caching, and smart result limits

## 🚀 Features

### Core Functionality
- ✅ **Advanced Search Engine**: Multi-criteria place discovery with real-time results
- ✅ **Interactive Map Interface**: Google Maps with custom advanced markers and info windows
- ✅ **Intelligent Filtering**: Filter by place type, star ratings (1-5), and search radius (1-10km)
- ✅ **Global Location Support**: Search any city/region worldwide or use GPS location
- ✅ **Rich Place Details**: Photos, ratings, addresses, and direct Google Maps navigation

### User Experience
- ✅ **Secure Authentication**: JWT-based login/register with HTTP-only cookies
- ✅ **Persistent Preferences**: Cloud storage for authenticated users, local storage for guests
- ✅ **Search History**: Database-stored search history with detailed statistics and replay
- ✅ **Responsive Design**: Mobile-optimized with animated burger menu and touch interactions
- ✅ **Performance Optimization**: Smart caching, debouncing, and API call optimization
- ✅ **Accessibility**: Keyboard navigation, screen reader support, and semantic HTML

### Technical Features
- ✅ **Real-time Geocoding**: Convert addresses to coordinates with intelligent caching
- ✅ **Advanced Markers**: Custom Google Maps markers with info windows and photos
- ✅ **State Management**: React Context API with custom hooks for complex state
- ✅ **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- ✅ **SEO Optimization**: Structured data, meta tags, and OpenGraph integration
- ✅ **Analytics Ready**: Google Analytics integration and performance monitoring


## 🛠️ Tech Stack

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

## 📁 Project Structure

```
src/app/
├── layout.tsx                    # Root layout with global header and AuthProvider
├── page.tsx                      # Home page with landing content
├── MainPageClient.tsx            # Client component for home page animations
├── globals.css                   # Global styles and CSS variables
├── AuthProvider.tsx              # Authentication context provider
├── StructuredData.tsx            # SEO structured data component
├── components/
│   ├── Header.tsx               # Navigation header with auth and mobile menu
│   ├── Header.module.css        # Header styles with responsive design
│   └── Logo.tsx                 # Logo component
├── preferences/
│   ├── page.tsx                 # Server component with metadata
│   ├── PreferencesClient.tsx    # Client component for preferences form
│   └── Preferences.module.css   # Preferences styles
├── map/
│   ├── page.tsx                 # Server component with metadata
│   ├── MapClient.tsx            # Interactive map with markers and sidebar
│   └── Map.module.css           # Map styles
├── history/
│   ├── page.tsx                 # Server component with metadata
│   ├── HistoryClient.tsx        # Search history management
│   └── History.module.css       # History styles
├── auth/
│   ├── login/
│   │   ├── page.tsx            # Login server component
│   │   ├── LoginClient.tsx     # Login form with validation
│   │   └── Login.module.css    # Login styles
│   └── register/
│       ├── page.tsx            # Register server component
│       ├── RegisterClient.tsx  # Registration form
│       └── Register.module.css # Registration styles
└── api/
    ├── auth/
    │   ├── login/route.ts      # Login API endpoint
    │   ├── register/route.ts   # Registration API endpoint
    │   └── me/route.ts         # User profile endpoint
    └── search-history/
        └── route.ts            # Search history CRUD operations

src/hooks/
├── useGoogleMap.tsx             # Google Maps initialization and management
├── usePlacesSearch.tsx          # Places API with caching and optimization
├── useSearchHistory.tsx         # Search history database operations
└── useIsMobile.tsx              # Mobile breakpoint detection hook

src/lib/
├── CookieBanner.tsx             # GDPR cookie consent banner
└── auth.ts                      # JWT token utilities
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

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Maps API Keys
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=your_google_maps_map_id

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/starmap_db

# Authentication
JWT_SECRET=your_jwt_secret_key

# SEO & Analytics
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID=your_ga_measurement_id
NEXT_PUBLIC_GOOGLE_VERIFICATION=your_google_verification_code
```

## 🏗️ Architecture

### Data Flow
1. **User Input** → Preferences form with validation
2. **Geocoding** → Convert locations to coordinates (cached)
3. **Places API** → Search places with filters (debounced)
4. **Map Rendering** → Display results with advanced markers
5. **Storage** → Save to localStorage + database (if authenticated)

### Key Hooks
- `useGoogleMap`: Manages Google Maps instance and initialization
- `usePlacesSearch`: Handles Places API calls with caching and optimization
- `useSearchHistory`: Manages database operations for search history
- `useAuth`: Authentication state and user management
- `useIsMobile`: Responsive design breakpoint detection

### Performance Optimizations
- **API Call Reduction**: Intelligent caching with 10-minute TTL
- **Request Debouncing**: 1-second delay to prevent excessive API calls
- **Result Limiting**: Maximum 15 results per search to control costs
- **Smart Radius**: Automatic radius optimization (max 10km)
- **Coordinate Detection**: Direct coordinate parsing to skip geocoding

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

### Phase 4: Future Enhancements 🚧
- [ ] Favorite places system
- [ ] Advanced filters (price level, opening hours)
- [ ] Place reviews and ratings
- [ ] Social features and place sharing
- [ ] Offline mode with cached data
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- Font optimization with [Geist](https://vercel.com/font)
- Maps powered by [Google Maps Platform](https://developers.google.com/maps)
- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)

---

**Status**: 🚧 In Development | **Version**: 0.1.0 | **Last Updated**: January 2025