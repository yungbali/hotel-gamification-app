# Hotel Gamification App

A mobile application built with React Native and Framer Motion that gamifies hotel staff performance through QR-code-based guest feedback, points systems, badges, and leaderboards.

## Features

### 🏨 **Core Functionality**
- **QR Code Generation**: Dynamic QR codes for waiters to collect guest feedback
- **Guest Feedback System**: Mobile web form for guests to rate service (1-5 stars)
- **Points & Gamification**: Points awarded for 4-5 star ratings (10 pts for 4⭐, 20 pts for 5⭐)
- **Badges & Levels**: Achievement system with unlockable badges
- **Leaderboards**: Weekly, monthly, and all-time performance rankings

### 👥 **User Roles**
- **Waiters**: View dashboard, generate QR codes, track points and badges
- **Managers**: Access analytics dashboard, monitor performance, review fraud alerts
- **Guests**: Scan QR codes to provide feedback via mobile web form

### 🔒 **Anti-Fraud Measures**
- **Geofencing**: Ratings only accepted within hotel premises
- **Rate Limiting**: Prevents spam and multiple submissions
- **QR Code Validation**: One-time use tokens with expiration
- **Anomaly Detection**: Flags suspicious rating patterns
- **Device Tracking**: Monitors for unusual device usage patterns

### 📊 **Analytics & Monitoring**
- **Real-time Dashboard**: Live performance metrics and trends
- **Guest Satisfaction**: Visual breakdown of rating distribution
- **Top Performers**: Weekly/monthly leaderboards
- **Fraud Alerts**: Automated detection and flagging system

## Technology Stack

- **Frontend**: React Native with TypeScript
- **UI Framework**: React Native Paper + Framer Motion
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **QR Codes**: react-native-qrcode-svg
- **Icons**: Expo Vector Icons (Ionicons)
- **Storage**: AsyncStorage for local data persistence
- **Animations**: Framer Motion for smooth transitions

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Waiter/         # Waiter-specific components
│   ├── Manager/        # Manager-specific components
│   ├── Guest/          # Guest feedback components
│   └── Common/         # Shared components
├── screens/            # Main app screens
│   ├── LoginScreen.tsx
│   ├── WaiterDashboard.tsx
│   ├── QRCodeScreen.tsx
│   ├── LeaderboardScreen.tsx
│   ├── AnalyticsScreen.tsx
│   └── ProfileScreen.tsx
├── services/           # Business logic and API calls
│   ├── authService.ts
│   ├── qrCodeService.ts
│   ├── gamificationService.ts
│   └── backendService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for mobile testing)
- Web browser (for guest feedback form testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hotel-gamification-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on different platforms**
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

### Demo Accounts

The app includes demo accounts for testing:

- **Waiter**: `waiter@hotel.com` / `password`
- **Manager**: `manager@hotel.com` / `password`

## Key Features Explained

### QR Code System
- Each waiter generates unique QR codes for their shift
- QR codes contain one-time tokens that expire after 24 hours
- Guests scan codes to access feedback form (no app download required)
- Codes are tracked for analytics and fraud prevention

### Gamification Mechanics
- **Points**: 10 pts for 4-star ratings, 20 pts for 5-star ratings
- **Levels**: Automatic level progression based on total points
- **Badges**: Achievement unlocks for milestones (first rating, 100 points, etc.)
- **Leaderboards**: Reset weekly/monthly to maintain fairness

### Fraud Prevention
- **Geofencing**: Uses device GPS to ensure ratings come from hotel premises
- **Rate Limiting**: Prevents multiple submissions from same device
- **Anomaly Detection**: Flags unusual rating patterns or spikes
- **Audit Trail**: Complete logging of all rating submissions

## Future Enhancements

- [ ] Integration with Property Management Systems (PMS)
- [ ] Push notifications for badges and achievements
- [ ] Voice feedback option for guests
- [ ] AI-powered insights and recommendations
- [ ] Multi-language support
- [ ] Offline mode with sync capabilities
- [ ] Advanced analytics with machine learning
- [ ] Integration with HR systems for performance reviews

## Security Considerations

- All guest data is anonymized and stored securely
- GDPR compliance for data privacy
- Secure token generation for QR codes
- Rate limiting and DDoS protection
- Regular security audits and updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@hotel-gamification.com or create an issue in the repository.

---

**Built with ❤️ for the hospitality industry**
