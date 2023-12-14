import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {auth, db} from '../../firebase';
import {collection, deleteDoc, doc, getDoc} from '@firebase/firestore';

const Comment = ({comment, postInfo}) => {
  const {comment: commentText, created_at} = comment;

  const [ownerInfo, setOwnerInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const formattedDate = created_at
    ? new Date(created_at.toDate()).toLocaleString('en-GB', {timeZone: 'UTC'})
    : '';

  const deleteComment = async comment => {
    if (
      comment.owner_uid === auth.currentUser.uid ||
      postInfo.owner_uid === auth.currentUser.uid
    ) {
      const commentCollectionRef = collection(
        db,
        'posts',
        postInfo.post_id,
        'comments',
      );
      const commentRef = doc(commentCollectionRef, comment.comment_id);

      try {
        await deleteDoc(commentRef);
        console.log('Document Deleted Successfully');
      } catch (error) {
        console.error('Error Deleting: ', error);
      }
    } else {
      console.log(
        "Current user doesn't have permission to delete this comment.",
      );
    }
  };

  const getOwnerDetails = async () => {
    try {
      const docSnap = await getDoc(comment.owner_doc);
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

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => deleteComment(comment)}>
          {loading ? (
            <View style={styles.placeholder} />
          ) : (
            <Image
              source={{uri: ownerInfo.profile_picture}}
              style={styles.pfp}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.commentContainer}>
        <TouchableOpacity onPress={() => console.log(ownerInfo)}>
          {loading ? (
            <View style={styles.placeholderText} />
          ) : (
            <Text style={styles.username}>{ownerInfo.username}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.commentText}>{commentText}</Text>
        <Text style={styles.timestamp}>
          {!formattedDate ? (
            <View style={styles.placeholderText} />
          ) : (
            formattedDate
          )}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },

  profileContainer: {
    marginHorizontal: 5,
  },

  pfp: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },

  commentContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
    padding: 8,
    marginRight: 5,
  },

  username: {
    color: '#1e91e8',
    fontWeight: 'bold',
  },

  commentText: {
    marginTop: 4,
    fontWeight: 'bold',
  },

  timestamp: {
    color: 'grey',
    fontSize: 12,
    marginTop: 4,
  },

  placeholder: {
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: 'lightgrey',
  },

  placeholderText: {
    height: 16,
    width: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 8,
  },
});

export default Comment;
