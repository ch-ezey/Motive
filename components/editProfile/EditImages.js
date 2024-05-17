import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Image} from 'react-native-elements';

const EditImages = ({userInfo}) => {
  // console.log(userInfo);

  return (
    <View style={styles.container}>
      <View style={{position: 'absolute', alignSelf: 'center', top: '20%'}}>
        <Image
          style={{
            width: 100,
            height: 100,
            tintColor: '#374957',
            resizeMode: 'center',
          }}
          source={require('../../assets/icons/landscape.png')}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 180,
            top: 108,
          }}>
          <View style={styles.uploadContainer}>
            <Image
              style={styles.uploadIcon}
              source={require('../../assets/icons/upload.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          width: 120,
          height: 120,
          top: 80,
          borderRadius: 100,
          backgroundColor: '#082032',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            backgroundColor: '#082032',
            width: 10,
            height: 25,
            position: 'absolute',
            left: 0,
            bottom: 30,
          }}
        />
        <Image source={{uri: userInfo.profile_picture}} style={styles.pfp} />
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 90,
            bottom: 20,
          }}>
          <View style={styles.cameraContainer}>
            <Image
              style={styles.cameraIcon}
              source={require('../../assets/icons/camera.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 170,
    backgroundColor: '#213647',
    borderColor: 'white',
  },

  pfp: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderColor: '#082032',
  },

  cameraContainer: {
    backgroundColor: '#B93A21',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  uploadContainer: {
    backgroundColor: '#B93A21',
    width: 45,
    height: 45,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  cameraIcon: {
    tintColor: 'white',
    width: 19,
    height: 19,
  },

  uploadIcon: {
    tintColor: 'white',
    width: 22,
    height: 22,
  },
});

export default EditImages;
