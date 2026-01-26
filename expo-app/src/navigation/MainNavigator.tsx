import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Home, Users, Calendar, User } from 'lucide-react-native';
import { View, Text } from 'react-native';

// Screens
import HomeScreen from '../screens/main/HomeScreen';
import SquadsScreen from '../screens/main/SquadsScreen';
import SessionsScreen from '../screens/main/SessionsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SquadDetailScreen from '../screens/squads/SquadDetailScreen';
import CreateSquadScreen from '../screens/squads/CreateSquadScreen';
import ProposeSessionScreen from '../screens/sessions/ProposeSessionScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Home Stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SquadDetail" component={SquadDetailScreen} />
      <Stack.Screen name="CreateSquad" component={CreateSquadScreen} />
      <Stack.Screen name="ProposeSession" component={ProposeSessionScreen} />
    </Stack.Navigator>
  );
}

// Squads Stack
function SquadsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SquadsMain" component={SquadsScreen} />
      <Stack.Screen name="SquadDetail" component={SquadDetailScreen} />
      <Stack.Screen name="CreateSquad" component={CreateSquadScreen} />
    </Stack.Navigator>
  );
}

// Sessions Stack
function SessionsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SessionsMain" component={SessionsScreen} />
      <Stack.Screen name="ProposeSession" component={ProposeSessionScreen} />
    </Stack.Navigator>
  );
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FDFCFB',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(120, 113, 108, 0.10)',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#F59E0B',
        tabBarInactiveTintColor: 'rgba(28, 25, 23, 0.50)',
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          
          switch (route.name) {
            case 'Home':
              IconComponent = Home;
              break;
            case 'Squads':
              IconComponent = Users;
              break;
            case 'Sessions':
              IconComponent = Calendar;
              break;
            case 'Profile':
              IconComponent = User;
              break;
            default:
              IconComponent = Home;
          }

          return <IconComponent size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Squads" 
        component={SquadsStack}
        options={{ tabBarLabel: 'Squads' }}
      />
      <Tab.Screen 
        name="Sessions" 
        component={SessionsStack}
        options={{ tabBarLabel: 'Sessions' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStack}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}
