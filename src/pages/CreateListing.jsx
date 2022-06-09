import { useState, useEffect, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

function CreateListing() {
  const [geolocationEnabled, setGeolocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    location: '',
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
    rentType: 'annual'
  })

  const {
    type,
    name,
    bedrooms,
    parking,
    bathrooms,
    furnished,
    location,
    offer,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
    rentType
  } = formData;


  const auth = getAuth();
  const navigate = useNavigate();
  const isMounted = useRef(true)

  useEffect(() => {
    if (isMounted) {
      // grabs the user's id and sets it to the state
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid })
        } else {
          navigate('/sign-in')
        }
      })
    }
    return () => { isMounted.current = false }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted])

  const onSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // input constraints
    if (discountedPrice >= regularPrice) {
      setLoading(false);
      toast.error('Discount must be cheaper than the regular price');
      return;
    }

    if (images.length > 6) {
      setLoading(false);
      toast.error('You may only upload a max of six images');
      return;
    }

    // Geolocation

    let geolocation = {};
    let loc;

    if (geolocationEnabled) {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.REACT_APP_GEOCODE_KEY}`);

      const data = await response.json();
      geolocation.lat = data.results[0]?.geometry['location']['lat'] ?? 0;
      geolocation.lng = data.results[0]?.geometry['location']['lng'] ?? 0;
      loc = data.status === 'ZERO_RESULTS' ? undefined : data['results'][0]['formatted_address'];

      if (loc === undefined || loc.includes('undefined')) {
        setLoading(false);
        toast.error('Please enter a valid address');
        return
      }

    } else {
      geolocation.lat = latitude;
      geolocation.lng = longitude;
    }

    // store images
    // this is directly taken from the firebase documentation: https://firebase.google.com/docs/storage/web/upload-files

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, 'images/' + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused');
                break;
              case 'running':
                console.log('Upload is running');
                break;
            }
          },
          (error) => {
            reject(error);
            console.log(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      })

    }
    const imgUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch(() => {
      setLoading(false);
      toast.error('Image upload failed');
      return;
    })

    console.log(imgUrls)

    const formDataCopy = {
      ...formData,
      imgUrls,
      geolocation,
      timestamp: serverTimestamp()
    }


    delete formDataCopy.images;
    !formDataCopy.offer && (delete formDataCopy.discountedPrice);

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy);
    setLoading(false);
    toast.success('Listing saved @ease');
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }


  const onMutate = (e) => {
    // handle the boolean buttons
    let boolean = null;
    if (e.target.value === 'true') {
      boolean = true;
    } else if (e.target.value === 'false') {
      boolean = false;
    }

    // handle the file inputs
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files
      }))
    }

    // handle the text, booleans, or number inputs
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value
      }))
    }

  }

  if (loading) {
    return <Spinner />
  }

  return (
    <div className='profile'>
      <header>
        <p className="pageHeader">Lease your home!</p>
      </header>
      <main>
        <form onSubmit={onSubmit}>
          <label className='formLabel'>Seasonal / Annual</label>
          <div className="formButtons">
            <button
              type='button' className={rentType === 'seasonal' ? 'formButtonActive' : 'formButton'}
              id='rentType'
              value='seasonal'
              onClick={onMutate}
            >
              Seasonal
            </button>
            <button
              type='button' className={rentType === 'annual' ? 'formButtonActive' : 'formButton'}
              id='rentType'
              value='annual'
              onClick={onMutate}
            >
              Annual
            </button>
          </div>
          <label className='formLabel'>Name of Home</label>
          <input
            className='formInputName'
            type='text'
            id='name'
            value={name}
            onChange={onMutate}
            maxLength='32'
            minLength='10'
            required
          />
          <div className='formRooms flex'>
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bedrooms'
                value={bedrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input
                className='formInputSmall'
                type='number'
                id='bathrooms'
                value={bathrooms}
                onChange={onMutate}
                min='1'
                max='50'
                required
              />
            </div>
          </div>
          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={parking ? 'formButtonActive' : 'formButton'}
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
              min='1'
              max='50'
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Furnished</label>
          <div className='formButtons'>
            <button
              className={furnished ? 'formButtonActive' : 'formButton'}
              type='button'
              id='furnished'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !furnished && furnished !== null
                  ? 'formButtonActive'
                  : 'formButton'
              }
              type='button'
              id='furnished'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Address</label>
          <textarea
            className='formInputAddress'
            type='text'
            id='location'
            value={location}
            onChange={onMutate}
            required
          />

          {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
          <label className='formLabel'>Offer</label>
          <div className='formButtons'>
            <button
              className={offer ? 'formButtonActive' : 'formButton'}
              type='button'
              id='offer'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !offer && offer !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='offer'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>
          <label className='formLabel'>Regular Price</label>
          <div className='formPriceDiv'>
            <input
              className='formInputSmall'
              type='number'
              id='regularPrice'
              value={regularPrice}
              onChange={onMutate}
              min='50'
              max='750000000'
              required
            />
            <p className='formPriceText'>$ / Month</p>
          </div>


          {offer && (
            <>
              <label className='formLabel'>Discounted Price</label>
              <div className='formPriceDiv'>
                <input
                  className='formInputSmall'
                  type='number'
                  id='discountedPrice'
                  value={discountedPrice}
                  onChange={onMutate}
                  min='50'
                  max='750000000'
                  required={offer}
                />
                <p className='formPriceText'>$ / Month</p>
              </div>
            </>
          )}

          <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            Note: first image will be the cover image (max 6 imgs).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
          <button type='submit' className="primaryButton createListingButton">
            Lease @ Ease!
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateListing