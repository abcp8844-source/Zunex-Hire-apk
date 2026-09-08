import React, { useEffect, useState } from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';
import { Header } from '../../components/Header';
import { fetchGroupMedia } from '../../services/groupService';
import { theme } from '../../theme';

interface GroupMediaScreenProps {
  navigation: any;
  route: any;
}

export const GroupMediaScreen: React.FC<GroupMediaScreenProps> = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [media, setMedia] = useState<any[]>([]);

  useEffect(() => {
    fetchGroupMedia(groupId).then((data) => {
      if (data) setMedia(data);
    });
  }, [groupId]);

  return (
    <View style={styles.container}>
      <Header
        title="Group Media"
        onSearchPress={() => navigation.navigate('GlobalSearch')}
        onMenuPress={() => navigation.navigate('Menu')}
      />
      <FlatList
        data={media}
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
