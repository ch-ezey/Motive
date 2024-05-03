import {FlatList} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import Post from '../components/home/Post';
import {db} from '../firebase';
import {collectionGroup, onSnapshot, orderBy, query} from '@firebase/firestore';
import {RefreshControl} from 'react-native';

const PostScreen = ({navigation, openCommentSheet, closeCommentSheet}) => {
  const [posts, setPosts] = useState([]);

  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('created_at', 'desc'));

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [refreshCount, setRefreshCount] = useState(0); // State for re-render

  useEffect(() => {
    if (refreshing) {
      console.log('Refreshing home page');
    }

    const unsubscribe = onSnapshot(
      orderPostsRef,
      snap => {
        setPosts(snap.docs.map(post => ({id: post.id, ...post.data()})));
        setLoading(false);
      },
      error => {
        console.error('Error fetching posts:', error);
        setLoading(false);
      },
    );
    setRefreshCount(prevCount => prevCount + 1);

    return () => unsubscribe();
  }, [refreshing]);

  // // In your component rendering
  // if (loading) {
  //   return <ActivityIndicator size="large" color="#0000ff" />;
  // }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <FlatList
      key={refreshCount} // Key will change on re-render
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={posts}
      extraData={this.state}
      renderItem={({item}) => (
        <Post
          key={item.id}
          post={item}
          navigation={navigation}
          openCommentSheet={openCommentSheet}
          closeCommentSheet={closeCommentSheet}
        />
      )}
    />
  );
};

export default PostScreen;
