import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth, db, storage } from '../../firebase'
import { collection, collectionGroup, getDocs, orderBy, query } from '@firebase/firestore';
import { Image } from 'react-native-elements';

const Comment = ({postInfo, comment}) => {
  
  const commentText = comment.comment;
  const commentOwner = comment.user;
  const timeStamp = comment.createdAt
  // console.log(postInfo)

  return (
    <View style={styles.container}>
      <View style={{
        width: 30,
        height: 30,
        margin: 2,
        marginTop: 2
      }}>
        {/* <Image style={styles.pfp}/> */}
      </View>
      <View style={styles.commentContainer}>
      <View>
        <Text>{commentOwner}</Text>
        <Text>{commentText}</Text>
        <Text>Created At</Text>
      </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    
  container: { 
    // alignItems: 'center',
    // justifyContent: '',
    width: 'auto',
    borderWidth: 2,
    borderColor: 'lightgrey',
    margin: 1,
    flexDirection: 'row'
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

export default Comment