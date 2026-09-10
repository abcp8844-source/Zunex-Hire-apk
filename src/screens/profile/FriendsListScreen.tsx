import { Loader } from '../../components/Loader';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../components/Header';
import { fetchUserFriends, removeFriend } from '../../services/userService';
import { theme } from '../../theme';

interface FriendsListScreenProps {
  navigation: any;
  route?: any;
}

const PAGE_SIZE = 50;

export const FriendsListScreen: React.FC<FriendsListScreenProps> = ({ navigation, route }) => {
  const [totalCount, setTotalCount] = useState<number>(0);
  const [displayedFriends, setDisplayedFriends] = useState<any[]>([]);
  const [allFriends, setAllFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const targetUserId = route?.params?.userId;

  useEffect(() => {
    loadInitialFriends();
  }, [targetUserId]);

  const loadInitialFriends = async () => {
    try {
      setLoading(true);
      const data = await fetchUserFriends(targetUserId);
      if (data) {
        setAllFriends(data);
        setTotalCount(data.length);
        setDisplayedFriends(data.slice(0, PAGE_SIZE));
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to load friends.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (loadingMore || searchQuery.length > 0) return;

    const currentLength = displayedFriends.length;
    if (currentLength < allFriends.length) {
      setLoadingMore(true);
      const nextBatch = allFriends.slice(currentLength, currentLength + PAGE_SIZE);
      setDisplayedFriends((prev) => [...prev, ...nextBatch]);
      setLoadingMore(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setDisplayedFriends(allFriends.slice(0, PAGE_SIZE));
    } else {
      const filtered = allFriends.filter((friend) =>
        friend.full_name?.toLowerCase().includes(text.toLowerCase())
      );
      setDisplayedFriends(filtered);
    }
  };

  const handleUnfriend = (friendId: string, friendName: string) => {
    Alert.alert(
      'Remove Friend',
      `Are you sure you want to remove ${friendName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeFriend(friendId);
              const updatedAll = allFriends.filter((f) => f.id !== friendId);
              setAllFriends(updatedAll);
              setTotalCount(updatedAll.length);
              setDisplayedFriends((prev) => prev.filter((f) => f.id !== friendId));
            } catch (error) {
              Alert.alert('Error', 'Failed to remove friend.');
            }
          },
        },
      ]
    );
  };

  const renderFriendItem = ({ item }: { item: any }) => (
    <View style={styles.friendCard}>
      <TouchableOpacity
        style={styles.friendInfo}
        onPress={() => navigation.navigate('Profile', { userId: item.id })}
      >
        <Image
          source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }}
          style={styles.avatar}
        />
        <View style={styles.nameContainer}>
          <Text style={styles.friendName}>{item.full_name || 'Zunexhire User'}</Text>
          {item.mutual_friends !== undefined && (
            <Text style={styles.mutualText}>{item.mutual_friends} mutual friends</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.moreOptionsBtn}
        onPress={() => handleUnfriend(item.id, item.full_name)}
      >
        <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary || '#65676b'} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Friends"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={18} color="#65676b" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search Friends"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#65676b"
        />
      </View>

      <View style={styles.countContainer}>
        <Text style={styles.countText}>{totalCount} Friends</Text>
        <TouchableOpacity onPress={() => navigation.navigate('FindFriends')}>
          <Text style={styles.findFriendsLink}>Find Friends</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={displayedFriends}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderFriendItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <Loader />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No friends found</Text>
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
    backgroundColor: '#ffffff',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#050505',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e4e6eb',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  findFriendsLink: {
    fontSize: 14,
    color: '#1877f2',
    fontWeight: '600',
  },
  listContent: {
    paddingVertical: 8,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f2f5',
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#050505',
  },
  mutualText: {
    fontSize: 12,
    color: '#65676b',
    marginTop: 2,
  },
  moreOptionsBtn: {
    padding: 8,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#65676b',
  },
});
