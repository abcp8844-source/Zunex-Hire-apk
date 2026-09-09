import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { fetchFriendRequests, acceptFriendRequest } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface FriendRequestsScreenProps {
  navigation: any;
}

export const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchFriendRequests();
      if (data) setRequests(data);
    } catch (error: any) {
      Alert.alert('Error', 'Unable to fetch friend requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    setActionId(requestId);
    try {
      await acceptFriendRequest(requestId);
      setRequests((prev) => prev.filter((item) => item.id !== requestId));
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Could not accept friend request.');
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
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Image 
                source={{ uri: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' }} 
                style={styles.avatar} 
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.profiles?.full_name || 'User'}</Text>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity 
                    style={[styles.acceptButton, actionId === item.id && styles.disabledButton]} 
                    onPress={() => handleAccept(item.id)}
                    disabled={actionId === item.id}
                    activeOpacity={0.8}
                  >
                    {actionId === item.id ? (
                      <Loader />
                    ) : (
                      <Text style={styles.acceptText}>Confirm</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
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
    backgroundColor: theme.colors.background || '#f9fafb',
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
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: theme.colors.primary || '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.md,
  },
});
