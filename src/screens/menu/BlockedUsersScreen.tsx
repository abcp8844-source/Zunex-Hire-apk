import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Header } from '../../components/Header';
import { fetchBlockedUsers, unblockUser } from '../../services/userService';
import { theme } from '../../theme';

interface BlockedUsersScreenProps {
  navigation: any;
}

export const BlockedUsersScreen: React.FC<BlockedUsersScreenProps> = ({ navigation }) => {
  const [blocked, setBlocked] = useState<any[]>([]);

  const loadBlocked = async () => {
    const data = await fetchBlockedUsers();
    if (data) setBlocked(data);
  };

  useEffect(() => {
    loadBlocked();
  }, []);

  const handleUnblock = async (userId: string) => {
    await unblockUser(userId);
    loadBlocked();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Blocked Users"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={blocked}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.full_name}</Text>
              <TouchableOpacity style={styles.unblockButton} onPress={() => handleUnblock(item.id)}>
                <Text style={styles.unblockText}>Unblock</Text>
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
    width: 50,
    height: 50,
    borderRadius: 25,
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
  unblockButton: {
    backgroundColor: theme.colors.grayLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
  },
  unblockText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
});
