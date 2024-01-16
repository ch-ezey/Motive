//components/Post/PostHeader.js
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Image, Dimensions} from 'react-native';
import styles from './styles';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import PostCaption from './PostCaption';

const PostImage = ({post}) => {
  const animationValue = useSharedValue(200); // Use shared value for initial height
  const fadeValue = useSharedValue(1); // Full opacity

  const [isFullSize, setIsFullSize] = useState(false);
  const [isFaded, setIsFaded] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  // Create animated styles using useAnimatedStyle hook
  const animatedStyles = useAnimatedStyle(() => {
    return {
      height: animationValue.value,
    };
  });

  // Execute this side effect when isFullSize changes
  useEffect(() => {
    Image.getSize(post.image_url, (width, height) => {
      if (isFullSize) {
        const aspectRatio = width / height;
        const imageHeight = screenWidth / aspectRatio;

        const duration = imageHeight * 2.5;
        animationValue.value = withSpring(imageHeight, {
          duration: duration,
          dampingRatio: 0.6,
        });
      } else {
        const aspectRatio = width / height;
        const imageHeight = screenWidth / aspectRatio;

        const duration = imageHeight * 2.5;
        animationValue.value = withSpring(200, {
          duration: duration,
          dampingRatio: 0.6,
        });
      }
    });

    if (isFaded) {
      fadeValue.value = withTiming(0, {duration: 300});
    } else {
      fadeValue.value = withDelay(165, withTiming(1, {duration: 300}));
    }
  }, [isFullSize, screenWidth, isFaded]);

  const toggleImageSize = () => {
    setIsFullSize(!isFullSize);
  };

  const toggleIsFaded = () => {
    setIsFaded(!isFaded);
  };

  const imageFadeStyle = useAnimatedStyle(() => ({
    opacity: fadeValue.value,
  }));

  const captionFadeStyle = useAnimatedStyle(() => ({
    opacity: isFaded
      ? withDelay(250, withTiming(1, {duration: 500}))
      : withTiming(0, {duration: 300}),
  }));

  return (
    <View>
      <TouchableOpacity
        activeOpacity={isFaded ? 1 : 0.4}
        onPress={() => {
          if (!isFaded) {
            toggleImageSize();
          } else {
            toggleIsFaded();
          }
        }}
        onLongPress={() => {
          if (isFaded) {
            null;
          } else if (!isFullSize) {
            toggleIsFaded();
          } else {
            toggleImageSize();
            toggleIsFaded();
          }
        }}>
        <Animated.View style={[animatedStyles, imageFadeStyle]}>
          <Image source={{uri: post.image_url}} style={styles.image} />
        </Animated.View>
        <Animated.View style={[{position: 'absolute'}, captionFadeStyle]}>
          <PostCaption post={post} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};
// code for PostHeader goes here
export default PostImage;
