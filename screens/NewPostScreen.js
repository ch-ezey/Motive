import {Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import AddNewPost from '../components/newPost/AddNewPost';
import Header from '../components/newPost/Header';
import FormikPostUploader from '../components/newPost/FormikPostUploader';

const NewPostScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <FormikPostUploader navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },
});

export default NewPostScreen;
