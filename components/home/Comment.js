import { View, Text, FlatList, Button, TextInput } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth, db, storage } from '../../firebase'
import { collection, collectionGroup, getDocs, orderBy, query } from '@firebase/firestore';

const Comment = ({comment}) => {
  
  const username = comment.commentText;

  return (
    <View>
      <Text>{username}</Text>
    </View>
  )
}

export default Comment