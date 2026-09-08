import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Header } from '../../components/Header';
import { fetchGroupPendingRequests, approveGroupMember } from '../../services/groupService';
import { theme } from '../../theme';

interface GroupPendingRequestsProps {
  navigation: any;
  route: any;
}

export const GroupPendingRequests: React.FC<GroupPendingRequestsProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [requests, setRequests] = useState<any[]>([]);

  const loadRequests = async () => {
    const data = await fetchGroupPendingRequests(groupId);
    if (data) setRequests(data);
  };

  useEffect(() => {
    loadRequests();
  }, [groupId]);

  const handleApprove = async (memberId: string) => {
    await approveGroupMember(groupId, memberId);
    loadRequests();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Pending Requests"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={requests}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.profiles?.full_name}</Text>
              <TouchableOpacity style={styles.approveButton} onPress={() => handleApprove(item.id)}>
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
            </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.grayLight,
  },
  info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  approveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 6,
  },
  approveText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
});
