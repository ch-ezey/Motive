import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Dimensions, Pressable, Alert, KeyboardAvoidingView } from 'react-native';
import Header from '../components/home/Header';
import BottomTabs, { BottomTabIcons } from '../components/universal/BottomTabs';
import PostScreen from './PostScreen';
import BottomSheet, { BottomSheetTextInput, BottomSheetBackdrop, BottomSheetFlatList, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc } from '@firebase/firestore';
import { auth, db } from '../firebase';
import Comment from '../components/home/Comment';
import { Button, Divider } from 'react-native-elements';
import { Formik } from 'formik';

const HomeScreen = ({ navigation }) => {

  const loadingIndicator = <Text style={styles.headerText}>Loading comments...</Text>;
  
  const [postInfo, setPostInfo] = useState({});
  const [comments, setComments] = useState(null);

  const bottomSheetRef = useRef(null);

  const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);

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

    setPostInfo(postData);
    getCommentDetails(postID);
    console.log(postInfo.postID)
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
      // console.log(snap.docs.map(comment => (
      //   {id: comment.id, ...comment.data()}
      // )))
    });
  }

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop 
        appearsOnIndex={0} 
        disappearsOnIndex={-1} 
        {...props} 
      />
    ), []
  );  
  
  const onUpload = async (comment) => {
    const postID = postInfo.postID
    console.log(postInfo)
    try {
        const commentInput = {
          user: auth.currentUser.displayName,
          profile_picture: auth.currentUser.photoURL,
          owner_uid: auth.currentUser.uid,
          owner_email: auth.currentUser.email,
          comment: comment,
          createdAt: serverTimestamp(),
        }

        console.log(postID)

        // Upload the comment without "commentID" for now
        const commentRef = await addDoc(
          collection(db, 'posts', postID, 'comments'), commentInput);
          console.log(commentRef)

        // Retrieve the generated document ID
        const commentID = commentRef.id;
        console.log(postID)

        // Update the post document with "postID"
        await setDoc(doc(db, 'posts', postID, 'comments', commentID),
          { commentID }, { merge: true });
        
        console.log('Data Submitted');
    } catch (error) {
        Alert.alert('This is awkward...', error.message);
    }
  };

  const clearTextInput = (formik) => {
    formik.resetForm();
  };

  const renderFooter = useCallback(
    (props) => (
      <Formik
        initialValues={{comment: ''}}
        onSubmit={async (values, formik) => {
          await onUpload(values.comment).then(clearTextInput(formik));
        }}
      >
        {({ 
          handleBlur, 
          handleChange, 
          handleSubmit, 
          values,
        }) => (
          <>
      <BottomSheetFooter 
        {...props} 
        // bottomInset={24}
      >
        <Divider/>
        <View style={styles.footerContainer}>
          <BottomSheetTextInput
            style={styles.input}
            multiline={true}
            maxLength={200}
            placeholder="Add a comment..."
            onChangeText={handleChange('comment')}
            onBlur={handleBlur('comment')}
            value={values.comment}
          />
          <Pressable
            style={({ pressed }) => [
              styles.footerButton,
              { 
                backgroundColor: pressed ? '#1c414f' : '#52bce3',
                opacity: values.comment.trim() === '' ? 0.5 : 1,
              },
            ]}
            onPress={handleSubmit}
            disabled={values.comment.trim() === ''}
          >
            <Text style={styles.buttonText}>Post</Text>
          </Pressable>        
        </View>
      </BottomSheetFooter>
      </>
      )}
      </Formik>
    ), []
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <View style={styles.container}>
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
          postInfo={postInfo}
          comments={comments}
          loadingIndicator={loadingIndicator}
          handleSheetChanges={handleSheetChanges}
          renderBackdrop={renderBackdrop}
          renderFooter={renderFooter}
          clearTextInput={clearTextInput}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const CommentSheet = ({
  bottomSheetRef, 
  snapPoints, 
  handleSheetChanges, 
  renderBackdrop,
  renderFooter,
  postInfo,
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
    keyboardBlurBehavior='restore'
    android_keyboardInputMode='adjustResize'
    footerComponent={renderFooter}
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
        </>
      ) : loadingIndicator}
    </View>
  </BottomSheet>
)


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
    height: Dimensions.get('window').height
  },

  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
  },

  commentHeader: {
    color: 'grey',
    fontWeight: '700',
    fontSize: 26,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'white',
  },

  input: {
    flex: 1,
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
  },
  
  footerButton: {
    padding: 10,
    borderRadius: 8,
    // backgroundColor: 'blue', // Add your desired background color
    elevation: 3,

  },

  buttonText: {
    color: 'white', // Add your desired text color
    fontSize: 15,
  },
  
});

export default HomeScreen;
