import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail, setPasswordRest } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';

function ForgotPassword() {
  const [email, setEmail] = useState('');

  const onChange = (e) => {
    setEmail(e.target.value)
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      toast.success('Link sent to Email')
    } catch (error) {
      toast.error('Reset request failed!')
    }
  }

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <input type="email" id="email" className='emailInput' placeholder='Email' value={email} onChange={onChange} />
        </form>
        <Link className='forgotPasswordLink' to='/sign-in'>
          Sign In
        </Link>
        <div className="signInBar">
          <div className="signInText">Email Reset Link</div>
          <button className="signInButton">
            <ArrowRightIcon fill='white' width='30' height='34' />
          </button>
        </div>
      </main>
    </div>
  )
}

export default ForgotPassword