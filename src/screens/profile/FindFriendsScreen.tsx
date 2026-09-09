import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Header } from '../../components/Header';
import { fetchNonFriends, sendFriendRequest } from '../../services/userService';
import { theme } from '../../theme';

interface FindFriendsScreenProps {
  navigation: any;
}

export const FindFriendsScreen: React.FC<FindFriendsScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchNonFriends();
      if (data) setUsers(data);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to fetch suggestions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (userId: string) => {
    setRequestingId(userId);
    try {
      await sendFriendRequest(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not send friend request.');
    } finally {
      setRequestingId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Find Friends"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary || '#1e293b'} />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              <Image 
                source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' }} 
                style={styles.avatar} 
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.full_name}</Text>
                <TouchableOpacity 
                  style={[styles.addButton, requestingId === item.id && styles.buttonDisabled]} 
                  onPress={() => handleAdd(item.id)}
                  disabled={requestingId === item.id}
                  activeOpacity={0.8}
                >
                  {requestingId === item.id ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.addText}>Add Friend</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No new suggestions available.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f9fafb',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  addButton: {
    backgroundColor: theme.colors.primary || '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  addText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.md,
  },
});
