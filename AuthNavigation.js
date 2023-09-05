import React, { useEffect, useState } from 'react'
import { SignedInStack, SignedOutStack } from './navigation'
import { auth } from './firebase'
import { onAuthStateChanged } from 'firebase/auth'

const AuthNavigation = () => {
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
      } else {
        setCurrentUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      {currentUser ? <SignedInStack /> : <SignedOutStack />}
    </>
  )
}

export default AuthNavigation
