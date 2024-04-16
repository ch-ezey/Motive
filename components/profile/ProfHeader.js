import {Image, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {auth, db} from '../../firebase';
import {doc, getDoc} from '@firebase/firestore';

const ProfHeader = ({userInfo}) => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Image
              style={styles.icon}
              source={require('../../assets/icons/settings.png')}
            />
          </TouchableOpacity>
        </View>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
  },

  iconContainer: {
    backgroundColor: '#082032',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    width: 50,
    height: 50,
    elevation: 10,
  },

  icon: {
    tintColor: 'white',
    marginTop: 0,
    marginHorizontal: 10,
    width: 28,
    height: 28,
  },
});

export default ProfHeader;
