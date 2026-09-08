import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { fetchNonFriends, sendFriendRequest } from '../../services/userService';
import { theme } from '../../theme';

interface FindFriendsScreenProps {
  navigation: any;
}

export const FindFriendsScreen: React.FC<FindFriendsScreenProps> = ({ navigation }) => {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const data = await fetchNonFriends();
    if (data) setUsers(data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAdd = async (userId: string) => {
    await sendFriendRequest(userId);
    loadUsers();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Find Friends"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Image source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.full_name}</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => handleAdd(item.id)}>
                <Text style={styles.addText}>Add Friend</Text>
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
  userItem: {
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
  addButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
  },
  addText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
});
