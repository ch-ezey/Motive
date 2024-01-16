import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Image} from 'react-native-elements';

const ProfInfo = ({userInfo}) => {
  console.log(userInfo.postCount);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 100,
          height: 100,
        }}>
        <Image source={{uri: userInfo.profile_picture}} style={styles.pfp} />
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.info}>
          {userInfo.postCount ? (
            <Text style={styles.infoText}>{userInfo.postCount}</Text>
          ) : (
            <Text style={styles.infoText}>0</Text>
          )}
          <Text style={styles.infoText}>Posts</Text>
        </View>

        <View style={styles.info}>
          {userInfo.following ? (
            <Text style={styles.infoText}>{userInfo.following}</Text>
          ) : (
            <Text style={styles.infoText}>0</Text>
          )}
          <Text style={styles.infoText}>Following</Text>
        </View>

        <View style={styles.info}>
          {userInfo.followers ? (
            <Text style={styles.infoText}>{userInfo.followers}</Text>
          ) : (
            <Text style={styles.infoText}>0</Text>
          )}
          <Text style={styles.infoText}>Followers</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    margin: 5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderColor: 'white',
    // borderWidth: 1,
    // borderRadius: 10
  },

  infoContainer: {
    flexDirection: 'row',
    borderColor: 'white',
    // borderWidth: 1,
  },

  info: {
    margin: 10,
    borderColor: 'white',
    // borderWidth: 1,
  },

  infoText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },

  pfp: {
    height: '100%',
    width: '100%',
    borderRadius: 100,
    borderColor: 'white',
    // borderWidth: 1.5
  },
});

export default ProfInfo;
