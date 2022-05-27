import { Link } from 'react-router-dom';
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'

function Explore() {
  return (
    <div className="explore">
      <header>
        <p className="pageHeader">Explore</p>
      </header>

      <main>
        {/* slider component */}
        <p className="exploreCategoryHeading">
          Categories
        </p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={rentCategoryImage} alt="rent image" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Places to Rent</p>
          </Link>
          <Link to='/category/sale'>
            <img src={sellCategoryImage} alt="sell image" className='exploreCategoryImg' />
            <p className="exploreCategoryName">Places Subleased</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore