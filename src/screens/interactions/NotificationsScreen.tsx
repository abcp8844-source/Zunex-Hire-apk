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

  const handlePress = async (item: any) => {
    if (!item.is_read) {
      await markNotificationAsRead(item.id);
      loadNotifications();
    }

    if (item.post_id) {
      // Navigate to post detail screen
      // navigation.navigate('PostDetail', { postId: item.post_id });
    } else if (item.sender_id) {
      navigation.navigate('Profile', { userId: item.sender_id });
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
            onPress={() => handlePress(item)}
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
            {!item.is_read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background || '#f0f2f5',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card || '#ffffff',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border || '#e4e6eb',
  },
  unreadItem: {
    backgroundColor: '#e7f3ff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: '#e4e6eb',
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
    marginTop: 2,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary || '#1877f2',
    marginLeft: theme.spacing.sm,
  },
});
