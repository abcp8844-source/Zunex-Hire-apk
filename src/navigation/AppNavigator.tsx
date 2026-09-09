import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { MainTabs } from './MainTabs';

import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { PersonalDetailsScreen } from '../screens/profile/PersonalDetailsScreen';
import { UserAboutScreen } from '../screens/profile/UserAboutScreen';
import { FriendsListScreen } from '../screens/profile/FriendsListScreen';
import { FindFriendsScreen } from '../screens/profile/FindFriendsScreen';
import { ProfilePhotosScreen } from '../screens/profile/ProfilePhotosScreen';
import { FriendRequestsScreen } from '../screens/profile/FriendRequestsScreen';

import { SettingsScreen } from '../screens/menu/SettingsScreen';
import { ActivityLogScreen } from '../screens/menu/ActivityLogScreen';
import { BlockedUsersScreen } from '../screens/menu/BlockedUsersScreen';
import { HelpSupportScreen } from '../screens/menu/HelpSupportScreen';
import { GlobalSearchScreen } from '../screens/interactions/GlobalSearchScreen';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  session: any;
}

export const AppNavigator: React.FC<AppNavigatorProps> = ({ session }) => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
            <Stack.Screen name="UserAbout" component={UserAboutScreen} />
            <Stack.Screen name="FriendsList" component={FriendsListScreen} />
            <Stack.Screen name="FindFriends" component={FindFriendsScreen} />
            <Stack.Screen name="ProfilePhotos" component={ProfilePhotosScreen} />
            <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
            <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="GlobalSearch" component={GlobalSearchScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
