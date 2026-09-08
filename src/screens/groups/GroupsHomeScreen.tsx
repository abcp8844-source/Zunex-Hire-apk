import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserGroups, fetchExploreGroups } from '../../services/groupService';
import { theme } from '../../theme';

interface GroupsHomeScreenProps {
  navigation: any;
}

export const GroupsHomeScreen: React.FC<GroupsHomeScreenProps> = ({ navigation }) => {
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [exploreGroups, setExploreGroups] = useState<any[]>([]);

  const loadGroups = async () => {
    const userGroups = await fetchUserGroups();
    if (userGroups) setMyGroups(userGroups);
    const otherGroups = await fetchExploreGroups();
    if (otherGroups) setExploreGroups(otherGroups);
  };

  useEffect(() => {
    loadGroups();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Groups"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => navigation.navigate('CreateGroup')}
        >
          <Text style={styles.createButtonText}>+ Create Group</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={myGroups}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={<Text style={styles.sectionTitle}>Your Groups</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.groupItem}
            onPress={() => navigation.navigate('GroupDetail', { groupId: item.id })}
          >
            <Text style={styles.groupName}>{item.name}</Text>
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
  actionRow: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    padding: theme.spacing.md,
  },
  groupItem: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  groupName: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});
