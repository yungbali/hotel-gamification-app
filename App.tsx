import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { configureAmplify } from './src/services/amplifyClient';
import { AmplifyAuthService } from './src/services/amplifyAuthService';
import { AmplifyDataService } from './src/services/amplifyDataService';
import { User } from './src/types';
import LoginScreen from './src/screens/LoginScreen';
import WaiterDashboard from './src/screens/WaiterDashboard';
import ManagerDashboard from './src/screens/ManagerDashboard';
import SupervisorDashboard from './src/screens/SupervisorDashboard';
import AddWaiterScreen from './src/screens/AddWaiterScreen';
import SetupScreen from './src/screens/SetupScreen';
import QRCodeScreen from './src/screens/QRCodeScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import LoadingScreen from './src/screens/LoadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function WaiterTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'QR Code') {
            iconName = focused ? 'qr-code' : 'qr-code-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'home-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={WaiterDashboard} />
      <Tab.Screen name="QR Code" component={QRCodeScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function SupervisorTabs() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SupervisorMain" component={SupervisorDashboard} />
      <Stack.Screen name="AddWaiter" component={AddWaiterScreen} />
    </Stack.Navigator>
  );
}

function ManagerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Analytics') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Leaderboard') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'analytics-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

configureAmplify();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Initialize Amplify first
      await configureAmplify();
      
      const authService = AmplifyAuthService.getInstance();
      const dataService = AmplifyDataService.getInstance();
      
      // Check if system needs setup
      const needsSetup = await authService.checkSetupRequired();
      if (needsSetup) {
        setNeedsSetup(true);
        setIsLoading(false);
        return;
      }
      
      const isAuthenticated = await authService.isAuthenticated();
      
      if (isAuthenticated) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (user: User) => {
    setUser(user);
  };

  const handleLogout = async () => {
    const authService = AmplifyAuthService.getInstance();
    await authService.signOut();
    setUser(null);
  };

  const handleSetupComplete = () => {
    setNeedsSetup(false);
    checkAuthStatus();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {needsSetup ? (
              <Stack.Screen name="Setup">
                {(props) => <SetupScreen {...props} onSetupComplete={handleSetupComplete} />}
              </Stack.Screen>
            ) : !user ? (
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
            ) : user.role === 'waiter' ? (
              <Stack.Screen name="WaiterApp" component={WaiterTabs} />
            ) : user.role === 'supervisor' ? (
              <Stack.Screen name="SupervisorApp" component={SupervisorTabs} />
            ) : user.role === 'manager' ? (
              <Stack.Screen name="ManagerApp" component={ManagerTabs} />
            ) : (
              <Stack.Screen name="Login">
                {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
