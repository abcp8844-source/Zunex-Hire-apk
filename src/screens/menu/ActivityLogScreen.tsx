import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchActivityLog } from '../../services/userService';
import { theme } from '../../theme';

interface ActivityLogScreenProps {
  navigation: any;
}

export const ActivityLogScreen: React.FC<ActivityLogScreenProps> = ({ navigation }) => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    fetchActivityLog().then((data) => {
      if (data) setLogs(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Activity Log"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={logs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.actionText}>{item.action_description}</Text>
            <Text style={styles.time}>{new Date(item.created_at).toLocaleString()}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  actionText: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
    marginBottom: 2,
  },
  time: {
    fontSize: theme.typography.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
});
