import {View, Text, StyleSheet} from 'react-native';
import PostHeader from './post/PostHeader';
import PostFooter from './post/PostFooter';
import PostImage from './post/PostImage';
import {auth, db, storage} from '../../firebase';
import {
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDocs,
  getDoc,
} from '@firebase/firestore';
import {deleteObject, ref} from '@firebase/storage';
import React, {useState, useEffect} from 'react';

const Post = ({post, navigation, openCommentSheet}) => {
  const [ownerInfo, setOwnerInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const handleGoing = post => {
    // Determine the current going status of the user
    const currentGoingStatus = !post.users_going.includes(auth.currentUser.uid);
    const postCollectionRef = collection(db, 'posts');
    const postID = doc(postCollectionRef, post.id);

    // Helper function to update the going status in Firestore
    const updateGoingStatus = async status => {
      try {
        // Update the document with the new going status
        await updateDoc(postID, {
          users_going: status
            ? arrayUnion(auth.currentUser.uid)
            : arrayRemove(auth.currentUser.uid),
        });

        console.log('Document Updated Successfully');
      } catch (error) {
        console.error('Error Updating Document: ', error);
      }
    };

    // Call the helper function to update the going status
    updateGoingStatus(currentGoingStatus);
  };

  const deleteComments = async post => {
    const commentCollectionRef = collection(db, 'posts', post.id, 'comments');

    // Check if the subcollection exists
    const commentCollectionSnapshot = await getDocs(commentCollectionRef);

    if (commentCollectionSnapshot.size === 0) {
      console.log('Subcollection does not exist.');
      return;
    }

    // Delete each document in the subcollection
    commentCollectionSnapshot.forEach(async doc => {
      await deleteDoc(doc.ref);
    });

    console.log('Subcollection deleted successfully.');
  };

  const deletePost = async post => {
    if (post.owner_uid === auth.currentUser.uid) {
      const postCollectionRef = collection(db, 'posts');
      const postRef = doc(postCollectionRef, post.id);
      const postImageRef = ref(
        storage,
        post.owner_uid + '/' + 'posts/' + post.file_name,
      );

      console.log(postRef.id);

      await deleteDoc(postRef)
        .then(() => {
          console.log('Document Deleted Successfully');
          return deleteObject(postImageRef);
        })
        .then(() => {
          deleteComments(post);
        })
        .then(() => {
          console.log('File Deleted Successfully');
        })
        .catch(error => {
          console.error('Error Deleting: ', error);
        });
    } else {
      console.log("Current user doesn't have permission to delete this post.");
    }
  };

  const getOwnerDetails = async () => {
    try {
      const docSnap = await getDoc(post.owner_doc);
      const ownerData = docSnap.data();

      setOwnerInfo(ownerData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching owner details: ', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getOwnerDetails();
    };

    console.log(ownerInfo);
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <PostHeader
        post={post}
        ownerInfo={ownerInfo}
        navigation={navigation}
        deletePost={deletePost}
        loading={loading}
      />
      <PostImage post={post} />
      <View style={{marginTop: 3}}>
        <PostFooter
          post={post}
          navigation={navigation}
          handleGoing={handleGoing}
          openCommentSheet={openCommentSheet}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#213647',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    overflow: 'hidden',
    elevation: 5,
    paddingBottom: 10,
    backfaceVisibility: 'hidden',
  },
});

export default Post;
