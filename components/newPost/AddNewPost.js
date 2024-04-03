import {View, StyleSheet} from 'react-native';
import React from 'react';
import FormikPostUploader from './FormikPostUploader';
import Header from './Header';
import {auth, storage} from '../../firebase';

const AddNewPost = ({navigation}) => (
  <View style={styles.container}>
    <Header navigation={navigation} />
    <FormikPostUploader
      storage={storage}
      user={auth.currentUser}
      navigation={navigation}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: 7,
    // marginVertical: 10,
  },
});

export default AddNewPost;
