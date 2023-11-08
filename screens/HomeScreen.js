import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import Header from '../components/home/Header';
import BottomTabs, { BottomTabIcons } from '../components/universal/BottomTabs';
import PostScreen from './PostScreen';
import BottomSheet, { BottomSheetTextInput, BottomSheetBackdrop, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { collection, doc, getDoc, getDocs, onSnapshot, orderBy, query } from '@firebase/firestore';
import { db } from '../firebase';
import Comment from '../components/home/Comment';

const HomeScreen = ({ navigation }) => {

  const loadingIndicator = <Text style={styles.headerText}>Loading comments...</Text>;

  const [postInfo, setPostInfo] = useState({});
  const [comments, setComments] = useState(null);

  const bottomSheetRef = useRef(null);

  const snapPoints = ['25%', '50%', '75%'];

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    {index == -1 ? (
      setComments(null)
    ) : null}
  }, []);

  const handleClosePress = () => {
    bottomSheetRef.current.close();
  };

  const handleOpenPress = () => {
    bottomSheetRef.current.snapToIndex(1);
  };

  const openCommentSheet = async (postID) => {
    const postRef = doc(db, 'posts', postID);
    const postSnap = await getDoc(postRef);
    const postData = postSnap.data();

    const commentsCollection = collection(db, 'posts', postID, 'comments');
    const commentsQuery = query(commentsCollection, orderBy('timestamp', 'asc'));

    setPostInfo(postData);
    getCommentDetails(postID);
    // console.log(postData)
    handleOpenPress();
  };

  const getCommentDetails = async (postID) => {
    const commentsCollection = collection(db, 'posts', postID, 'comments');
    const commentsQuery = query(commentsCollection, orderBy('createdAt', 'asc'));
    
    onSnapshot(commentsQuery, (snap) => {
      console.log(snap.docs.length);
      setComments(snap.docs.map(comment => (
        {id: comment.id, ...comment.data()}
      )))
      console.log(snap.docs.map(comment => (
        {id: comment.id, ...comment.data()}
      )))
    });
  }

  const renderBackdrop = useCallback((props) => (
    <BottomSheetBackdrop 
      appearsOnIndex={0} 
      disappearsOnIndex={-1} 
      // onPress={() => (console.log("hello"))}
      {...props} 
    />
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <Header navigation={navigation} />
      <PostScreen
        navigation={navigation}
        openCommentSheet={openCommentSheet}
        closeCommentSheet={handleClosePress}
      />
      <BottomTabs navigation={navigation} icons={BottomTabIcons} />
      <CommentSheet
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
        handleSheetChanges={handleSheetChanges}
        renderBackdrop={renderBackdrop}
        postInfo={postInfo}
        comments={comments}
        loadingIndicator={loadingIndicator}
      />
    </SafeAreaView>
  );
};

const CommentSheet = ({
  bottomSheetRef, 
  snapPoints, 
  handleSheetChanges, 
  renderBackdrop,
  comments, 
  loadingIndicator,
}) => (
  <BottomSheet
    ref={bottomSheetRef}
    index={-1}
    snapPoints={snapPoints}
    onChange={handleSheetChanges}
    enablePanDownToClose={true}
    backdropComponent={renderBackdrop}
  >
    <View style={styles.contentContainer}>
      <Text style={styles.commentHeader}>COMMENTS</Text>
      {comments ? (
        <>
          <BottomSheetFlatList
          data={comments}
          renderItem={({ item }) => (
            <>
              <Comment comment={item}/>
            </>
          )}
        />
      <BottomSheetTextInput style={styles.input} />
        </>
      ) : loadingIndicator}
    </View>
  </BottomSheet>
)


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },

  contentContainer: {
    flex: 1,
    // backgroundColor: '#082032',
  },

  commentHeader: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 26,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  input: {
    borderRadius: 10,
    padding: 1.5,
    backgroundColor: 'grey',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'white',
    width: '80%',
    alignSelf: 'center'
  }
});

export default HomeScreen;
