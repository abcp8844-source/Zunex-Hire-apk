import { Loader } from '../../components/Loader';
import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { searchUsers } from '../../services/userService';
import { searchPosts } from '../../services/postService';
import { searchGroups } from '../../services/groupService';
import { theme } from '../../theme';
import { Ionicons } from '@expo/vector-icons';

interface GlobalSearchScreenProps {
  navigation: any;
}

export const GlobalSearchScreen: React.FC<GlobalSearchScreenProps> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'people' | 'posts' | 'groups'>('all');
  
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setUsers([]);
      setPosts([]);
      setGroups([]);
      return;
    }

    setLoading(true);
    try {
      const [userData, postData, groupData] = await Promise.all([
        searchUsers(text),
        searchPosts(text),
        searchGroups(text),
      ]);

      setUsers(userData || []);
      setPosts(postData || []);
      setGroups(groupData || []);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCombinedResults = () => {
    let results: any[] = [];
    if (activeFilter === 'all' || activeFilter === 'people') {
      results = results.concat(users.map(item => ({ ...item, searchType: 'user' })));
    }
    if (activeFilter === 'all' || activeFilter === 'posts') {
      results = results.concat(posts.map(item => ({ ...item, searchType: 'post' })));
    }
    if (activeFilter === 'all' || activeFilter === 'groups') {
      results = results.concat(groups.map(item => ({ ...item, searchType: 'group' })));
    }
    return results;
  };

  const results = getCombinedResults();

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Zunexhire (People, Posts, Groups)..."
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {(['all', 'people', 'posts', 'groups'] as const).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterChipText, activeFilter === filter && styles.activeFilterChipText]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.searchType}-${item.id || index}`}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => {
                  if (item.searchType === 'user') {
                    navigation.navigate('Profile', { userId: item.id });
                  } else if (item.searchType === 'group') {
                    navigation.navigate('GroupDetail', { groupId: item.id });
                  } else if (item.searchType === 'post') {
                    // Post navigation logic
                  }
                }}
              >
                {item.searchType === 'user' && (
                  <Image source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
                )}
                {item.searchType === 'group' && (
                  <View style={[styles.avatar, styles.groupAvatarContainer]}>
                    <Ionicons name="people" size={22} color="#ffffff" />
                  </View>
                )}
                {item.searchType === 'post' && (
                  <View style={[styles.avatar, styles.postAvatarContainer]}>
                    <Ionicons name="document-text" size={22} color="#ffffff" />
                  </View>
                )}

                <View style={styles.resultTextContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.resultTitle}>
                      {item.full_name || item.name || 'Zunexhire Post'}
                    </Text>
                    <Text style={styles.badgeText}>
                      {item.searchType.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.resultSubtitle} numberOfLines={1}>
                    {item.bio || item.content || item.description || 'No additional details'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            query.trim() !== '' ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={50} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>No matching results for "{query}"</Text>
                <Text style={styles.emptySubText}>We searched everywhere, but found nothing close.</Text>
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="compass-outline" size={50} color={theme.colors.textSecondary} />
                <Text style={styles.emptyText}>Type anything to search on Zunexhire</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f0f2f5',
    paddingTop: 40,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card || '#ffffff',
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e4e6eb',
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.background || '#f0f2f5',
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  clearButton: {
    marginLeft: theme.spacing.sm,
  },
  filtersWrapper: {
    backgroundColor: theme.colors.card || '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e4e6eb',
    paddingVertical: 8,
  },
  filtersRow: {
    paddingHorizontal: theme.spacing.md,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: theme.colors.background || '#f0f2f5',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border || '#e4e6eb',
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary || '#1877f2',
    borderColor: theme.colors.primary || '#1877f2',
  },
  filterChipText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: '600',
  },
  activeFilterChipText: {
    color: '#ffffff',
  },
  loaderContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#f0f2f5',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: '#e4e6eb',
  },
  groupAvatarContainer: {
    backgroundColor: '#2e89ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  postAvatarContainer: {
    backgroundColor: '#42b72a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTextContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  resultSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyText: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
});
