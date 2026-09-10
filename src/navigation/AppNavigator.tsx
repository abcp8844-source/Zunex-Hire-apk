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

import { GroupDetailScreen } from '../screens/groups/GroupDetailScreen';
import { CreateGroupScreen } from '../screens/groups/CreateGroupScreen';
import { ManageGroupScreen } from '../screens/groups/ManageGroupScreen';
import { GroupMembersScreen } from '../screens/groups/GroupMembersScreen';
import { GroupPendingRequests } from '../screens/groups/GroupPendingRequests';
import { GroupSettingsScreen } from '../screens/groups/GroupSettingsScreen';
import { GroupScheduledPosts } from '../screens/groups/GroupScheduledPosts';
import { GroupMediaScreen } from '../screens/groups/GroupMediaScreen';

import { SettingsScreen } from '../screens/menu/SettingsScreen';
import { ActivityLogScreen } from '../screens/menu/ActivityLogScreen';
import { BlockedUsersScreen } from '../screens/menu/BlockedUsersScreen';
import { HelpSupportScreen } from '../screens/menu/HelpSupportScreen';
import { GlobalSearchScreen } from '../screens/interactions/GlobalSearchScreen';

import { MediaViewerScreen } from '../screens/feed/MediaViewerScreen';
import { EditPostScreen } from '../screens/feed/EditPostScreen';

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
            
            <Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
            <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
            <Stack.Screen name="ManageGroup" component={ManageGroupScreen} />
            <Stack.Screen name="GroupMembers" component={GroupMembersScreen} />
            <Stack.Screen name="GroupPendingRequests" component={GroupPendingRequests} />
            <Stack.Screen name="GroupSettings" component={GroupSettingsScreen} />
            <Stack.Screen name="GroupScheduledPosts" component={GroupScheduledPosts} />
            <Stack.Screen name="GroupMedia" component={GroupMediaScreen} />
            
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ActivityLog" component={ActivityLogScreen} />
            <Stack.Screen name="BlockedUsers" component={BlockedUsersScreen} />
            <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
            <Stack.Screen name="GlobalSearch" component={GlobalSearchScreen} />

            <Stack.Screen name="MediaViewer" component={MediaViewerScreen} />
            <Stack.Screen name="EditPost" component={EditPostScreen} />
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
