import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native-elements';

const ProfPosts = ({post}) => {
  const size = (useWindowDimensions().width - 22) / 3;

  return (
    <TouchableOpacity
      onPress={() => console.log(post.caption) + console.log(post.post_id)}>
      <View style={{width: size, height: size, margin: 2}}>
        <Image
          source={{uri: post.image_url}}
          style={{height: '100%', width: '100%', resizeMode: 'cover'}}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'space-around',
    // alignItems: 'center',
    // flexDirection: 'row',
    // margin: 5,
    // height: "100%",
    // paddingVertical: 10,
    // paddingHorizontal: 5,
    // borderColor: 'white',
    // borderWidth: 1,
    // borderRadius: 10
  },
});

export default ProfPosts;
