import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {BottomTabIcons} from '../components/universal/BottomTabs';
import BottomTabs from '../components/universal/BottomTabs';
import ProfPostsList from '../components/profile/ProfPostsList';
import EditHeader from '../components/editProfile/EditHeader';
import EditInfo from '../components/editProfile/EditInfo';
import EditInputs from '../components/editProfile/EditInputs';
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

const EditProfileScreen = ({route, navigation}) => {
  const [userInfo, setUserInfo] = useState(route.params?.info);
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

  return (
    <SafeAreaView style={styles.container}>
      <>
        <EditInfo userInfo={userInfo} />
        <EditInputs userInfo={userInfo} />
        <EditHeader navigation={navigation} userInfo={userInfo} />
      </>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#082032',
    flex: 1,
  },

  postContainer: {
    // margin: 5,
    // borderWidth: 1,
    borderColor: 'white',
    alignItems: 'center',
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

  footerButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#374A59',
    padding: 10,
    width: 250,
    borderRadius: 6,
    elevation: 10,
    marginBottom: 20,
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

export default EditProfileScreen;
