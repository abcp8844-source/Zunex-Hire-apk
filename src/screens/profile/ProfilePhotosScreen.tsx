import { Loader } from '../../components/Loader';
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserPhotos } from '../../services/userService';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');
const COLUMN_SIZE = width / 3;

interface ProfilePhotosScreenProps {
  navigation: any;
}

export const ProfilePhotosScreen: React.FC<ProfilePhotosScreenProps> = ({ navigation }) => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPhotos = async () => {
    try {
      const data = await fetchUserPhotos();
      if (data) setPhotos(data);
    } catch (error) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadPhotos();
  };

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate('MediaViewer', { photoUrl: item.image_url })}
              style={styles.photoTile}
            >
              <Image source={{ uri: item.image_url }} style={styles.photo} resizeMode="cover" />
            </TouchableOpacity>
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
  photoTile: {
    width: COLUMN_SIZE,
    height: COLUMN_SIZE,
    padding: 1,
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: theme.colors.grayLight || theme.colors.card,
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
