import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchUserPhotos } from '../../services/userService';
import { theme } from '../../theme';

interface ProfilePhotosScreenProps {
  navigation: any;
}

export const ProfilePhotosScreen: React.FC<ProfilePhotosScreenProps> = ({ navigation }) => {
  const [photos, setPhotos] = useState<any[]>([]);

  useEffect(() => {
    fetchUserPhotos().then((data) => {
      if (data) setPhotos(data);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title="Photos"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={photos}
        numColumns={3}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image_url }} style={styles.photo} />
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
  photo: {
    width: '33.33%',
    height: 120,
    borderWidth: 1,
    borderColor: theme.colors.card,
    backgroundColor: theme.colors.grayLight,
  },
});
