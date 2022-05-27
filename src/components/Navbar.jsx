import { useNavigate, useLocation } from 'react-router';
import { ReactComponent as OfferIcon } from '../assets/svg/localOfferIcon.svg';
import { ReactComponent as ExploreIcon } from '../assets/svg/exploreIcon.svg';
import { ReactComponent as PersonOutlineIcon } from '../assets/svg/personOutlineIcon.svg';


import React from 'react'

function Navbar() {
  // useNav and Location
  const navigate = useNavigate();
  const location = useLocation();

  // place current color on whichever the current route is
  const pathMatchRoute = (route) => {
    if (route === location.pathname) {
      return true;
    }
  }

  return (
    <footer className='navbar'>
      <div className="nav navbarNav">
        <ul className="navbarListItems">
          <li className="navbarListItem" onClick={() => navigate('/')}>
            <ExploreIcon fill={pathMatchRoute('/') ? '#E1AD01' : '#8f8f8f'} width='36px' height='36px' />
            <p className={pathMatchRoute('/') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Explore</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/offers')}>
            <OfferIcon fill={pathMatchRoute('/offers') ? '#E1AD01' : '#8f8f8f'} width='36px' height='36px' />
            <p className={pathMatchRoute('/offers') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Offers</p>
          </li>
          <li className="navbarListItem" onClick={() => navigate('/profile')}>
            <PersonOutlineIcon fill={pathMatchRoute('/profile') ? '#E1AD01' : '#8f8f8f'} width='36px' height='36px' />
            <p className={pathMatchRoute('/profile') ? 'navbarListItemNameActive' : 'navbarListItemName'}>Profile</p>
          </li>
        </ul>
      </div>
    </footer>
  )
}

export default Navbar