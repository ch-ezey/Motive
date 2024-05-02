import {
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import PostEditor from '../components/editPost/PostEditor';
import {TouchableOpacity} from 'react-native-gesture-handler';

const EditPostScreen = ({navigation, route}) => {
  console.log('EditPostScreen...');

  return (
    <View style={styles.container}>
      <Header navigation={navigation} />
      {/* <Header navigation={navigation} /> */}
      <PostEditor
        navigation={navigation}
        postID={route.params.postID}
        postURL={route.params.postURL}
        postTitle={route.params.postTitle}
        postDes={route.params.postDes}
      />
    </View>
  );
};

const Header = ({navigation}) => (
  <View style={styles.headerContainer}>
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Image
        style={{tintColor: '#B93A21', height: 30, width: 30}}
        source={require('../assets/icons/back.png')}></Image>
    </TouchableOpacity>
    <Text style={styles.headerText}>Post Editor</Text>
    <Text></Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 7,
    marginVertical: 10,
  },

  headerText: {
    color: '#B93A21',
    fontWeight: '700',
    fontSize: 22,
    marginRight: 25,
  },
});

export default EditPostScreen;
