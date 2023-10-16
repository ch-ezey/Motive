import { TouchableOpacity, Image, View, Text, StyleSheet, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BottomTabIcons } from '../components/universal/BottomTabs'
import BottomTabs from '../components/universal/BottomTabs'
import ProfHeader from '../components/profile/ProfHeader'
import { collection, collectionGroup, doc, onSnapshot, query, where } from '@firebase/firestore'
import { auth, db } from '../firebase'
import ProfPosts from '../components/profile/ProfPosts'
import ProfInfo from '../components/profile/ProfInfo'

const ProfileScreen = ({navigation}) => {

  const [userInfo, setUserInfo] = useState([]);
  const [postInfo, setPostInfo] = useState([]);
  
  const usersCollectionRef = collection(db, 'users');
  const userRef = doc(usersCollectionRef, auth.currentUser.uid);
  
  const postCollectionRef = collectionGroup(db, 'posts');
  const userPostsRef = query(postCollectionRef, where('owner_uid', '==', auth.currentUser.uid));
  
  useEffect(() => {
    onSnapshot(userRef, (snap) => {
      setUserInfo(snap.data())
    });
    
    onSnapshot(userPostsRef, (snap) => {
      setPostInfo(snap.docs.map(post => (
        {id: post.id, ...post.data()}
      )))
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ProfHeader userInfo={userInfo}/>
      <ProfInfo userInfo={userInfo}/>
      {/* {postInfo.map((postInfo, index) => (
          <ProfPosts postInfo={postInfo} key={index}/>
        ))} */}
      <ProfPosts postInfo={postInfo}/>
      <BottomTabs navigation={navigation} icons={BottomTabIcons} />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
  backgroundColor: '#082032',
  flex: 1,
}

});

export default ProfileScreen