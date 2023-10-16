import { View, Text, FlatList, Button, TextInput } from 'react-native'
import React, {useState, useEffect} from 'react'
import { auth, db, storage } from '../../firebase'


const Comment = () => {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")

  useEffect( ()=>{

  }, [])

  return (
    <View>
      <Text>Comment</Text>
    </View>
  )
}

export default Comment