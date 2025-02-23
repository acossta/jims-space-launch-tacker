# Space Launch Tracker Requirements

## Overview
A real-time space launch tracking application that displays upcoming launches with detailed information and filtering capabilities. The application uses the Launch Library 2 API as its data source and shadcn for UI components.

## Technical Stack
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Launch Library 2 API (https://ll.thespacedevs.com/2.2.0)
- Local Storage for user preferences

## Development Phases

### Phase 1: Basic Launch List ✅
**Status: Completed**
- Set up Next.js project with TypeScript and Tailwind CSS
- Implemented basic launch list showing:
  - Launch name and mission details
  - Launch window (start and end times)
  - Launch site and location
  - Rocket information (full name and variant)
  - Mission description
  - Success probability
  - Weather concerns
  - Status with color-coded indicators
  - Social media links (YouTube and X/Twitter)
  - Mission patch/launch images
- Implemented infinite scroll with:
  - 25 items per page
  - Loading states
  - Error handling
  - Automatic pagination
- Added proper error boundaries and loading states
- Implemented responsive design for launch cards
- API Integration:
  - Connected to Launch Library 2 API
  - Implemented rate limiting protection
  - Added proper data transformation
  - Handled video URL parsing for social media links

### Phase 2: Filtering System ✅
**Status: Completed**
- Implemented comprehensive filter functionality:
  - Month selection (always starting from current month)
  - Location filter with country codes
  - Rocket type filter with family grouping
  - Mission success probability ranges (High >80%, Medium 50-80%, Low <50%, Unknown)
  - Launch status filter
- Added filter persistence in local storage
- Implemented filter reset capability
- Enhanced UI features:
  - Modern dropdown selectors
  - Clear filter options
  - Responsive filter layout
  - Loading states for filter updates
  - Error handling for no results
- Optimized filter performance:
  - Client-side filtering for quick updates
  - Proper state management
  - Duplicate launch prevention
  - Automatic filter options population

### Phase 3: Launch Details View ✅
**Status: Completed**
- Created detailed launch view modal with:
  - Mission patch images with enhanced display
  - Detailed mission description with improved readability
  - Core details and reuse information
  - Weather conditions and status indicators
  - Recovery attempts and launch site details
- Implemented countdown timer functionality:
  - Detailed countdown (hours:minutes:seconds) for same-day launches
  - Simplified display (days) for future launches
  - Real-time updates every second
  - Automatic format switching based on launch date
- Enhanced modal features:
  - Responsive two-column layout
  - High-contrast text for better readability
  - Clear visual hierarchy with section grouping
  - Interactive social media links
  - Smooth animations and transitions

### Phase 4: Enhanced Features
- Add sunrise/sunset highlighting
  - Special row color for launches within ±1 hour of sunrise/sunset
  - Based on launch site local time

## Detailed Requirements

### Launch List Display
- Show only upcoming launches (no historical data)
- Each launch entry shows:
  - Launch window times (start and end)
  - Status with color indicators (green for go, yellow for hold, blue for others)
  - Launch site and location with country code
  - Rocket details (name, variant)
  - Success probability (when available)
  - Weather concerns (when available)
  - Mission patch/image
  - Live webcast indicator

### Filtering Capabilities
- Month filter (starting from current month)
- Launch base filter
- Rocket type filter
- Mission success probability filter
- Customer/payload type filter
- Launch status filter

### Launch Detail View
- Mission patch images
- Detailed mission description
- Core details and reuse information
- Weather conditions
- Recovery attempts information
- Countdown timer

### Data Updates
- Automatic data refresh every minute
- Loading states for data fetching
- Error handling for API failures

### Time Zone Handling
- Display all times in three formats:
  - User's local time zone
  - Launch site time zone
  - GMT
- Calendar view defaults to user's local time zone
- Clear labeling of all time zones

### User Preferences
- All filter selections persist between sessions
- No user authentication required
- No launch favoriting functionality

### Visual Requirements
- Use shadcn/ui components throughout the application
- Special row highlighting for launches near sunrise/sunset
- Responsive design for all screen sizes
- Clear loading states
- Error states for failed data fetching
- Color-coded status indicators

### API Integration Details
- Base URL: https://ll.thespacedevs.com/2.2.0
- Endpoints used:
  - /launch/upcoming/ - For upcoming launches
- Parameters:
  - limit: 25 (items per page)
  - offset: For pagination
  - ordering: by net (launch time)
  - mode: detailed

### Non-Requirements (Explicitly Excluded)
- Historical launch data
- Push notifications
- Map view of launch sites
- Email/calendar integration
- Launch favoriting
- User authentication
- Weekly/daily calendar views