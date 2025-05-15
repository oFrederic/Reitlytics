# Reitlytics

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-RTK-764ABC?style=flat-square&logo=redux)
![Mapbox](https://img.shields.io/badge/Mapbox_GL-3.11.0-000000?style=flat-square&logo=mapbox)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?style=flat-square&logo=jest)

## 📊 Project Overview

Reitlytics is a sophisticated web application designed for analyzing Japanese Real Estate Investment Trust (J-REIT) properties. The platform provides powerful tools for property search, map visualization, and financial metric analysis, helping investors make data-driven decisions in the real estate market.

> ⏱️ Built in just 2 weeks with 1 hour of development per day (14 hours total)

![Reitlytics Screenshot](public/screenshot.png)

## ✨ Features

- **Intuitive Property Search**: Find properties by location, property type, and financial metrics
- **Interactive Map**: Visualize property locations using Mapbox GL integration
- **Financial Analysis**: Dynamic charts for cap rates and occupancy rates using Recharts
- **Detailed Property Information**: View comprehensive details about each property

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: Modern React framework with built-in API routes, server components and optimized performance
- **React 19**: Latest React version with improved rendering performance
- **TypeScript**: Enhanced code quality and developer experience with static typing
- **Redux Toolkit**: Simplified state management approach for complex application state
- **Mapbox GL**: Advanced mapping capabilities with custom markers and interactions
- **Recharts**: Responsive and customizable charts for financial data visualization
- **TailwindCSS**: Utility-first CSS framework for rapid UI development

### Testing
- **Jest**: JavaScript testing framework with a focus on simplicity
- **React Testing Library**: Testing utilities encouraging good testing practices

### Development Tools
- **ESLint**: Code quality enforcement
- **Turbopack**: High-performance bundler for faster development experience

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/proptrade-jreit.git
cd proptrade-jreit

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 📋 Project Structure

```
proptrade-jreit/
├── src/
│   ├── app/             # Next.js app router components
│   ├── components/      # Reusable UI components
│   ├── config/          # Application configuration
│   ├── mocks/           # Mock data for development
│   ├── redux/           # Redux store setup and slices
│   ├── test-utils/      # Testing utilities
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
├── tailwind.config.ts   # Tailwind CSS configuration
└── next.config.ts       # Next.js configuration
```

## 🧠 Architecture Decisions

- **Next.js App Router**: Utilized for client-side navigation and optimized page loading
- **Redux + RTK**: Chosen for predictable state management and simplified API data handling
- **Mapbox GL**: Selected for its superior performance with large datasets and customization options
- **TailwindCSS**: Implemented for consistent design system and rapid development
- **TypeScript**: Employed for type safety and improved developer experience

## 🔍 Key Implementation Details

- **Data Normalization**: Optimized property data for efficient filtering and search
- **Custom Hooks**: Created for map interactions and data fetching
- **Memoization**: Implemented to prevent unnecessary re-renders with large datasets
- **Accessibility**: Ensured WCAG compliance for inclusive user experience

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚧 Future Improvements

- Integration with real-time financial data API
- Advanced filtering capabilities
- User authentication for saved searches
- Property comparison tool
- Historical trend analysis

## 📝 License

MIT

## 👨‍💻 Author

Frederic Wojcikowski

---

<p align="center">Made with ❤️ for real estate investors and developers</p> 