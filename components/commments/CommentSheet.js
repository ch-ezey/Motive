// CommentSheet.js
import React, {useCallback, useMemo} from 'react';
import {Text, View, Pressable, StyleSheet, Alert} from 'react-native';
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetFlatList,
  BottomSheetFooter,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from '@firebase/firestore';
import {Formik} from 'formik';
import {Divider} from 'react-native-elements';
import Comment from './Comment';
import {auth, db} from '../../firebase';

const CommentSheet = ({
  bottomSheetRef,
  handleSheetChanges,
  postInfo,
  comments,
}) => {
  const loadingIndicator = (
    <Text style={styles.headerText}>Loading comments...</Text>
  );

  const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

  const onUpload = async comment => {
    const postID = postInfo.post_id;
    try {
      const ownerDocRef = doc(db, 'users', auth.currentUser.uid);

      const commentInput = {
        owner_uid: auth.currentUser.uid,
        comment: comment,
        created_at: serverTimestamp(),
        owner_doc: ownerDocRef,
      };

      const commentRef = await addDoc(
        collection(db, 'posts', postID, 'comments'),
        commentInput,
      );

      const comment_id = commentRef.id;

      await setDoc(
        doc(db, 'posts', postID, 'comments', comment_id),
        {comment_id},
        {merge: true},
      );

      console.log('Data Submitted');
    } catch (error) {
      Alert.alert('This is awkward...', error.message);
    }
  };

  const clearTextInput = formik => {
    formik.resetForm();
  };

  const renderFooter = useCallback(
    props => (
      <Formik
        initialValues={{comment: ''}}
        onSubmit={async (values, formik) => {
          console.log('Before onUpload:', postInfo);
          await onUpload(values.comment).then(clearTextInput(formik));
        }}>
        {({handleBlur, handleChange, handleSubmit, values}) => (
          <>
            <BottomSheetFooter {...props}>
              <Divider />
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
                  style={({pressed}) => [
                    styles.footerButton,
                    {
                      backgroundColor: pressed ? '#1c414f' : '#52bce3',
                      opacity: values.comment.trim() === '' ? 0.5 : 1,
                    },
                  ]}
                  onPress={handleSubmit}
                  disabled={values.comment.trim() === ''}>
                  <Text style={styles.buttonText}>Post</Text>
                </Pressable>
              </View>
            </BottomSheetFooter>
          </>
        )}
      </Formik>
    ),
    [postInfo],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      footerComponent={renderFooter}>
      <View style={styles.contentContainer}>
        <Text style={styles.commentHeader}>COMMENTS</Text>
        {comments ? (
          <>
            <BottomSheetFlatList
              keyExtractor={item => item.id}
              data={comments}
              extraData={postInfo}
              renderItem={({item}) => (
                <>
                  <Comment key={item.id} comment={item} postInfo={postInfo} />
                </>
              )}
            />
          </>
        ) : (
          loadingIndicator
        )}
      </View>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: 60,
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

export default CommentSheet;
