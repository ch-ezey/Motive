import {Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {auth} from '../../firebase';
import {signOut} from 'firebase/auth';

const handleSignout = async () => {
  try {
    console.log(auth.currentUser.displayName);
    await signOut(auth);
  } catch (error) {
    console.log(error);
  }
};

const Header = ({navigation}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleSignout}>
          <Image
            style={styles.logo}
            source={require('../../assets/logo/Long1.png')}></Image>
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('NewPostScreen');
            }}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/add.png')}></Image>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('FriendScreen');
            }}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/friends.png')}></Image>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 93,
    height: 32,
  },
  wrapper: {
    padding: 10,
    // borderWidth: 1,
    borderColor: 'white',
    // elevation: 5,
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    // borderWidth: 1,
  },

  iconContainer: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    tintColor: '#B93A21',
    width: 32,
    height: 32,
  },
});

export default Header;
