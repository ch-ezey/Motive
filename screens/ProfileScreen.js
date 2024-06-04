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
import {FlatList, ScrollView} from 'react-native-gesture-handler';

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
          <ScrollView>
            <ProfInfo userInfo={userInfo} />
            <EditButton />
            {userInfo.postCount ? (
              <View>
                <IconToggle />
                <View style={styles.postContainer}>
                  {posts.map((post, index) =>
                    viewMode === 'grid' ? (
                      <ProfPosts key={index} post={post} />
                    ) : (
                      <ProfPostsList key={index} post={post} />
                    ),
                  )}
                </View>
              </View>
            ) : (
              <View
                style={{
                  // alignSelf: 'center',
                  alignItems: 'center',
                  padding: 115,
                  margin: 15,
                  // width: 369,
                  flex: 1,
                  backgroundColor: '#374957',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'white'}}>No Posts</Text>
              </View>
            )}

            <ProfHeader navigation={navigation} userInfo={userInfo} />
          </ScrollView>
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

  editButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#374A59',
    padding: 10,
    width: 250,
    borderRadius: 6,
    elevation: 10,
    marginVertical: 5,
  },

  buttonText: {
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
