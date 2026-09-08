import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchGroupDetails, fetchGroupPosts } from '../../services/groupService';
import { PostCard } from '../feed/PostCard';
import { theme } from '../../theme';

interface GroupDetailScreenProps {
  navigation: any;
  route: any;
}

export const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);

  const loadData = async () => {
    const groupData = await fetchGroupDetails(groupId);
    if (groupData) setGroup(groupData);
    const groupPosts = await fetchGroupPosts(groupId);
    if (groupPosts) setPosts(groupPosts);
  };

  useEffect(() => {
    loadData();
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Header
        title={group?.name || 'Group'}
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.title}>{group?.name}</Text>
            <Text style={styles.description}>{group?.description}</Text>
            <View style={styles.navRow}>
              <TouchableOpacity onPress={() => navigation.navigate('GroupMembers', { groupId })}>
                <Text style={styles.navText}>Members</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('GroupMedia', { groupId })}>
                <Text style={styles.navText}>Media</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('ManageGroup', { groupId })}>
                <Text style={styles.navText}>Manage</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => <PostCard post={item} onUpdate={loadData} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  navText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.md,
  },
});
