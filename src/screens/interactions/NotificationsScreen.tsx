import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Header } from '../../components/Header';
import { fetchNotifications, markNotificationAsRead } from '../../services/notificationService';
import { theme } from '../../theme';

interface NotificationsScreenProps {
  navigation: any;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const loadNotifications = async () => {
    const data = await fetchNotifications();
    if (data) setNotifications(data);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handlePress = async (id: string, postId?: string) => {
    await markNotificationAsRead(id);
    loadNotifications();
    if (postId) {
      // Navigate to post or related detail if required
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Notifications"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.item, !item.is_read && styles.unreadItem]}
            onPress={() => handlePress(item.id, item.post_id)}
          >
            <Image
              source={{ uri: item.sender?.avatar_url || 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            <View style={styles.contentContainer}>
              <Text style={styles.text}>
                <Text style={styles.bold}>{item.sender?.full_name || 'Someone'}</Text> {item.message}
              </Text>
              <Text style={styles.time}>{new Date(item.created_at).toLocaleDateString()}</Text>
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
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  unreadItem: {
    backgroundColor: theme.colors.grayLight,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight,
  },
  contentContainer: {
    flex: 1,
  },
  text: {
    fontSize: theme.typography.fontSizes.sm,
    color: theme.colors.text,
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
  },
  time: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
});
