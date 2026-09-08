import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { updateGroupSettings } from '../../services/groupService';
import { theme } from '../../theme';

interface GroupSettingsScreenProps {
  navigation: any;
  route: any;
}

export const GroupSettingsScreen: React.FC<GroupSettingsScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [name, setName] = useState('');

  const handleSave = async () => {
    await updateGroupSettings(groupId, { name });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header
        title="Group Settings"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <View style={styles.form}>
        <Text style={styles.label}>Update Group Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="New name" />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  form: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },
  label: {
    fontSize: theme.typography.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 6,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    fontSize: theme.typography.fontSizes.md,
    color: theme.colors.text,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: theme.typography.fontSizes.sm,
  },
});
