import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);


  const params = useParams();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // reference listing collection
        const listingsRef = collection(db, 'listings');

        // Set query
        const q = query(
          listingsRef,
          where('rentType', '==', params.categoryName),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        // Execute query
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listings = [];


        querySnap.forEach((doc) => {
          listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch listings')
        console.log(error)
      }
    };

    fetchListings();
  }, [params.categoryName])

  // pagination and load more
  const fetchMoreListings = async () => {
    try {
      // reference listing collection
      const listingsRef = collection(db, 'listings');

      // Set query
      const q = query(
        listingsRef,
        where('rentType', '==', params.categoryName),
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      // Execute query
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listings = [];


      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      setListings((prevState) => {
        return [...prevState, ...listings]
      })
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listings')
      console.log(error)
    }
  }

  return (
    <div className='category'>
      <header>
        <p className="pageHeader">
          {params.categoryName === 'seasonal' ? 'Seasonal Places' : 'Annual Places'}
        </p>
      </header>
      {loading ? <Spinner /> : listings && listings.length > 0 ?
        <>
          <main>
            <ul className='categoryListings'>
              {listings.map((listing) => (
                <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={fetchMoreListings}>Load More</p>
          )}
        </> : <p>No current listings for {params.categoryName}</p>}
    </div>
  )
}

export default Category