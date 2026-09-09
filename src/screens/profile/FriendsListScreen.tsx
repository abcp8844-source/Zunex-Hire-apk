import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Header } from '../../components/Header';
import { fetchFriendsList } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface FriendsListScreenProps {
  navigation: any;
}

export const FriendsListScreen: React.FC<FriendsListScreenProps> = ({ navigation }) => {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFriends = async () => {
      try {
        const data = await fetchFriendsList();
        if (data) setFriends(data);
      } catch (error: any) {
        Alert.alert('Error', 'Unable to fetch friends list.');
      } finally {
        setLoading(false);
      }
    };

    loadFriends();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Friends"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      <View style={styles.subHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('FindFriends')} activeOpacity={0.7}>
          <Text style={styles.findText}>Find Friends</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={friends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const profile = item.profiles || {};
            return (
              <View style={styles.friendItem}>
                <Image 
                  source={{ uri: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500' }} 
                  style={styles.avatar} 
                />
                <Text style={styles.name}>{profile.full_name || 'Facebook User'}</Text>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>You don't have any friends added yet.</Text>
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
  subHeader: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card || '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
  },
  findText: {
    color: theme.colors.primary || '#1e293b',
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.md,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e5e7eb',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight || '#f3f4f6',
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
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
