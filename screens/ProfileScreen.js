import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import {BottomTabIcons} from '../components/universal/BottomTabs';
import BottomTabs from '../components/universal/BottomTabs';
import ProfHeader from '../components/profile/ProfHeader';
import {
  collectionGroup,
  doc,
  getCountFromServer,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import {auth, db} from '../firebase';
import ProfPosts from '../components/profile/ProfPosts';
import ProfInfo from '../components/profile/ProfInfo';
import {FlatList} from 'react-native-gesture-handler';

const ProfileScreen = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const numColumns = 3;

  const userRef = doc(db, 'users', auth.currentUser.uid);

  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('created_at', 'desc'));
  const userPostsRef = query(
    orderPostsRef,
    where('owner_uid', '==', auth.currentUser.uid),
  );

  const getUserDetails = async () => {
    const docSnap = await getDoc(userRef);
    const userData = docSnap.data();
    const updatedUserData = {
      ...userData,
      postCount: await getNumPosts(),
    };
    setUserInfo(updatedUserData);
    setLoading(false); // Mark loading as false once user data is loaded
  };

  const getNumPosts = async () => {
    const postsSnap = await getCountFromServer(userPostsRef);
    const numOfPosts = postsSnap.data().count;
    return numOfPosts;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
    };

    fetchData();

    const unsubscribe = onSnapshot(userPostsRef, snap => {
      setPosts(snap.docs.map(post => ({id: post.id, ...post.data()})));
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        // Placeholder while loading user info
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      ) : (
        <>
          <ProfHeader userInfo={userInfo} />
          <ProfInfo userInfo={userInfo} />
          <FlatList
            contentContainerStyle={{}}
            style={styles.postContainer}
            key={numColumns}
            numColumns={numColumns}
            data={posts}
            renderItem={({item}) => (
              <ProfPosts post={item} navigation={navigation} />
            )}
          />
          <BottomTabs navigation={navigation} icons={BottomTabIcons} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },

  postContainer: {
    margin: 5,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: 'white',
  },
});

export default ProfileScreen;
