import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {auth, db} from '../../firebase';
import {doc, getDoc} from '@firebase/firestore';

const EditHeader = ({navigation, userInfo}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <View style={styles.iconContainer}>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/small-left.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
  },

  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
    marginHorizontal: 8,
  },

  iconContainer: {
    backgroundColor: '#082032',
    justifyContent: 'center',
    borderRadius: 100,
    width: 45,
    height: 45,
    elevation: 10,
  },

  icon: {
    tintColor: 'white',
    width: 30,
    height: 30,
    marginLeft: 6,
  },
});

export default EditHeader;
