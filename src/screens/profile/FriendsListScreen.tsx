import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { fetchFriendsList } from '../../services/userService';
import { theme } from '../../theme';

interface FriendsListScreenProps {
  navigation: any;
}

export const FriendsListScreen: React.FC<FriendsListScreenProps> = ({ navigation }) => {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    fetchFriendsList().then((data) => {
      if (data) setFriends(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Friends"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('FindFriends')}>
          <Text style={styles.findText}>Find Friends</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.friendItem}>
            <Image source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <Text style={styles.name}>{item.full_name}</Text>
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
  subHeader: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  findText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.md,
  },
  friendItem: {
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
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});
