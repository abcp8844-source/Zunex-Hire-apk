import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { theme } from '../../theme';

interface ManageGroupScreenProps {
  navigation: any;
  route: any;
}

export const ManageGroupScreen: React.FC<ManageGroupScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;

  return (
    <View style={styles.container}>
      <Header
        title="Manage Group"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('GroupPendingRequests', { groupId })}
        >
          <Text style={styles.menuText}>Pending Requests</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('GroupSettings', { groupId })}
        >
          <Text style={styles.menuText}>Group Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('GroupScheduledPosts', { groupId })}
        >
          <Text style={styles.menuText}>Scheduled Posts</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    backgroundColor: theme.colors.card,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  menuItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
});
