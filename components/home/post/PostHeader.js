import React from 'react';
import {View, TouchableOpacity, Image, Text, StyleSheet} from 'react-native';
// import styles from './styles';

const PostHeader = ({deletePost, post, navigation, ownerInfo, loading}) => (
  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      alignItems: 'center',
    }}>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      {loading ? (
        <View style={styles.placeholder} />
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('UserScreen', {
              info: ownerInfo,
            });
          }}>
          <Image source={{uri: ownerInfo.profile_picture}} style={styles.pfp} />
        </TouchableOpacity>
      )}
      <View style={{marginLeft: 7}}>
        {loading ? (
          <View style={styles.placeholderText} />
        ) : (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('UserScreen', {
                info: ownerInfo,
              });
            }}>
            <Text style={{color: 'white', fontWeight: '700'}}>
              {ownerInfo.username}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>

    <TouchableOpacity onPress={() => deletePost(post)}>
      <Image
        style={styles.icon}
        source={require('../../../assets/icons/dots.png')}></Image>
    </TouchableOpacity>
  </View>
);
const styles = StyleSheet.create({
  placeholderText: {
    height: 16,
    width: 100,
    backgroundColor: 'grey',
    borderRadius: 8,
  },
  // placeholder: {
  //   height: 35,
  //   width: 35,
  //   borderRadius: 50,
  //   backgroundColor: 'grey',
  // },
  icon: {
    tintColor: '#B93A21',
    width: 23,
    height: 23,
    margin: 5,
    resizeMode: 'contain',
  },
  pfp: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
  },
});
export default PostHeader;
