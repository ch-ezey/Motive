import { FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Post from '../components/home/Post'
import { db } from '../firebase'
import { collectionGroup, onSnapshot, orderBy, query } from '@firebase/firestore'

const PostScreen = ({navigation, openCommentSheet, closeCommentSheet}) => {

  const [posts, setPosts] = useState([])

  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('createdAt', 'desc'));

  useEffect(() => {
    onSnapshot(orderPostsRef, (snap) => {
      setPosts(snap.docs.map(post => (
        {id: post.id, ...post.data()}
      )))
      // console.log(snap.docs.map(post => (
      //   {id: post.id, ...post.data()}
      // )))
    });
  }, []);

  return (
    <FlatList
      // keyExtractor={(item) => item.uid}
      data={posts}
      renderItem={({ item }) => (
        <Post 
          post={item} 
          navigation={navigation}
          openCommentSheet={openCommentSheet}
          closeCommentSheet={closeCommentSheet}
          />
      )}
    />
  )
}

export default PostScreen