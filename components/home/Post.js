import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-elements';
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
import {useEffect, useState} from 'react';

const Post = ({post, navigation, openCommentSheet, closeCommentSheet}) => {
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
    <View style={{marginBottom: 10}}>
      <Divider width={1} orientation="horizontal" />
      <PostHeader
        post={post}
        ownerInfo={ownerInfo}
        navigation={navigation}
        deletePost={deletePost}
        loading={loading}
      />
      <PostImage post={post} />
      {/* <Divider width={1} orientation='horizontal' /> */}
      <View style={{marginTop: 2}}>
        <PostFooter
          post={post}
          navigation={navigation}
          handleGoing={handleGoing}
          openCommentSheet={openCommentSheet}
        />
        <View style={{marginLeft: 18}}>
          <Going post={post} />
          <Caption post={post} ownerInfo={ownerInfo} loading={loading} />
        </View>
      </View>
    </View>
  );
};

const PostHeader = ({deletePost, post, navigation, ownerInfo, loading}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      alignItems: 'center',
    }}>
    <View>
      <TouchableOpacity
        style={{flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('UserScreen', {
            user: post.owner_uid,
          });
        }}>
        {loading ? (
          <View style={styles.placeholder} />
        ) : (
          <Image
            source={{uri: ownerInfo.profile_picture}}
            style={styles.post}
          />
        )}
        <Text style={{color: 'white', marginLeft: 5, fontWeight: '700'}}>
          {loading ? (
            <View style={styles.placeholderText} />
          ) : (
            ownerInfo.username
          )}
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={() => deletePost(post)}>
      <Image
        style={styles.icon}
        source={require('../../assets/icons/dots.png')}></Image>
    </TouchableOpacity>
  </View>
);

// ... (other imports)

const PostImage = ({post}) => {
  const [imageHeight, setImageHeight] = useState(400); // Default height

  useEffect(() => {
    // Get the image dimensions
    Image.getSize(
      post.image_url,
      (width, height) => {
        // Calculate the aspect ratio to set the height dynamically
        const aspectRatio = width / height;
        const calculatedHeight = 400 / aspectRatio;
        setImageHeight(calculatedHeight);
      },
      error => {
        console.error('Error getting image dimensions:', error);
      },
    );
  }, [post.image_url]);

  return (
    <View style={{width: 'auto', height: imageHeight}}>
      <Image
        source={{uri: post.image_url}}
        style={{
          height: '100%',
          width: '100%',
          resizeMode: 'cover',
          backgroundColor: 'grey',
        }}
      />
    </View>
  );
};

// ... (rest of the code)

const PostFooter = ({handleGoing, post, openCommentSheet}) => (
  <View style={{flexDirection: 'row'}}>
    <View style={styles.allFooterIcon}>
      <TouchableOpacity onPress={() => handleGoing(post)}>
        <Image
          style={
            post.users_going.includes(auth.currentUser.uid)
              ? styles.footerIconActive
              : styles.footerIcon
          }
          source={require('../../assets/icons/check.png')}></Image>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          openCommentSheet(post.post_id);
        }}>
        <Image
          style={styles.footerIcon}
          source={require('../../assets/icons/comment.png')}></Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={require('../../assets/icons/share.png')}></Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={require('../../assets/icons/cross.png')}></Image>
      </TouchableOpacity>
    </View>
  </View>
);

const Going = ({post}) => (
  <View style={{flexDirection: 'row'}}>
    <Text style={{color: 'white', fontWeight: '600', marginTop: 3}}>
      {post.users_going.length.toLocaleString('en')} going
    </Text>
  </View>
);

const Caption = ({post, ownerInfo, loading}) => (
  <View style={{marginTop: 3}}>
    <Text style={{color: 'white', fontWeight: '400'}}>
      {loading ? (
        <View style={styles.placeholderCapText} />
      ) : (
        <Text style={{fontWeight: '600'}}>{ownerInfo.username}</Text>
      )}
      <Text> {post.caption}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  post: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: '#ff8501',
  },

  icon: {
    tintColor: '#B93A21',
    width: 23,
    height: 23,
    margin: 5,
    resizeMode: 'contain',
  },

  footerIcon: {
    tintColor: '#B93A21',
    width: 27,
    height: 27,
    marginHorizontal: 35,
    marginTop: 5,
    resizeMode: 'contain',
  },

  footerIconActive: {
    tintColor: 'white',
    width: 27,
    height: 27,
    marginHorizontal: 35,
    marginTop: 5,
    resizeMode: 'contain',
  },

  allFooterIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  placeholder: {
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: 'lightgrey',
  },

  placeholderText: {
    height: 16,
    width: 100,
    backgroundColor: 'lightgrey',
    borderRadius: 8,
  },

  placeholderCapText: {
    height: 16,
    width: 50,
    backgroundColor: 'lightgrey',
    borderRadius: 8,
  },
});

export default Post;
