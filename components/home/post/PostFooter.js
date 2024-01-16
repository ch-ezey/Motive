//components/Post/PostHeader.js
import React from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import styles from './styles';
import {auth} from '../../../firebase';

const PostFooter = ({handleGoing, post, openCommentSheet}) => (
  <View style={{flexDirection: 'row'}}>
    <View style={styles.allFooterIcon}>
      <View style={{alignItems: 'center'}}>
        <TouchableOpacity onPress={() => handleGoing(post)}>
          <Image
            style={
              post.users_going.includes(auth.currentUser.uid)
                ? styles.footerIconActive
                : styles.footerIcon
            }
            source={require('../../../assets/icons/check.png')}></Image>
        </TouchableOpacity>
        {/* <Going post={post} /> */}
      </View>
      <TouchableOpacity
        onPress={() => {
          openCommentSheet(post.post_id);
        }}>
        <Image
          style={styles.footerIcon}
          source={require('../../../assets/icons/comment.png')}></Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={require('../../../assets/icons/share.png')}></Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image
          style={styles.footerIcon}
          source={require('../../../assets/icons/cross.png')}></Image>
      </TouchableOpacity>
    </View>
  </View>
);
// code for PostHeader goes here
export default PostFooter;
