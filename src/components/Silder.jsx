import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import Spinner from './Spinner';
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Silder() {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {

    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));

      const querySnap = await getDocs(q);

      let listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      console.log(listings)
      setListings(listings);
      setLoading(false);
    }

    fetchListings();
  }, [])

  if (loading) {
    return <Spinner />
  }


  return listings && (
    <>
      <p className="exploreHeading">Recommended Listings</p>
      <Swiper
        slidesPerView={1}
        pagination={{ clickable: true }}
      >
        {listings.map(({ data, id }) => (
          < SwiperSlide key={id} onClick={() => navigate(`/category/${data.rentType}/${id}`)}>
            <div style={{ background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover' }} className='swiperSlideDiv'
            >
              <div className="swiper-container"></div>
              <p className="swiperSlideText">{data.name}</p>
              <p className="swiperSlidePrice">${data.discountedPrice ?? data.regularPrice}/mo</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default Silder