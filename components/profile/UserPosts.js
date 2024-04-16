import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native-elements';

const size = 115;

const UserPosts = ({post}) => {
  return (
    <TouchableOpacity
      onPress={() => console.log(post.caption) + console.log(post.post_id)}>
      <View style={styles.container}>
        <Image
          source={{uri: post.image_url}}
          style={{
            height: '100%',
            width: '100%',
            resizeMode: 'cover',
            borderWidth: 1,
            borderColor: '#526370',
            borderRadius: 6,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: size,
    height: size,
    margin: 4,
  },
});

export default UserPosts;
