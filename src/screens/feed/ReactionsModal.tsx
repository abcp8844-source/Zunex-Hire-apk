import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';

interface ReactionsModalProps {
  visible: boolean;
  postId: string;
  totalReactions: number;
  onClose: () => void;
  navigation?: any;
}

interface ReactionUser {
  user_id: string;
  full_name: string;
  avatar_url: string;
  reaction_type: string;
}

interface ReactionTab {
  type: string;
  label: string;
  count: number;
}

const REACTION_EMOJIS: Record<string, string> = {
  like: '👍',
  love: '❤️',
  care: '🥰',
  haha: '😆',
  wow: '😮',
  sad: '😢',
  angry: '😡',
};

export const ReactionsModal: React.FC<ReactionsModalProps> = ({
  visible,
  postId,
  totalReactions,
  onClose,
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [tabs, setTabs] = useState<ReactionTab[]>([]);
  const [users, setUsers] = useState<ReactionUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (visible && postId) {
      fetchReactionSummary();
      fetchUsers('all');
    }
  }, [visible, postId]);

  const fetchReactionSummary = async () => {
    try {
      const { data, error } = await supabase.rpc('get_post_top_reactions', {
        p_post_id: postId,
      });

      if (!error && data) {
        const dynamicTabs: ReactionTab[] = [
          { type: 'all', label: `All ${totalReactions}`, count: totalReactions },
          ...data.map((item: any) => ({
            type: item.reaction_type,
            label: `${REACTION_EMOJIS[item.reaction_type] || '👍'} ${item.reaction_count}`,
            count: item.reaction_count,
          })),
        ];
        setTabs(dynamicTabs);
      }
    } catch (e) {
      // Silent error
    }
  };

  const fetchUsers = async (filterType: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_post_reactions_detail', {
        p_post_id: postId,
        p_filter_type: filterType,
      });

      if (!error && data) {
        setUsers(data);
      }
    } catch (e) {
      // Silent error
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (type: string) => {
    setActiveTab(type);
    fetchUsers(type);
  };

  const handleUserPress = (userId: string) => {
    onClose();
    if (navigation && userId) {
      navigation.navigate('Profile', { userId });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reactions</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.tabContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tabs}
            keyExtractor={(item) => item.type}
            contentContainerStyle={styles.tabListContent}
            renderItem={({ item }) => {
              const isActive = activeTab === item.type;
              return (
                <TouchableOpacity
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  onPress={() => handleTabChange(item.type)}
                >
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1877f2" />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userRow}
                onPress={() => handleUserPress(item.user_id)}
                activeOpacity={0.7}
              >
                <View style={styles.avatarWrapper}>
                  <Image
                    source={{
                      uri: item.avatar_url || 'https://via.placeholder.com/150',
                    }}
                    style={styles.avatar}
                  />
                  <Text style={styles.badgeEmoji}>
                    {REACTION_EMOJIS[item.reaction_type] || '👍'}
                  </Text>
                </View>
                <Text style={styles.userName} numberOfLines={1}>
                  {item.full_name}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#050505',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f2f5',
  },
  tabListContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
  },
  activeTabButton: {
    backgroundColor: '#e7f3ff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#65676b',
  },
  activeTabText: {
    color: '#1877f2',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e4e6eb',
  },
  badgeEmoji: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    fontSize: 16,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#050505',
    flex: 1,
  },
});
