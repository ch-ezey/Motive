import { ScrollView, View, Text } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Post from '../components/home/Post'
import { POSTS } from '../data/posts'
import { db } from '../firebase'
import { collectionGroup, onSnapshot, orderBy, query } from '@firebase/firestore'

const PostScreen = () => {

  const [posts, setPosts] = useState([])

  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('createdAt', 'desc'));
  // const postSnap = getDocs((orderPostsRef))

  useEffect(() => {
    onSnapshot(orderPostsRef, (snap) => {
      setPosts(snap.docs.map(post => (
        {id: post.id, ...post.data()}
      )))
    });
  }, []);

  return (
      <ScrollView style={{marginBottom: 50}}>
        {posts.map((post, index) => (
          <Post post={post} key={index}/>
        ))}
      </ScrollView>
  )
}

export default PostScreen