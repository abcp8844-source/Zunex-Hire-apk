import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { fetchFriendRequests, acceptFriendRequest } from '../../services/userService';
import { theme } from '../../theme';

interface FriendRequestsScreenProps {
  navigation: any;
}

export const FriendRequestsScreen: React.FC<FriendRequestsScreenProps> = ({ navigation }) => {
  const [requests, setRequests] = useState<any[]>([]);

  const loadRequests = async () => {
    const data = await fetchFriendRequests();
    if (data) setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    await acceptFriendRequest(requestId);
    loadRequests();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Friend Requests"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.profiles?.full_name}</Text>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item.id)}>
                <Text style={styles.acceptText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight,
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
  acceptButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
  },
  acceptText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
});
