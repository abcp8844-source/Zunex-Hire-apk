import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { Ionicons } from '@expo/vector-icons';

interface UserAboutScreenProps {
  navigation: any;
}

export const UserAboutScreen: React.FC<UserAboutScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Header
        title="About"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      <View style={styles.emptyContainer}>
        <Ionicons name="information-circle-outline" size={54} color="#8a8d91" />
        <Text style={styles.emptyTitle}>About Section</Text>
        <Text style={styles.emptySubText}>
          Personal details are available in Edit Profile. Additional about options will appear here.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#050505',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#65676b',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
});
