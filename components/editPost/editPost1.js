import {View, StyleSheet} from 'react-native';
import React from 'react';
import {auth, storage} from '../../firebase';
import EditPostScreen from '../../screens/EditPostScreen';
import PostEditor from './PostEditor';

//Obselete...?

const editPost1 = ({navigation, currentPost}) => {
  return (
    <View style={styles.container}>
      {/* <Header navigation={navigation} /> */}
      <PostEditor
        storage={storage}
        user={auth.currentUser}
        navigation={navigation}
        currentPost={currentPost}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 7,
    marginVertical: 10,
  },
});

export default editPost1;
