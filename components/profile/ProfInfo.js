import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Image} from 'react-native-elements';

const ProfInfo = ({userInfo}) => {
  console.log(userInfo.postCount);

  const Stats = () => (
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
  );

  const Details = () => (
    <View style={{marginTop: 30, marginHorizontal: 10}}>
      {userInfo.name == null || userInfo.name == '' ? null : (
        <Text style={{color: 'white', fontWeight: 900, fontSize: 30}}>
          {userInfo.name}
        </Text>
      )}
      <Text style={{color: '#86929B'}}>@{userInfo.username}</Text>

      {userInfo.bio == null || userInfo.bio == '' ? null : (
        <View style={{paddingTop: 5}}>
          <Text style={{color: 'white', fontWeight: 400, fontSize: 15}}>
            {userInfo.bio}
          </Text>
        </View>
      )}
    </View>
  );

  const Images = () => (
    <View style={{backgroundColor: '#213647', height: 170}}>
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
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Images />
      <Details />
      <Stats />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    borderColor: 'white',
  },

  infoContainer: {
    flexDirection: 'row',
    borderColor: 'white',
    alignSelf: 'center',
    marginVertical: 5,
  },

  info: {
    marginHorizontal: 10,
    borderColor: 'white',
  },

  infoText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },

  pfp: {
    height: 100,
    width: 100,
    borderRadius: 100,
    borderColor: '#082032',
  },
});

export default ProfInfo;
