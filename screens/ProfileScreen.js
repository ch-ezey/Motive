import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabIcons } from '../components/universal/BottomTabs'
import BottomTabs from '../components/universal/BottomTabs'
import ProfHeader from '../components/profile/ProfHeader'
import { collection, collectionGroup, doc, onSnapshot, orderBy, query, where } from '@firebase/firestore'
import { auth, db } from '../firebase'
import ProfPosts from '../components/profile/ProfPosts'
import ProfInfo from '../components/profile/ProfInfo'
import { FlatList } from 'react-native-gesture-handler'

const ProfileScreen = ({navigation}) => {

  const [userInfo, setUserInfo] = useState([]);
  const [posts, setPostInfo] = useState([]);

  const numColumns = 3;
  
  const usersCollectionRef = collection(db, 'users');
  const userRef = doc(usersCollectionRef, auth.currentUser.uid);
  
  const postsRef = collectionGroup(db, 'posts');
  // const orderPostsRef = query(postsRef, orderBy('createdAt', 'desc'));
  const userPostsRef = query(postsRef, where('owner_uid', '==', auth.currentUser.uid));

  useEffect(() => {    
    onSnapshot(userPostsRef, (snap) => {
      setPostInfo(snap.docs.map(post => (
        {id: post.id, ...post.data()}
      )))
    });

    onSnapshot(userRef, (snap) => {
      setUserInfo(snap.data())
    });    
  }, []);
  // console.log(posts)
  // console.log(userInfo)

  return (
    <SafeAreaView style={styles.container}>
      <ProfHeader userInfo={userInfo}/>
      <ProfInfo userInfo={userInfo}/>
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
  }

});

export default ProfileScreen