import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {BottomTabIcons} from '../components/universal/BottomTabs';
import BottomTabs from '../components/universal/BottomTabs';
import ProfHeader from '../components/profile/ProfHeader';
import ProfPostsList from '../components/profile/ProfPostsList';
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

  const EditButton = () => (
    <TouchableOpacity
      navigation={navigation}
      style={styles.editButton}
      onPress={() => {
        navigation.navigate('EditProfileScreen', {
          info: userInfo,
        });
      }}>
      <Text style={styles.buttonText}>EDIT PROFILE</Text>
    </TouchableOpacity>
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
          <ProfInfo userInfo={userInfo} />
          <EditButton />
          <IconToggle />
          <FlatList
            contentContainerStyle={styles.postContainer}
            key={numColumns}
            numColumns={numColumns}
            data={posts}
            renderItem={({item}) =>
              viewMode === 'grid' ? (
                <ProfPosts post={item} /> // Grid View
              ) : (
                <ProfPostsList post={item} /> // List View
              )
            }
          />
          <ProfHeader navigation={navigation} userInfo={userInfo} />
        </>
      )}
      <BottomTabs navigation={navigation} icons={BottomTabIcons} />
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
    alignSelf: 'center',
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

  editButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#374A59',
    padding: 10,
    width: 250,
    borderRadius: 6,
    elevation: 10,
    marginVertical: 5,
    // margin: 10,
    // marginTop: 5,
  },

  buttonText: {
    fontSize: 14,
    color: 'white',
    // fontFamily: 'Roboto-Black',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
