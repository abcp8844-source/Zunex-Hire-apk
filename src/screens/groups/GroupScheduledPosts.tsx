import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchScheduledPosts } from '../../services/groupService';
import { theme } from '../../theme';

interface GroupScheduledPostsProps {
  navigation: any;
  route: any;
}

export const GroupScheduledPosts: React.FC<GroupScheduledPostsProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetchScheduledPosts(groupId).then((data) => {
      if (data) setPosts(data);
    });
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Header
        title="Scheduled Posts"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.time}>Scheduled for: {new Date(item.scheduled_at).toLocaleString()}</Text>
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
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xs,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  content: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  time: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
});
