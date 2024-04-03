import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import Header from '../components/home/Header';
import BottomTabs, {BottomTabIcons} from '../components/universal/BottomTabs';
import PostScreen from './PostScreen';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
} from '@firebase/firestore';
import {db} from '../firebase';
import CommentSheet from '../components/comments/CommentSheet';

const HomeScreen = ({navigation}) => {
  const [postInfo, setPostInfo] = useState({});
  const [comments, setComments] = useState(null);

  const bottomSheetRef = useRef(null);

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
    {
      index == -1 ? (setComments(null), setPostInfo(null)) : null;
    }
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current.close();
  };

  const handleOpenPress = () => {
    bottomSheetRef.current.snapToIndex(1);
  };

  const openCommentSheet = async postID => {
    try {
      getPostDetails(postID);
      getCommentDetails(postID);
      handleOpenPress();
    } catch (error) {
      console.error('Error fetching post information:', error);
    }
  };

  const getPostDetails = async postID => {
    const postRef = await getDoc(doc(db, 'posts', postID));
    const postData = postRef.data();

    setPostInfo(postData);
  };

  const getCommentDetails = async postID => {
    const commentsCollection = collection(db, 'posts', postID, 'comments');
    const commentsQuery = query(
      commentsCollection,
      orderBy('created_at', 'desc'),
    );

    onSnapshot(commentsQuery, snap => {
      console.log(snap.docs.length);
      setComments(
        snap.docs.map(comment => ({id: comment.id, ...comment.data()})),
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        // hidden
        backgroundColor={'#082032'}
        barStyle={'light-content'}
      />
      <Header navigation={navigation} />
      <PostScreen
        navigation={navigation}
        openCommentSheet={openCommentSheet}
        closeCommentSheet={handleClosePress}
      />
      <BottomTabs navigation={navigation} icons={BottomTabIcons} />
      <CommentSheet
        bottomSheetRef={bottomSheetRef}
        postInfo={postInfo}
        comments={comments}
        handleSheetChanges={handleSheetChanges}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },
});

export default HomeScreen;
