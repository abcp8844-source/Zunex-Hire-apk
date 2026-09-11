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
      fetchReactionSummary();
      fetchUsers('all');
    }
  }, [visible, postId]);

  // فیچ کریں تمام ری ایکشنز کی گنتی تاکہ فیس بک کی طرح ٹیبز بن سکیں
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
          { type: 'all', label: `All ${totalReactions}`, count: totalReactions },
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
      console.error("Error fetching reaction summary:", e);
    }
  };

  // یوزرز کی لسٹ اور ان کی پروفائل ڈیٹابیس سے نکالنا
  const fetchUsers = async (filterType: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('likes')
        .select(`
          user_id,
          like, love, care, haha, wow, sad, angry,
          auth_users:user_id ( raw_user_meta_data )
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

          const meta = item.auth_users?.raw_user_meta_data || {};
          return {
            user_id: item.user_id,
            full_name: meta.full_name || 'Facebook User',
            avatar_url: meta.avatar_url || 'https://via.placeholder.com/150',
            reaction_type: rType,
          };
        });

        setUsers(formattedUsers);
      }
    } catch (e) {
      console.error("Error fetching reaction users:", e);
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
        {/* ہیڈر سیکشن */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Ionicons name="chevron-back" size={26} color="#050505" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reactions</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* فیس بک جیسے اوپر والے ٹیبز (All, Like, Love وغیرہ) */}
        <View style={styles.tabContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tabs}
            keyExtractor={(item) => item.type}
            contentContainerStyle={styles.tabListContent}
            renderItem={({ item }) => {
              const isActive = activeTab === item.type;
              const reactionInfo = FB_REACTIONS[item.type];
              return (
                <TouchableOpacity
                  style={[styles.tabButton, isActive && styles.activeTabButton]}
                  onPress={() => handleTabChange(item.type)}
                >
                  {reactionInfo && (
                    <Image source={{ uri: reactionInfo.icon }} style={styles.tabIcon} />
                  )}
                  <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* لوڈنگ یا یوزرز کی لسٹ */}
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#1877f2" />
          </View>
        ) : (
          <FlatList
            data={users}
            keyExtractor={(item) => item.user_id}
            renderItem={({ item }) => {
              const userReactionInfo = FB_REACTIONS[item.reaction_type];
              return (
                <TouchableOpacity
                  style={styles.userRow}
                  onPress={() => handleUserPress(item.user_id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.avatarWrapper}>
                    <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
                    {userReactionInfo && (
                      <Image source={{ uri: userReactionInfo.icon }} style={styles.badgeIcon} />
                    )}
                  </View>
                  <Text style={styles.userName} numberOfLines={1}>
                    {item.full_name}
                  </Text>
                </TouchableOpacity>
              );
            }}
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
  tabIcon: { width: 20, height: 20, borderRadius: 10 },
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
  badgeIcon: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  userName: { fontSize: 16, fontWeight: '600', color: '#050505', flex: 1 },
});
