# 🌟 StarMap

A Next.js application that helps users discover places based on star ratings and location preferences. Find restaurants, hotels, attractions, and more within your specified criteria.

## 🚀 Features

### Current Features
- **User Preferences Management**: Set and save search criteria locally
- **Region Selection**: Choose your preferred search area
- **Place Type Filtering**: Filter by restaurants, hotels, tourist attractions, shopping centers, and healthcare facilities
- **Star Rating Control**: Set minimum star ratings (1-5 stars)
- **Search Radius**: Define search radius (1-50 km)
- **Responsive Design**: Works on desktop and mobile devices
- **Local Storage**: Preferences persist without registration

### Planned Features
- 🗺️ **Interactive Map Integration**: Visual map interface for place discovery
- 👤 **User Authentication**: Optional registration and login system
- 🔍 **Real-time Place Search**: Integration with places APIs (Google Places, etc.)
- 📱 **Mobile App**: React Native version
- ⭐ **Place Reviews**: User-generated reviews and ratings
- 📊 **Analytics Dashboard**: Usage statistics and preferences insights

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript/JavaScript
- **Styling**: CSS Modules
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage (client-side persistence)
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/app/
├── layout.tsx                    # Root layout with global header
├── page.tsx                      # Home page
├── globals.css                   # Global styles
├── components/
│   ├── Header.tsx               # Navigation header
│   └── Header.module.css        # Header styles
├── preferences/
│   └── page.tsx                 # User preferences configuration
├── map/
│   └── page.tsx                 # Map interface (planned)
└── auth/
    ├── login/
    │   └── page.tsx            # User login
    └── register/
        └── page.tsx            # User registration
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
   - Choose your region/city
   - Select place types (restaurants, hotels, etc.)
   - Set minimum star rating
   - Define search radius

2. **View Map**: Go to `/map` to see places matching your criteria (in development)

3. **Optional Registration**: Create an account at `/auth/register` for cloud sync (planned)

## 🗺️ Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic routing and navigation
- [x] Preferences management
- [x] Local storage integration
- [x] Responsive design

### Phase 2: Map Integration 🚧
- [ ] Google Maps/Leaflet integration
- [ ] Place search API integration
- [ ] Real-time place filtering
- [ ] Place details modal

### Phase 3: User System 📋
- [ ] User authentication
- [ ] Cloud preferences sync
- [ ] User profiles
- [ ] Favorite places

### Phase 4: Advanced Features 📋
- [ ] Place reviews and ratings
- [ ] Photo uploads
- [ ] Social sharing
- [ ] Mobile app

## 🤝 Contributing

This is a learning project for Next.js development. Contributions, suggestions, and feedback are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 Learning Goals

This project serves as a hands-on learning experience for:
- Next.js App Router
- File-based routing
- Server vs Client components
- CSS Modules
- React hooks and state management
- API integration (planned)
- TypeScript (planned migration)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- Font optimization with [Geist](https://vercel.com/font)

---

**Status**: 🚧 In Development | **Version**: 0.1.0 | **Last Updated**: August 2025