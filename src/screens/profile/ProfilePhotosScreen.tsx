import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet, Text } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserPhotos } from '../../services/userService';
import { Loader } from '../../components/Loader';
import { theme } from '../../theme';

interface ProfilePhotosScreenProps {
  navigation: any;
}

export const ProfilePhotosScreen: React.FC<ProfilePhotosScreenProps> = ({ navigation }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPhotos = async () => {
      try {
        const data = await fetchUserPhotos();
        if (data) setPhotos(data);
      } catch (error) {
        // Handle error silently or log if needed
      } finally {
        setLoading(false);
      }
    };

    loadPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Photos"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
      ) : (
        <FlatList
          data={photos}
          numColumns={3}
          keyExtractor={(item, index) => item.id?.toString() || index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item.image_url }} style={styles.photo} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No photos available.</Text>
            </View>
          }
          contentContainerStyle={photos.length === 0 ? styles.emptyListContainer : undefined}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '33.33%',
    height: 120,
    borderWidth: 1,
    borderColor: theme.colors.card,
    backgroundColor: theme.colors.grayLight,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.fontSizes.md,
  },
});
