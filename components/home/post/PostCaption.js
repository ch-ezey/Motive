import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const PostCaption = ({post}) => {
  const formattedDate = post.created_at
    ? new Date(post.created_at.toDate()).toLocaleDateString('en-GB', {
        timeZone: 'UTC',
      })
    : '';

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>
      <Text style={styles.date}>{formattedDate}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 5,
  },
  description: {
    color: '#a1a1a1', // Slightly lighter grey
    fontSize: 16,
    lineHeight: 22, // Increased line height
    marginBottom: 10,
  },
  date: {
    color: '#888', // Slightly darker grey
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 5, // Adds some spacing
  },
});

export default PostCaption;
