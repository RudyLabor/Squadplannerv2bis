import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { UserProvider } from './src/contexts/UserContext';
import { TranslationProvider } from './src/contexts/TranslationContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TranslationProvider>
          <AuthProvider>
            <UserProvider>
              <NavigationContainer>
                <StatusBar style="dark" backgroundColor="#F5F3F0" />
                <RootNavigator />
              </NavigationContainer>
            </UserProvider>
          </AuthProvider>
        </TranslationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
