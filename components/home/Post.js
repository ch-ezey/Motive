import { StyleSheet, Image, View, Text, TouchableOpacity } from 'react-native'
import {Divider} from 'react-native-elements'
import { auth, db, storage } from '../../firebase'
import { collection, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from '@firebase/firestore'
import { deleteObject, ref } from '@firebase/storage'

const Post = ({post}) => {

  const handleGoing = post => {

    const currentGoingStatus = !post.users_going.includes(
      auth.currentUser.email
    )

    const usersCollectionRef = collection(db, 'users');
    const postOwnerRef = doc(usersCollectionRef, post.owner_uid);
    const postCollectionRef = collection(postOwnerRef, 'posts');
    const postId = doc(postCollectionRef, post.id);
    
    updateDoc(postId, {
      users_going: currentGoingStatus 
      ? arrayUnion(
          auth.currentUser.email
        )
      : arrayRemove(
          auth.currentUser.email
        )
    })
    .then(() => {
      console.log('Document Updated Successfully')
    })
    .catch(error => {
      console.error('Error Updating Document: ', error )
    })
  }

  const deletePost = post => {

    const usersCollectionRef = collection(db, 'users');
    const postOwnerEmailRef = doc(usersCollectionRef, post.owner_uid);
    const postCollectionRef = collection(postOwnerEmailRef, 'posts');
    const postId = doc(postCollectionRef, post.id);

    const postImageRef = ref(storage,  post.owner_uid + '/' + 'posts/' + post.fileName) //where the post is stored     

    deleteDoc(postId)
    .then(() => {
      console.log('Document Deleted Successfully')
      // Delete the file
      deleteObject(postImageRef).then(() => {
        console.log('File Deleted Successfully')
      }).catch((error) => {
        console.error('Error Deleting File: ', error )
      });
    })
    .catch(error => {
      console.error('Error Deleting Document: ', error )
    })
  }

  return (

    <View style={{marginBottom: 10 }}>
        <Divider width={1} orientation='horizontal' />
        <PostHeader post={post} deletePost={deletePost}/>
        <PostImage post={post}/>
        {/* <Divider width={1} orientation='horizontal' /> */}
        <View style={{marginTop: 2}}>
          <PostFooter post={post} handleGoing={handleGoing}/>
          <View style={{marginLeft: 18}}>
            <Going post={post}/>
            <Caption post={post}/>
            <CommentSection post={post}/>
            <Comments post={post}/>
          </View>
        </View>      
    </View>
  )
}

const PostHeader = ({deletePost, post}) => (

  <View 
    style={{
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      margin: 5, 
      alignItems: 'center',
    }}
  >
    <View >
    <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image source={{uri: post.profile_picture }} style={styles.post}/>
      
        <Text style={{color: 'white', marginLeft: 5, fontWeight: '700'}}>
          {post.user}
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity onPress={() => 
        post.owner_uid == auth.currentUser.uid
        ? deletePost(post)
        : null
        }>
      <Image style={styles.icon} 
        source={require('../../assets/icons/dots.png')}>
      </Image>
    </TouchableOpacity>
  </View>
)

const PostImage = ({post}) => (

  <View
    style={{
      width: '100%',
      height: 400,
    }}
  >
    <Image 
      source={{ uri: post.imageUrl }}
      style={{ height: '100%', width: '100%', resizeMode: 'cover' }}
     />
  </View>
)

const PostFooter = ({handleGoing, post}) => (
  <View style={{flexDirection: 'row'}}>

    <View style={styles.allFooterIcon}>

      <TouchableOpacity onPress={() => handleGoing(post)}>
        <Image style={
          post.users_going.includes(
            auth.currentUser.email
          ) ? styles.footerIconActive
          : styles.footerIcon
        }
          source={require('../../assets/icons/check.png')}>
        </Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image style={styles.footerIcon}
          source={require('../../assets/icons/comment.png')}>
        </Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image style={styles.footerIcon}
          source={require('../../assets/icons/share.png')}>
        </Image>
      </TouchableOpacity>

      <TouchableOpacity>
        <Image style={styles.footerIcon}
          source={require('../../assets/icons/cross.png')}>
        </Image>
      </TouchableOpacity>
      
    </View>

  </View>
)

const Going = ({post}) => (

  <View style={{flexDirection: 'row'}}>
    <Text 
      style={{color: 'white', fontWeight: '600', marginTop: 3}}>
        {post.users_going.length.toLocaleString('en')} going
    </Text>
  </View>
)

const Caption = ({post}) => (

  <View style={{marginTop: 3}}>
    <Text style={{color: 'white', fontWeight: '400'}}>
      <Text style={{fontWeight: '600'}}>{post.user}</Text>
      <Text> {post.caption}</Text>
    </Text>
  </View>
)

const CommentSection = ({post}) => (
  
  <View style={{marginTop: 3}}>
    {!!post.comments.length && (
      <Text style={{color: 'gray'}}>
        View{post.comments.length > 1 ? ' all' : ''} {post.comments.length}{' '} 
        {post.comments.length > 1 ? 'comments' : 'comment'}
      </Text>
    )}
  </View>
)

const Comments = ({post}) => (

  <>
  {post.comments.map((comment, index) => (
    <View key={index} style={{flexDirection: 'row', marginTop: 1}}>
      <Text style={{color: 'white'}}>
        <Text style={{fontWeight: '600'}}>{comment.user}</Text>
        {' '}{comment.comment}
      </Text>
    </View>
  ))}
  </>
)

const styles = StyleSheet.create({

  post: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 6,
    borderWidth: 1.6,
    borderColor: '#ff8501',
  },

  icon: {
    tintColor: '#B93A21',
    width: 23,
    height: 23,
    margin: 5,
    resizeMode: 'contain',
  },

  footerIcon: {
    tintColor: '#B93A21',
    width: 27,
    height: 27,
    marginHorizontal: 35,
    marginTop: 5,
    resizeMode: 'contain',
  },

  footerIconActive: {
    tintColor: 'white',
    width: 27,
    height: 27,
    marginHorizontal: 35,
    marginTop: 5,
    resizeMode: 'contain',
  },

  allFooterIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
})

export default Post