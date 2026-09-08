import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { GroupsHomeScreen } from '../screens/groups/GroupsHomeScreen';
import { NotificationsScreen } from '../screens/interactions/NotificationsScreen';
import { MenuScreen } from '../screens/menu/MenuScreen';
import { theme } from '../theme';

const Tab = createBottomTabNavigator();

export const MainTabs: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen 
        name="Feed" 
        component={FeedScreen} 
      />
      <Tab.Screen 
        name="GroupsHome" 
        component={GroupsHomeScreen} 
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen} 
      />
    </Tab.Navigator>
  );
};
