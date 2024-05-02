import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {auth, db} from '../../firebase';
import {doc, getDoc} from '@firebase/firestore';

const test = () => {
  try {
    console.log(auth.currentUser.displayName);
  } catch (error) {
    console.log(error);
  }
};

const UserHeader = ({userInfo, navigation}) => {
  const username = userInfo.username;

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            style={styles.icon}
            source={require('../../assets/icons/back.png')}></Image>
        </TouchableOpacity>
      </View>

      <View style={{marginHorizontal: 5}}>
        <TouchableOpacity onPress={test}>
          <Text style={styles.headerText}>{username}</Text>
        </TouchableOpacity>
      </View>

      <View></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },

  icon: {
    tintColor: 'white',
    marginTop: 0,
    marginHorizontal: 0,
    width: 32,
    height: 32,
    // resizeMode: 'contain',
  },

  headerText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 26,
    textTransform: 'uppercase',
  },
});

export default UserHeader;
