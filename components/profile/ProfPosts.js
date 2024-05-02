import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native-elements';
import {Formik} from 'formik';
import {Button} from 'react-native-elements';
import {useRoute} from '@react-navigation/native';
import Post from '../home/Post';
import {auth, storage} from '../../firebase';
import {editPost1} from '../editPost/editPost1';

const ProfPosts = ({post, navigation}) => {
  user = auth.currentUser;

  const size = (useWindowDimensions().width - 22) / 3;
  // const editPost = (post, user, navigation) => (
  //   <View style={styles.container}>
  //     {/* <Post navigation={navigation} /> */}
  //     <EditPostScreen posts={post} user={user} navigation={navigation} />
  //   </View>
  // );

  return (
    <View>
      <TouchableOpacity
        onPress={() => console.log(post.title) + console.log(post.post_id)}>
        <View style={{width: size, height: size, margin: 2}}>
          <Image
            source={{uri: post.image_url}}
            style={{height: '100%', width: '100%', resizeMode: 'cover'}}
          />
        </View>
      </TouchableOpacity>

      <View style={{width: size, height: size, margin: 2}}>
        <TouchableOpacity
          onPress={() => {
            // console.log(post.post_id);
            // console.log(post.image_url);
            navigation.navigate('EditPostScreen', {
              postID: post.post_id,
              postURL: post.image_url,
              postTitle: post.title,
              postDes: post.description,
            });
          }}>
          <Image
            style={{
              height: '75%',
              width: '55%',
              resizeMode: 'contain',
              tintColor: '#B93A21',
            }}
            source={require('../../assets/icons/addA.png')}></Image>
        </TouchableOpacity>
      </View>

      {/* Button version below: */}

      {/* <View>
        <Button
          title="Edit"
          onPress={() => {
            console.log('editing posts:', post);
            editPost1(navigation, post);
            //navigation.navigate('EditPostScreen', {});
          }}>
        </Button>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // flexDirection: 'row',
    // margin: 5,
    // height: '100%',
    // paddingVertical: 10,
    // paddingHorizontal: 5,
    // borderColor: 'white',
    // borderWidth: 1,
    // borderRadius: 10,
  },

  EditButton: {
    margin: 5,
    //position: 20,
    marginVertical: 10,
    width: 120,
    borderColor: 'white',
  },

  icon: {
    tintColor: '#B93A21',
    marginTop: 10,
    margin: 6,
    marginHorizontal: 10,
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
});

export default ProfPosts;
