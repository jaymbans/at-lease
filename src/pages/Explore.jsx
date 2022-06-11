import { Link } from 'react-router-dom';
import Slider from '../components/Silder'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>
      <main>
        <Slider />
        <p className="exploreCategoryHeading">
          Categories
        </p>
        <div className="exploreCategories">
          <Link to='/category/seasonal'>
            <img src={rentCategoryImage} alt="rent image" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Seasonal SubLeases</p>
          </Link>
          <Link to='/category/annual'>
            <img src={sellCategoryImage} alt="sell image" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Annual Subleases</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore