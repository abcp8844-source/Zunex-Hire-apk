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
import { supabase } from '../../services/postService';
import { FB_REACTIONS } from '../../constants/reactions';

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
      setActiveTab('all');
      fetchReactionSummary();
      fetchUsers('all');
    }
  }, [visible, postId]);

  const fetchReactionSummary = async () => {
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('like, love, care, haha, wow, sad, angry')
        .eq('post_id', postId);

      if (!error && data) {
        const counts: Record<string, number> = {
          like: 0,
          love: 0,
          care: 0,
          haha: 0,
          wow: 0,
          sad: 0,
          angry: 0,
        };

        data.forEach((row: any) => {
          if (row.like) counts.like++;
          if (row.love) counts.love++;
          if (row.care) counts.care++;
          if (row.haha) counts.haha++;
          if (row.wow) counts.wow++;
          if (row.sad) counts.sad++;
          if (row.angry) counts.angry++;
        });

        const dynamicTabs: ReactionTab[] = [
          { type: 'all', label: `All ${totalReactions || data.length}`, count: totalReactions || data.length },
        ];

        const sortedReactionTypes = Object.keys(counts).sort(
          (a, b) => counts[b] - counts[a]
        );

        sortedReactionTypes.forEach((key) => {
          if (counts[key] > 0) {
            dynamicTabs.push({
              type: key,
              label: `${counts[key]}`,
              count: counts[key],
            });
          }
        });

        setTabs(dynamicTabs);
      }
    } catch (e) {
      console.error('Error fetching reaction summary:', e);
    }
  };

  const fetchUsers = async (filterType: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('likes')
        .select(`
          user_id,
          like, love, care, haha, wow, sad, angry,
          profiles ( full_name, avatar_url )
        `)
        .eq('post_id', postId);

      if (filterType !== 'all') {
        query = query.eq(filterType, true);
      }

      const { data, error } = await query;

      if (!error && data) {
        const formattedUsers: ReactionUser[] = data.map((item: any) => {
          let rType = 'like';
          if (filterType !== 'all') {
            rType = filterType;
          } else {
            if (item.love) rType = 'love';
            else if (item.care) rType = 'care';
            else if (item.haha) rType = 'haha';
            else if (item.wow) rType = 'wow';
            else if (item.sad) rType = 'sad';
            else if (item.angry) rType = 'angry';
          }

          const profile = item.profiles || {};
          return {
            user_id: item.user_id,
            full_name: profile.full_name || 'User',
            avatar_url: profile.avatar_url || 'https://via.placeholder.com/150',
            reaction_type: rType,
          };
        });

        setUsers(formattedUsers);
      }
    } catch (e) {
      console.error('Error fetching reaction users:', e);
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

  const renderReactionVisual = (reactionKey: string, sizeStyle: any) => {
    const meta = FB_REACTIONS[reactionKey];
    if (!meta) return null;
    if (meta.icon) {
      return <Image source={{ uri: meta.icon }} style={sizeStyle} />;
    }
    return <Text style={{ fontSize: sizeStyle.fontSize || 16 }}>{meta.emoji}</Text>;
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
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
                  {item.type !== 'all' && renderReactionVisual(item.type, { width: 18, height: 18, fontSize: 16 })}
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
                  <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                  <View style={styles.badgeContainer}>
                    {renderReactionVisual(item.reaction_type, { width: 16, height: 16, fontSize: 13 })}
                  </View>
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
  container: { flex: 1, backgroundColor: '#ffffff' },
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
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#050505' },
  tabContainer: { borderBottomWidth: 1, borderBottomColor: '#f0f2f5' },
  tabListContent: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
    gap: 6,
  },
  activeTabButton: { backgroundColor: '#e7f3ff' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#65676b' },
  activeTabText: { color: '#1877f2' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { paddingVertical: 8 },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatarWrapper: { position: 'relative', marginRight: 14 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e4e6eb' },
  badgeContainer: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 1,
  },
  userName: { fontSize: 16, fontWeight: '600', color: '#050505', flex: 1 },
});
