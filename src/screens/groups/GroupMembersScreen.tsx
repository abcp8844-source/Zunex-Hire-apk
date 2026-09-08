import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { Header } from '../../components/Header';
import { fetchGroupMembers } from '../../services/groupService';
import { theme } from '../../theme';

interface GroupMembersScreenProps {
  navigation: any;
  route: any;
}

export const GroupMembersScreen: React.FC<GroupMembersScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchGroupMembers(groupId).then((data) => {
      if (data) setMembers(data);
    });
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Header
        title="Members"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={members}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.profiles?.avatar_url || 'https://via.placeholder.com/150' }} style={styles.avatar} />
            <Text style={styles.name}>{item.profiles?.full_name}</Text>
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
  name: {
    fontSize: theme.typography.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
});
