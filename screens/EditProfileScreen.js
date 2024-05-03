import React from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';

import EditHeader from '../components/editProfile/EditHeader';
import EditInputs from '../components/editProfile/EditInputs';
import EditImages from '../components/editProfile/EditImages';

const EditProfileScreen = ({route, navigation}) => {
  // const [userInfo, setUserInfo] = useState(route.params?.info);
  const userInfo = route.params?.info;

  return (
    <SafeAreaView style={styles.container}>
      <>
        <EditImages userInfo={userInfo} />
        <EditInputs navigation={navigation} userInfo={userInfo} />
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
});

export default EditProfileScreen;
