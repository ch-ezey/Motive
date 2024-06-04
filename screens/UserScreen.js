import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import UserHeader from '../components/profile/UserHeader';
import {
  collectionGroup,
  getCountFromServer,
  onSnapshot,
  orderBy,
  query,
  where,
} from '@firebase/firestore';
import {db} from '../firebase';
import UserPosts from '../components/profile/UserPosts';
import UserInfo from '../components/profile/UserInfo';

const UserScreen = ({route, navigation}) => {
  const [userInfo, setUserInfo] = useState(route.params?.info);
  const [posts, setPostInfo] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  const numColumns = 3;

  const userUID = userInfo.owner_uid;
  const postsRef = collectionGroup(db, 'posts');
  const orderPostsRef = query(postsRef, orderBy('created_at', 'desc'));
  const userPostsRef = query(orderPostsRef, where('owner_uid', '==', userUID));

  const getUserDetails = async () => {
    const updatedUserData = {
      ...userInfo,
      postCount: await getNumPosts(),
    };
    setUserInfo(updatedUserData);
    setLoading(false); // Mark loading as false once user data is loaded
  };

  const getNumPosts = async () => {
    const postsSnap = await getCountFromServer(userPostsRef);
    const numOfPosts = postsSnap.data().count;
    console.log(numOfPosts);
    return numOfPosts;
  };

  useEffect(() => {
    const fetchData = async () => {
      await getUserDetails();
    };

    fetchData();

    const unsubscribe = onSnapshot(userPostsRef, snap => {
      setPostInfo(snap.docs.map(post => ({id: post.id, ...post.data()})));
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const [viewMode, setViewMode] = useState('grid'); // Initial view mode

  const IconToggle = () => (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 5,
        marginTop: 10,
      }}>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => setViewMode('grid')}>
          <Image
            source={require('../assets/icons/grid.png')}
            style={[
              styles.icons,
              {tintColor: viewMode === 'grid' ? 'white' : '#888'},
            ]}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setViewMode('list')}>
          <Image
            source={require('../assets/icons/list-check.png')}
            style={[
              styles.icons,
              {tintColor: viewMode === 'list' ? 'white' : '#888'},
            ]}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.line} />
    </View>
  );

  const Buttons = () => (
    <View
      style={{
        flexDirection: 'row',
        width: '80%',
        alignSelf: 'center',
        marginVertical: 5,
      }}>
      <TouchableOpacity navigation={navigation} style={styles.followButton}>
        <Text style={styles.buttonText}>FOLLOW</Text>
      </TouchableOpacity>
      <TouchableOpacity navigation={navigation} style={styles.messageButton}>
        <Text style={styles.buttonText}>MESSAGE</Text>
      </TouchableOpacity>
    </View>
  );

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
          <ScrollView>
            <UserInfo userInfo={userInfo} />
            <Buttons />
            <View
              style={{
                flexDirection: 'column',
                // alignSelf: 'center',
                alignItems: 'center',
                marginVertical: 5,
              }}>
              <IconToggle />
            </View>
            <View style={styles.postContainer}>
              {posts.map((post, index) => (
                <UserPosts key={index} post={post} />
              ))}
            </View>
            <UserHeader navigation={navigation} userInfo={userInfo} />
          </ScrollView>
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
    width: 369,
    flexDirection: 'row',
    alignSelf: 'center',
    flexWrap: 'wrap',
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

  iconContainer: {
    flexDirection: 'row',
  },

  icons: {
    height: 24,
    width: 24,
    marginHorizontal: 30,
  },

  line: {
    paddingVertical: 0.75,
    backgroundColor: '#374957',
    marginVertical: 8,
    width: 200,
  },

  followButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#B93A21',
    padding: 10,
    borderRadius: 6,
    elevation: 10,
    // marginBottom: 20,
    flex: 1.5,
    marginHorizontal: 10,
  },

  messageButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#374A59',
    padding: 10,
    borderRadius: 6,
    elevation: 10,
    // marginBottom: 20,
    flex: 1,
    marginHorizontal: 10,
  },

  buttonText: {
    fontSize: 14,
    color: 'white',
    // fontFamily: 'Roboto-Black',
    fontWeight: 'bold',
  },
});

export default UserScreen;
