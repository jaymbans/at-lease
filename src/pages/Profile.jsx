import { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth';


function Profile() {
  const [user, setUser] = useState(null);
  const auth = getAuth();


  useEffect(() => {
    setUser(auth.currentUser)
  }, [])

  return user ? <h1>Hi, {user.displayName}</h1> : <h1>Log In, Guest</h1>
}

export default Profile