import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { searchUsers, searchPosts, searchGroups } from '../../services/userService';
import { theme } from '../../theme';

interface GlobalSearchScreenProps {
  navigation: any;
}

export const GlobalSearchScreen: React.FC<GlobalSearchScreenProps> = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'posts' | 'groups'>('users');

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    let data = [];
    if (activeTab === 'users') {
      data = await searchUsers(text);
    } else if (activeTab === 'posts') {
      data = await searchPosts(text);
    } else {
      data = await searchGroups(text);
    }
    if (data) setResults(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search Zunexhire..."
          placeholderTextColor={theme.colors.textSecondary}
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
      </View>
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => { setActiveTab('users'); handleSearch(query); }}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => { setActiveTab('posts'); handleSearch(query); }}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'groups' && styles.activeTab]}
          onPress={() => { setActiveTab('groups'); handleSearch(query); }}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.activeTabText]}>Groups</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.resultItem}
            onPress={() => {
              if (activeTab === 'users') navigation.navigate('Profile', { userId: item.id });
              else if (activeTab === 'groups') navigation.navigate('GroupDetail', { groupId: item.id });
            }}
          >
            {activeTab === 'users' && (
              <Image source={{ uri: item.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            )}
            <View>
              <Text style={styles.resultTitle}>{item.full_name || item.name || 'Post Content'}</Text>
              <Text style={styles.resultSubtitle}>{item.bio || item.content || item.description || ''}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 40,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.card,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    marginRight: theme.spacing.md,
  },
  backText: {
    fontSize: 22,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  searchInput: {
    flex: 1,
    height: 38,
    backgroundColor: theme.colors.background,
    borderRadius: 19,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight,
  },
  resultTitle: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  resultSubtitle: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
});
