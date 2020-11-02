/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import { RootState } from 'reducers';
import { Picture } from 'types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import './index.scss';

// Components
import RenderErrorMessage from 'components/RenderErrorMessage';
import FavoritePictures from 'components/FavoritePictures';
import Portal from 'components/Portal';
import Popup from 'components/Popup';
import Loader from 'components/Loader';

// Utils
import { formatDate, nextDay, previousDay } from 'utilities';

// Actions
import { getPictureOfTheDay } from 'actions/apod';

// Services
import firebaseService from 'services/firebaseService';

// Images
import { ReactComponent as LeftChevron } from 'assets/images/left-chevron.svg';
import { ReactComponent as RightChevron } from 'assets/images/right-chevron.svg';

const mapStateToProps = (state: RootState) => ({
  picture: state.pictures.pictureOfTheDay.picture,
  isLoading: state.pictures.pictureOfTheDay.loading
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      getPictureOfTheDay
    },
    dispatch
  );
};

type Props = {
  getPictureOfTheDay: (date: string) => void;
  picture: Picture;
  isLoading: boolean;
};

type HoverValue = {
  id: string;
  date: string;
};

const defaultPicture = {
  id: '',
  msg: '',
  copyright: '',
  date: '',
  explanation: '',
  hdurl: '',
  media_type: '',
  service_version: '',
  title: '',
  url: ''
};

export const Apod: React.FC<Props> = ({
  getPictureOfTheDay,
  picture = defaultPicture,
  isLoading
}) => {
  const favoritesRef = useRef<HTMLDivElement>(null);
  const initialDateValue = localStorage.getItem('pictureOfTheDay');

  const [dateValue, setDateValue] = useState(
    initialDateValue ? JSON.parse(initialDateValue).date : formatDate(new Date())
  );
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites') || '[]'));
  const [hoverValue, setHoverValues] = useState<HoverValue>({ id: '', date: '' });

  const getFavoritePictures = async () => {
    const favPicturesFromFirebase = await Promise.all([firebaseService.get()]);
    setFavorites(favPicturesFromFirebase[0]);
    localStorage.setItem('favorites', JSON.stringify(favPicturesFromFirebase[0]));
  };

  useEffect(() => {
    const storedPictureOfTheDay = JSON.parse(localStorage.getItem('pictureOfTheDay') || '{}');

    if (storedPictureOfTheDay.url) {
      setDateValue(storedPictureOfTheDay.date);
    } else {
      const currentDate = formatDate(new Date());
      setDateValue(currentDate);
      getPictureOfTheDay(currentDate);
    }
    getFavoritePictures();
  }, []);

  const getUpdatedPictureOfTheDay = async () => {
    getPictureOfTheDay(dateValue || formatDate(new Date()));
  };

  useEffect(() => {
    getUpdatedPictureOfTheDay();
  }, [dateValue]);

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setDateValue(e.target.value);
  };

  // Add picture of the day to favorites
  const addFavorite = () => {
    const storedFavourites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const checkDiplicate = storedFavourites.some(
      (favorite: Picture) => favorite.date === picture.date
    );
    if (!checkDiplicate) {
      storedFavourites.push(picture);
      localStorage.setItem('favorites', JSON.stringify(storedFavourites));
      setFavorites([...favorites, picture]);

      firebaseService
        .create(picture)
        .then(() => {
          getFavoritePictures();
        })
        .catch((e) => {
          console.log(e);
        });
    }

    if (favoritesRef.current) {
      favoritesRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };

  // Preview favorite picture of the day
  const previewFavoritePicture = (date: string) => {
    const selectedFavorite = favorites.find((favorite: Picture) => favorite.date === date);
    setDateValue(selectedFavorite.date);
  };

  // Get previous picture of the day
  const handlePreviousDay = () => {
    const prevDate = previousDay(dateValue);
    setDateValue(prevDate);
  };

  // Get Next picture of the day
  const handleNextDay = () => {
    const nextDate = nextDay(dateValue);
    setDateValue(nextDate);
  };

  // Delete a single favorite picture
  const deleteSingleFavorite = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.stopPropagation();
    const filteredResult = favorites.filter((favorite: Picture) => favorite.id !== id);
    setFavorites(filteredResult);

    firebaseService
      .delete(id)
      .then(() => {
        getFavoritePictures();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Delete all favorite pictures
  const deleteAllFavorites = () => {
    setFavorites([]);
    firebaseService
      .deleteCollection()
      .then(() => {
        getFavoritePictures();
      })
      .catch((e) => console.log(e));
  };

  // Handle Load picture of the day on hover
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = e.currentTarget as HTMLButtonElement;
    const dataValue = el.getAttribute('data-id');
    setHoverValues({
      id: el.id,
      date: dataValue!
    });
  };

  // Reset hover state
  const handleMouseLeave = () => {
    setHoverValues({
      id: '',
      date: ''
    });
  };

  const rescueUser = () => {
    setDateValue(process.env.REACT_APP_RESCUE_USER_DATE);
  };

  if (isLoading)
    return (
      <div className="app-container">
        <Loader />;
      </div>
    );

  if (!picture.title && !isLoading)
    return (
      <div className="app-container">
        <RenderErrorMessage
          prevDay={handlePreviousDay}
          rescueUser={rescueUser}
          errorMessage={picture.msg!}
          date={dateValue}
        />
      </div>
    );

  return (
    <div className="app-container">
      {hoverValue.id && (
        <Portal id={hoverValue.id}>
          <Popup date={hoverValue.date} />
        </Portal>
      )}
      <div className="picture-container">
        <h1 className="title">{picture.title}</h1>

        <div className="gallery-container">
          <button
            className="back-btn"
            id="previous-picture"
            data-testid="previous-picture"
            data-id={previousDay(dateValue)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handlePreviousDay}
          >
            <LeftChevron width="20px" />
          </button>
          {picture.media_type === 'video' ? (
            <video controls autoPlay loop muted preload="auto">
              <p>
                Your browser doesn't support HTML5 video. Here is a&nbsp;
                <a href={picture.url}>link to the video</a>&nbsp; instead.
              </p>
            </video>
          ) : (
            <img src={picture.url} alt={picture.title} />
          )}

          <button
            className="next-btn"
            id="next-picture"
            data-id={nextDay(dateValue)}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleNextDay}
          >
            <RightChevron width="20px" />
          </button>
        </div>

        <div className="buttons">
          <button className="custom-btn" onClick={addFavorite}>
            Set favorite
          </button>
          <input
            type="date"
            className="custom-btn"
            min={formatDate(new Date('1995-06-16'))}
            max={formatDate(new Date())}
            value={dateValue ? dateValue : ''}
            onChange={handleDateChange}
          />
        </div>
        <div className="description">
          <p>{picture.explanation}</p>
        </div>
      </div>
      <div ref={favoritesRef}>
        {favorites.length > 0 && (
          <FavoritePictures
            favorites={favorites}
            deleteSingleFavorite={deleteSingleFavorite}
            deleteAllFavorites={deleteAllFavorites}
            previewFavoritePicture={previewFavoritePicture}
          />
        )}
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Apod);
