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
import { fetchFriendRequests, acceptFriendRequest, rejectFriendRequest } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface FriendRequestsScreenProps {
  navigation: any;
}

export const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadRequests = async () => {
    try {
      const data = await fetchFriendRequests();
      if (data) setRequests(data);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to fetch friend requests.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadRequests();
  };

  const handleAccept = async (requestId: string) => {
    setActionId(requestId);
    try {
      await acceptFriendRequest(requestId);
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not accept request.');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setActionId(requestId);
    try {
      await rejectFriendRequest(requestId);
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not delete request.');
    } finally {
      setActionId(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Friend Requests"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={requests}
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
            <View style={styles.item}>
              {item.profiles?.avatar_url ? (
                <Image source={{ uri: item.profiles.avatar_url }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={28} color={theme.colors.textSecondary} />
                </View>
              )}

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.profiles?.full_name || 'User'}
                </Text>

                <View style={styles.buttonGroup}>
                  <TouchableOpacity
                    style={[styles.acceptButton, actionId === item.id && styles.disabledButton]}
                    onPress={() => handleAccept(item.id)}
                    disabled={actionId === item.id}
                    activeOpacity={0.8}
                  >
                    {actionId === item.id ? (
                      <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                      <Text style={styles.acceptText}>Confirm</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.deleteButton, actionId === item.id && styles.disabledButton]}
                    onPress={() => handleReject(item.id)}
                    disabled={actionId === item.id}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.deleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="person-add-outline" size={48} color={theme.colors.textSecondary} />
              <Text style={styles.emptyText}>No pending friend requests.</Text>
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
  item: {
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
    justifyContent: 'center',
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
    minWidth: 85,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: theme.colors.grayLight || '#e4e6eb',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 6,
    minWidth: 85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  acceptText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  deleteText: {
    color: theme.colors.text,
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
  },
});
