import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { theme } from '../../theme';

interface HelpSupportScreenProps {
  navigation: any;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="Help & Support"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.card}>
        <Text style={styles.title}>Zunexhire Support Center</Text>
        <Text style={styles.text}>For any queries, feedback, or assistance, please reach out to our dedicated support team at support@zunexhire.com.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  card: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  text: {
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.textSecondary,
    lineHeight: 22,
  },
});
