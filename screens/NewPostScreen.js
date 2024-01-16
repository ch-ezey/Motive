import {Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import AddNewPost from '../components/newPost/AddNewPost';

const NewPostScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AddNewPost navigation={navigation} />
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
