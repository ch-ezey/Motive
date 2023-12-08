import { FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import Post from '../components/home/Post'
import { db } from '../firebase'
import { collectionGroup, onSnapshot, orderBy, query } from '@firebase/firestore'

const PostScreen = ({navigation, openCommentSheet, closeCommentSheet}) => {

  const [posts, setPosts] = useState([]);

  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('createdAt', 'desc'));

  // Add a loading state variable
const [loading, setLoading] = useState(true);

// In your useEffect
useEffect(() => {
  const unsubscribe = onSnapshot(orderPostsRef, 
    (snap) => {
      setPosts(snap.docs.map(post => ({ id: post.id, ...post.data() })));
      setLoading(false);
    },
    (error) => {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, []);

// // In your component rendering
// if (loading) {
//   return <ActivityIndicator size="large" color="#0000ff" />;
// }

  return (
    <FlatList
      keyExtractor={(item) => item.postID}
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