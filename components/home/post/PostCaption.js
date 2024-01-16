//components/Post/PostHeader.js
import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
import {auth} from '../../../firebase';

const PostCaption = ({post, ownerInfo, loading}) => (
  <View style={styles.container}>
    <Text style={styles.title}>{post.title}</Text>
    <Text style={styles.title}>{post.description}</Text>
    {/* <Text style={styles.title}>{post.caption}</Text> */}
  </View>
);
const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderColor: 'white',
    // borderWidth: 1,
  },

  title: {
    color: 'white',
    fontWeight: '400',
  },

  description: {},

  date: {},
});

export default PostCaption;
