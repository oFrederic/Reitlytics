# Reitlytics

![Next.js](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Redux](https://img.shields.io/badge/Redux-RTK-764ABC?style=flat-square&logo=redux)
![Mapbox](https://img.shields.io/badge/Mapbox_GL-3.11.0-000000?style=flat-square&logo=mapbox)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.1-38B2AC?style=flat-square&logo=tailwind-css)
![Jest](https://img.shields.io/badge/Jest-29.7.0-C21325?style=flat-square&logo=jest)

## 📊 Project Overview

Reitlytics is a sophisticated enterprise-grade web application for analyzing Japanese Real Estate Investment Trust (J-REIT) properties. Built with modern React architecture and following industry best practices, the platform provides comprehensive tools for property search, interactive map visualization, advanced financial analytics, and data-driven investment insights.

**Key Highlights:**
- 🏢 **Real REIT Data**: 4,000+ actual Japanese real estate properties
- 🗾 **Bilingual Implementation**: Japanese UI with English codebase  
- 📈 **Advanced Analytics**: Time-series cap rate and occupancy analysis
- 🗺️ **Interactive Mapping**: Mapbox-powered visualization with custom markers
- 🔍 **Sophisticated Search**: Multi-parameter filtering with real-time validation
- 🏗️ **Enterprise Architecture**: Centralized constants, types, utilities, and design system
- 🧪 **Comprehensive Testing**: 100% API coverage with robust test patterns

## ✨ Core Features

### 🔍 **Advanced Property Search**
- **Multi-parameter filtering**: Cap rate, occupancy rate, appraisal value ranges
- **Real-time validation**: Input validation with error states and user feedback
- **Currency conversion**: Automatic yen to million yen conversions
- **Search persistence**: Redux-powered state management with selectors
- **Reset functionality**: Clear all filters with one click
- **Form validation**: Comprehensive input sanitization and error handling

### 🗺️ **Interactive Map Visualization**
- **Custom markers**: Asset type-based color coding (Office: Blue, Retail: Red, Hotel: Yellow, etc.)
- **Rich popups**: Detailed building information with SVG icons
- **State synchronization**: Map markers respond to list selections and hover states
- **Smooth animations**: Transitions for selection and zoom changes
- **Performance optimized**: Efficient marker creation and cleanup

### 📊 **Financial Analytics Dashboard**
- **Cap Rate Charts**: Historical trend analysis with time filtering
- **Occupancy Rate Visualization**: Building utilization metrics over time
- **Dynamic Time Filters**: Monthly, Quarterly, Half-yearly, Yearly views
- **Data Granularity Detection**: Automatic filter availability based on data density
- **Responsive Charts**: Horizontal scrolling for large datasets
- **Chart Configuration**: Centralized chart constants and styling

### 🏢 **Property Information System**
- **Detailed Building Cards**: Acquisition date, cap rates, evaluation amounts
- **Selection States**: Visual feedback for selected and hovered properties
- **Smooth Scrolling**: Auto-scroll to selected items in lists
- **Japanese Business Context**: REIT-specific terminology and metrics

### 🎨 **Design System**
- **CSS Variables**: Centralized design tokens for colors, spacing, typography
- **Component Library**: Reusable UI components (Button, Input, Loading, ErrorBoundary)
- **Consistent Styling**: Unified visual language across the application
- **Responsive Design**: Mobile-first approach with breakpoint system

## 🛠️ Technology Stack

### **Frontend Architecture**
- **Next.js 15**: App Router with server components and API routes
- **React 19**: Latest features with concurrent rendering
- **TypeScript 5**: Strict type safety with comprehensive type definitions
- **Redux Toolkit**: Async thunks, normalized state management, and memoized selectors
- **CSS Modules + Tailwind**: Scoped styling with utility classes and design tokens

### **Data Visualization**
- **Mapbox GL 3.11.0**: WebGL-powered mapping with custom overlays
- **Recharts 2.15.2**: Responsive chart library with custom tooltips
- **React Icons 5.5.0**: Consistent iconography throughout the UI

### **Development & Testing**
- **Jest 29.7.0**: Comprehensive test suite with 100% API coverage
- **React Testing Library**: Component testing with best practices
- **ESLint 9**: Code quality with Next.js and TypeScript rules
- **Turbopack**: High-performance development bundling

### **Utilities & Tools**
- **clsx**: Conditional class name utility for dynamic styling
- **Custom Hooks**: Reusable logic for data fetching, validation, and state management
- **Error Boundaries**: Graceful error handling and user feedback

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher
- **npm/yarn**: Latest stable version
- **Mapbox Account**: For map functionality (required for local development)

### 🗺️ Mapbox Token Setup

**Important Security Notice:**
- **Live Demo**: Mapbox functionality is disabled on the live demo for security purposes
- **Local Development**: You need your own Mapbox token to enable map features locally
- **Free Tier**: Mapbox offers 50,000 free map loads per month

#### Getting Your Mapbox Token:
1. **Sign up** at [Mapbox](https://www.mapbox.com/) (free account)
2. **Create a token** in your Mapbox dashboard
3. **Copy the token** (starts with `pk.`)

#### Setting Up the Token Locally:
```bash
# Clone the repository
git clone <repository-url>
cd Reitlytics

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local and add your Mapbox token:
NEXT_PUBLIC_MAPBOX_TOKEN=pk.your_actual_token_here
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

#### Security Features Built-in:
- **Usage monitoring**: Automatic rate limiting (500/hour, 5,000/day)
- **Token validation**: Format checking and error handling
- **Graceful fallback**: App works without map if token is missing
- **Domain restrictions**: Set in Mapbox dashboard for production

### Installation

```bash
# Start development server with Turbopack
npm run dev
```

Visit `http://localhost:3000` - you'll be automatically redirected to `/buildings/search`

**Note**: If you don't set up a Mapbox token, the app will work but the map will show an error message. All other features (search, charts, data) will function normally.

### Available Scripts

```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run start        # Start production server
npm run test         # Run test suite
npm run test:watch   # Watch mode testing
npm run lint         # Code quality checks
```

## 📋 Project Architecture

```
Reitlytics/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   └── buildings/            # Building endpoints
│   │   │       ├── route.ts          # GET /api/buildings
│   │   │       ├── search/route.ts   # GET /api/buildings/search
│   │   │       ├── [id]/route.ts     # GET /api/buildings/:id
│   │   │       ├── stats/route.ts    # GET /api/buildings/stats
│   │   │       ├── types/route.ts    # GET /api/buildings/types
│   │   │       └── __tests__/        # API test suites
│   │   ├── buildings/search/         # Main search interface
│   │   │   ├── components/           # Search-specific components
│   │   │   ├── utils/               # Data transformation utilities
│   │   │   └── page.tsx             # Search page component
│   │   ├── layout.tsx               # Root layout with Redux provider
│   │   ├── page.tsx                 # Home page (redirects)
│   │   └── globals.css              # Global styles + Mapbox CSS
│   ├── components/                  # Shared components
│   │   ├── Charts/                  # Recharts visualization components
│   │   │   ├── CapRateChart.tsx     # Cap rate time series
│   │   │   ├── OccupancyRateChart.tsx # Occupancy visualization  
│   │   │   ├── ChartUtils.ts        # Shared chart utilities
│   │   │   └── index.ts             # Component exports
│   │   ├── Map/                     # Mapbox integration
│   │   │   ├── MapComponent.tsx     # Interactive map with markers
│   │   │   └── index.ts             # Map exports
│   │   └── ui/                      # Reusable UI components
│   │       ├── Button/              # Button component
│   │       ├── Input/               # Input component
│   │       ├── Loading/             # Loading spinner
│   │       ├── ErrorBoundary/       # Error boundary component
│   │       └── index.ts             # UI component exports
│   ├── constants/                   # Centralized constants
│   │   ├── api.ts                   # API endpoint constants
│   │   ├── ui.ts                    # UI-related constants
│   │   ├── business.ts              # Business domain constants
│   │   ├── charts.ts                # Chart configuration constants
│   │   └── index.ts                 # Constants barrel export
│   ├── types/                       # TypeScript type definitions
│   │   ├── api.ts                   # API request/response types
│   │   ├── ui.ts                    # UI component types
│   │   ├── charts.ts                # Chart-specific types
│   │   ├── business.ts              # Business domain types
│   │   ├── utilities.ts             # Utility function types
│   │   └── index.ts                 # Types barrel export
│   ├── utils/                       # Utility functions
│   │   ├── validation.ts            # Input validation utilities
│   │   ├── currency.ts              # Currency conversion utilities
│   │   ├── formatting.ts            # Data formatting utilities
│   │   ├── errors.ts                # Error handling utilities
│   │   ├── data.ts                  # Data transformation utilities
│   │   ├── styles.ts                # Styling utilities (clsx wrapper)
│   │   └── index.ts                 # Utils barrel export
│   ├── lib/                         # Library code
│   │   └── validation/              # Validation schemas
│   │       └── schemas.ts           # API input validation schemas
│   ├── redux/                       # State management
│   │   ├── store.ts                 # Redux store configuration
│   │   ├── ReduxProvider.tsx        # Client-side provider
│   │   ├── slices/                  # Redux slices
│   │   │   └── buildingsSlice.ts    # Building state management
│   │   └── selectors/               # Redux selectors
│   │       ├── buildingSelectors.ts # Memoized building selectors
│   │       └── index.ts             # Selectors barrel export
│   ├── config/                      # Configuration
│   │   ├── mapbox.ts               # Mapbox settings and tokens
│   │   └── environment.ts          # Environment-specific config
│   ├── styles/                      # Design system and styling
│   │   ├── design-tokens.css       # CSS variables and design tokens
│   │   ├── base.css                # Base HTML element styles
│   │   └── components/             # Component-specific styles
│   │       └── search.css          # Search page styles
│   ├── mocks/                      # Data and testing
│   │   ├── buildings.json          # 44,000+ lines of real REIT data
│   │   ├── buildings.type.d.ts     # TypeScript definitions
│   │   └── __mocks__/              # Test mocks
│   ├── test-utils/                 # Testing utilities
│   │   ├── setup.ts                # Jest configuration
│   │   ├── test-helpers.ts         # API testing helpers
│   │   └── jest-globals.ts         # TypeScript Jest globals
│   └── types/                      # Global type definitions
├── public/                         # Static assets
├── tailwind.config.ts             # Tailwind CSS configuration
├── next.config.ts                 # Next.js configuration
├── jest.config.js                 # Jest testing configuration
└── tsconfig.json                  # TypeScript configuration
```

## 🏗️ API Documentation

### **Core Endpoints**

#### `GET /api/buildings`
Returns complete dataset of J-REIT buildings.

```typescript
Response: {
  success: true,
  data: {
    jReitBuildings: JReitBuilding[]
  }
}
```

#### `GET /api/buildings/search`
Advanced property search with filtering capabilities.

```typescript
Query Parameters:
- q?: string              // Text search (name/address)
- minYield?: string       // Minimum occupancy rate (%)
- maxYield?: string       // Maximum occupancy rate (%)  
- minPrice?: string       // Minimum price (million yen)
- maxPrice?: string       // Maximum price (million yen)
- minCap?: string         // Minimum cap rate (%)
- maxCap?: string         // Maximum cap rate (%)

Response: {
  success: true,
  data: {
    results: JReitBuilding[],
    count: number,
    filters: SearchParams
  }
}
```

#### `GET /api/buildings/[id]`
Individual building lookup by ID.

#### `GET /api/buildings/stats`
Aggregate statistics across all properties.

#### `GET /api/buildings/types`
Filter buildings by asset type (office, retail, hotel, etc.).

### **Error Handling**
All endpoints return standardized error responses with comprehensive validation:

```typescript
{
  success: false,
  error: {
    code: 'BAD_REQUEST' | 'NOT_FOUND' | 'INTERNAL_ERROR' | 'VALIDATION_ERROR',
    message: string,
    details?: unknown
  }
}
```

## 🧠 Architecture Decisions

### **State Management Strategy**
- **Redux Toolkit**: Chosen for complex property search state and async operations
- **Normalized Data**: Efficient property filtering and selection management  
- **Memoized Selectors**: Performance-optimized data access patterns
- **Typed Hooks**: Custom `useAppSelector` and `useAppDispatch` for type safety
- **Comprehensive State**: Search parameters, building data, UI state, and error handling

### **Performance Optimizations**
- **React.memo**: Prevents unnecessary re-renders in charts and lists
- **useMemo/useCallback**: Expensive calculations and event handlers cached
- **Efficient Marker Management**: Map markers created/destroyed strategically
- **Data Virtualization**: Large dataset handling with pagination potential
- **Lazy Loading**: Components loaded on-demand for better initial load times

### **Data Architecture** 
- **Transformation Pipeline**: `JReitBuilding` → `BuildingData` UI optimization
- **Currency Utilities**: Yen ↔ Million Yen ↔ Hundred Million Yen conversions
- **Real Estate Domain**: Cap rates, occupancy rates, appraisal values
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Validation**: Input sanitization and data integrity checks

### **UI/UX Design**
- **Three-Panel Layout**: Search form (25%), building list (25%), visualization (50%)
- **Responsive Behavior**: Collapsible search panel for mobile
- **State Synchronization**: Map selection ↔ list selection ↔ Redux state
- **Japanese Localization**: Business terminology in Japanese, code in English
- **Design System**: Consistent visual language with CSS variables and reusable components
- **Error Boundaries**: Graceful error handling with user-friendly messages

### **Code Organization**
- **Centralized Constants**: All magic numbers and configuration in dedicated files
- **Type Safety**: Comprehensive TypeScript definitions with barrel exports
- **Utility Functions**: Organized, reusable functions with clear responsibilities
- **Component Patterns**: Container/Presenter pattern with custom hooks
- **Testing Strategy**: Comprehensive test coverage with reusable test utilities

## 🔍 Key Implementation Highlights

### **Advanced Search System**
```typescript
// Real-time validation with comprehensive error handling
function isValidNumberInput(value: string): boolean {
  return value === '' || /^(\d+)?(\.\d+)?$/.test(value);
}

// Multi-parameter filtering with currency conversion
const filteredResults = buildings.filter(building => {
  // Price filtering with yen to million yen conversion
  const priceInMillionYen = convertYenToMillionYen(building.appraisedPrice);
  return priceInMillionYen >= minPrice && priceInMillionYen <= maxPrice;
});
```

### **Interactive Map Integration**
```typescript
// Dynamic marker styling based on selection state
const markerSize = isSelected ? '26px' : (isHovered ? '24px' : '18px');
const markerColor = getAssetTypeColor(building.assetType);

// Rich popups with building details
const popup = new mapboxgl.Popup()
  .setHTML(generateBuildingPopupHTML(building));
```

### **Chart Data Processing**
```typescript
// Time-based data aggregation with granularity detection
const dataGranularity = useMemo(() => {
  const minInterval = calculateMinIntervalBetweenDataPoints(historyData);
  return {
    isMonthlyAvailable: minInterval <= 1.1,
    isQuarterlyAvailable: minInterval <= 3.1,
    isHalfYearlyAvailable: minInterval <= 6.1
  };
}, [historyData]);
```

### **Centralized Configuration**
```typescript
// Constants-driven configuration
export const API_ENDPOINTS = {
  BUILDINGS: '/api/buildings',
  BUILDINGS_SEARCH: '/api/buildings/search',
  BUILDING_BY_ID: (id: string) => `/api/buildings/${id}`,
  BUILDINGS_STATS: '/api/buildings/stats',
  BUILDINGS_TYPES: '/api/buildings/types'
} as const;

// Design system tokens
export const CHART_COLORS = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  // ... more colors
} as const;
```

## 🧪 Testing Strategy

### **Comprehensive API Testing**
- **100% Endpoint Coverage**: All 5 API routes fully tested
- **Error Scenario Testing**: Bad requests, not found, validation errors
- **Mock Data Strategy**: Simplified dataset for consistent testing
- **Request Helper Utilities**: Parameterized request generation
- **Validation Testing**: Input sanitization and error handling verification

```bash
# Run complete test suite
npm test

# Watch mode for development
npm run test:watch

# Coverage report (configured for API routes)
npm test -- --coverage
```

### **Test Structure**
```typescript
// Example API test pattern with validation
describe('Buildings Search API', () => {
  beforeEach(() => {
    jest.mock('@/mocks/buildings.json', () => mockData);
  });

  it('filters by cap rate range with validation', async () => {
    const request = createMockRequestWithParams('/api/buildings/search', {
      minCap: '4.0', maxCap: '6.0'
    });
    
    const response = await GET(request);
    expect(response.status).toBe(200);
    // ... comprehensive assertions
  });

  it('handles invalid input gracefully', async () => {
    const request = createMockRequestWithParams('/api/buildings/search', {
      minCap: 'invalid'
    });
    
    const response = await GET(request);
    expect(response.status).toBe(400);
    // ... error response validation
  });
});
```

## 🚧 Future Enhancements

### **Immediate Roadmap**
- [ ] **Real-time Data Integration**: Live REIT market data API
- [ ] **Advanced Analytics**: Property comparison tools
- [ ] **Export Functionality**: PDF reports and Excel exports  
- [ ] **User Authentication**: Saved searches and watchlists
- [ ] **Performance Monitoring**: Application performance metrics

### **Extended Features**
- [ ] **Historical Trend Analysis**: Long-term performance metrics
- [ ] **Portfolio Management**: Multi-property investment tracking
- [ ] **Market Insights**: Predictive analytics and recommendations
- [ ] **Mobile App**: React Native companion application
- [ ] **Internationalization**: Multi-language support beyond Japanese

## 📊 Data Sources

The application uses real Japanese REIT data including:
- **4,000+ Properties**: Actual J-REIT building portfolio data
- **Historical Cap Rates**: Time-series financial performance
- **Geographic Data**: Precise latitude/longitude coordinates  
- **Asset Classifications**: Office, retail, hotel, residential, logistics
- **Financial Metrics**: Occupancy rates, appraisal values, acquisition data

## 🎯 Business Impact

Reitlytics addresses key challenges in J-REIT investment analysis:
- **Data Fragmentation**: Centralized property information
- **Visual Analysis**: Map-based portfolio overview  
- **Trend Recognition**: Historical performance patterns
- **Efficient Filtering**: Quick property selection by criteria
- **Professional Presentation**: Investment-grade visualizations
- **Scalable Architecture**: Enterprise-ready codebase for future growth

## 📝 License

MIT License - Open source for educational and commercial use.

## 👨‍💻 Author

**Frederic Wojcikowski**  
Full-Stack Developer specializing in React/Next.js applications

---

<p align="center">
  <strong>Built with modern React architecture for Japanese real estate professionals</strong><br/>
  <em>Combining sophisticated data visualization with intuitive user experience and enterprise-grade code quality</em>
</p>