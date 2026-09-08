import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../theme';

interface HeaderProps {
  title: string;
  onSearchPress: () => void;
  onMenuPress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onSearchPress, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.button} onPress={onSearchPress}>
          <Text style={styles.buttonText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onMenuPress}>
          <Text style={styles.buttonText}>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    backgroundColor: theme.colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: 'row',
  },
  button: {
    width: 36,
    height: 36,
    backgroundColor: theme.colors.background,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  buttonText: {
    fontSize: 16,
  },
});
