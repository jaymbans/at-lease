import { useState } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { db } from '../firebase.config';
import { updateDoc, doc } from 'firebase/firestore';

function Profile() {
  const auth = getAuth();
  const [changeDetails, setChangeDetails] = useState(false);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const { name, email } = formData;

  const onLogout = () => {
    auth.signOut();
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // update name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        })
      }
    } catch (error) {
      toast.error('Update Profile Failed')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  // return user ? <h1>Hi, {user.displayName}</h1> : <h1>Log In, Guest</h1>
  return <div className='profile'>
    <header className="profileHeader">
      <p className="pageHeader">My Profile</p>
      <button className='logOut' type='button' onClick={onLogout}>Log Out</button>
    </header>
    <main>
      <div className="profileDetailsHeader">
        <p className="profileDetailsText">Personal Details</p>
        <p className="changePersonalDetails"
          onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}

        >
          {changeDetails ? 'done' : 'change'}
        </p>
      </div>

      <div className="profileCard">
        <form>
          <input type="text" id="name"
            className={!changeDetails ? 'profileName' : 'profileNameActive'}
            disabled={!changeDetails}
            value={name}
            onChange={onChange}
          />
          <input type="email" id="email"
            className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
            disabled={!changeDetails}
            value={email}
            onChange={onChange}
          />
        </form>
      </div>
    </main>
  </div>
}

export default Profile