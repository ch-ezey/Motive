import React, { useEffect, useState } from 'react'
import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native'
import UserHeader from '../components/profile/UserHeader'
import { collection, collectionGroup, doc, getCountFromServer, getDoc, onSnapshot, orderBy, query, where } from '@firebase/firestore'
import { auth, db } from '../firebase'
import UserPosts from '../components/profile/UserPosts'
import UserInfo from '../components/profile/UserInfo'
import { FlatList } from 'react-native-gesture-handler'

const UserScreen = ({ route, navigation }) => {
  // A loading indicator for when user data is loading
  const loadingIndicator = <Text style={styles.headerText}>Loading user data...</Text>;

  // Extract the user's unique ID from the route parameters
  const userUID = route.params?.user;

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPostInfo] = useState([]);

  const numColumns = 3;
  
  const userRef = doc(db, "users", userUID);

  const postsRef = collectionGroup(db, 'posts');
  
  // Query to retrieve posts in descending order of creation time
  const orderPostsRef = query(postsRef, orderBy('createdAt', 'desc'));
  
  // Query to retrieve posts owned by the user with the specified userUID
  const userPostsRef = query(orderPostsRef, where('owner_uid', '==', userUID));

  // Function to fetch user details
  const getUserDetails = async () => {
    const docSnap = await getDoc(userRef);
    const userData = docSnap.data();

    // Add the "postCount" property to the user data, and wait for the post count
    const updatedUserData = {
      ...userData, // Spread the existing user data
      postCount: await getNumPosts(), // Add the new property
    };

    setUserInfo(updatedUserData);
    console.log(updatedUserData);
  }

  // Function to get the number of posts for the user
  const getNumPosts = async () => {
    // Retrieve the post count from the server
    const postsSnap = await getCountFromServer(userPostsRef);
    const numOfPosts = postsSnap.data().count;
    return numOfPosts;
  }

  useEffect(() => {  
    // Fetch user details and user posts data
    const fetchData = async () => {
      getUserDetails();
    }

    console.log(userUID);
    fetchData();

    // Subscribe to changes in the user's posts
    onSnapshot(userPostsRef, (snap) => {
      setPostInfo(snap.docs.map(post => (
        { id: post.id, ...post.data() }
      )))
    });   
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {userInfo ? (
        <>
          {/* Display user header and info if userInfo is available, else display loading indicator */}
          <UserHeader navigation={navigation} userInfo={userInfo} />
          <UserInfo userInfo={userInfo} />
        </>
      ) : loadingIndicator}
      <FlatList
        contentContainerStyle={{}}
        style={styles.postContainer}
        key={numColumns}
        numColumns={numColumns}
        data={posts}
        renderItem={({ item }) => (
          <UserPosts post={item}/>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },

  postContainer: {
    margin: 5,
    // height: "100%",
    // paddingVertical: 10,
    borderColor: 'white',
    // borderWidth: 1,
    // flex: 1,
    // width: "auto"
  },

  headerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 26,
    marginLeft: 5,
    textTransform: 'uppercase'
  }
});

export default UserScreen;
