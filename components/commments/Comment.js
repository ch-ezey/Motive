import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {auth, db, storage} from '../../firebase';
import {
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
} from '@firebase/firestore';
import {Image} from 'react-native-elements';

const Comment = ({postInfo, comment}) => {
  const commentText = comment.comment;
  const commentOwner = comment.user;
  // const timeStamp = comment.createdAt.toDate().toDateString();
  const timeStamp = comment.createdAt
    ? comment.createdAt.toDate().toLocaleString('en-GB', {timeZone: 'UTC'})
    : '';
  const pfp = comment.profile_picture;

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 30,
          height: 30,
          margin: 2,
          marginTop: 2,
        }}>
        <Image source={{uri: pfp}} style={styles.pfp} />
      </View>
      <View style={styles.commentContainer}>
        <View>
          <Text style={{color: '#1e91e8'}}>{commentOwner}</Text>
          <Text style={{fontWeight: 'bold'}}>{commentText}</Text>
          <Text>{timeStamp}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'center',
    // justifyContent: '',
    width: 'auto',
    borderWidth: 2,
    borderColor: 'lightgrey',
    margin: 1,
    flexDirection: 'row',
  },

  pfp: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    // borderColor: 'black',
    // borderWidth: 1.5
  },

  commentContainer: {
    // flex: 1,
    // width: 'auto',
    // borderWidth: 0,
    borderColor: 'grey',
    // margin: 1
  },
});

export default Comment;
