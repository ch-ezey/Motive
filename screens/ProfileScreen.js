import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabIcons } from '../components/universal/BottomTabs'
import BottomTabs from '../components/universal/BottomTabs'
import ProfHeader from '../components/profile/ProfHeader'
import { collectionGroup, doc, getCountFromServer, getDoc, onSnapshot, orderBy, query, where } from '@firebase/firestore'
import { auth, db } from '../firebase'
import ProfPosts from '../components/profile/ProfPosts'
import ProfInfo from '../components/profile/ProfInfo'
import { FlatList } from 'react-native-gesture-handler'

const ProfileScreen = ({navigation}) => {

  const loadingIndicator = <Text style={styles.headerText}>Loading user data...</Text>;

  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPostInfo] = useState([]);

  const numColumns = 3;
  
  const userRef = doc(db, "users", auth.currentUser.uid);
  
  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('createdAt', 'desc'));
  const userPostsRef = query(orderPostsRef, where('owner_uid', '==', auth.currentUser.uid));

  const getUserDetails = async () => {
    const docSnap = await getDoc(userRef)
    const userData = (docSnap.data())
    const updatedUserData = {
      ...userData, // Spread the existing user data
      postCount: await getNumPosts(), // Add the new property
    };
    setUserInfo(updatedUserData);
    console.log(updatedUserData);
  }

  const getNumPosts = async () => {
    const postsSnap = await getCountFromServer(userPostsRef)
    const numOfPosts = postsSnap.data().count;
    return numOfPosts
  }

  console.log(userInfo)

  useEffect(() => {  
    const fetchData = async () => {
      getUserDetails();
    }
    
    fetchData();
    
    onSnapshot(userPostsRef, (snap) => {
      setPostInfo(snap.docs.map(post => (
        {id: post.id, ...post.data()}
      )))
    });   
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {userInfo ? (
        <>
          <ProfHeader userInfo={userInfo} />
          <ProfInfo userInfo={userInfo} />
        </>
      ) : loadingIndicator}
      <FlatList
        contentContainerStyle={{}}
        style={styles.postContainer}
        key={numColumns}
        numColumns={numColumns}
        data={posts}
        renderItem={({ item }) => (
          <ProfPosts post={item}/>
        )}
      />
      <BottomTabs navigation={navigation} icons={BottomTabIcons} />
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

export default ProfileScreen