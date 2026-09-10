import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { fetchNonFriends, sendFriendRequest } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface FindFriendsScreenProps {
  navigation: any;
}

export const FindFriendsScreen: React.FC<FindFriendsScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [requestingId, setRequestingId] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const data = await fetchNonFriends();
      if (data) setUsers(data);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to fetch suggestions. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

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
          <Loader />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <View style={styles.userItem}>
              {item.avatar_url ? (
                <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={28} color={theme.colors.textSecondary} />
                </View>
              )}

              <View style={styles.info}>
                <View style={styles.textContainer}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.full_name || 'Zunexhire User'}
                  </Text>
                  {item.city ? (
                    <Text style={styles.subText} numberOfLines={1}>
                      {item.city}
                    </Text>
                  ) : null}
                  {item.mutual_friends_count ? (
                    <Text style={styles.mutualText}>
                      {item.mutual_friends_count} mutual friends
                    </Text>
                  ) : null}
                </View>

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
              <Ionicons name="people-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No new friend suggestions right now.</Text>
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
    backgroundColor: theme.colors.background,
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
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
  },
  avatarPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  mutualText: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 100,
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
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.md,
    marginTop: 10,
    textAlign: 'center',
  },
});
