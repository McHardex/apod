/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { RootState } from 'reducers';
import { Picture } from 'types';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

// utils
import { formatDate, nextDay, previousDay } from 'utilities';

// actions
import { getPictureOfTheDay } from 'actions/apod';

// services
import firebaseService from 'services/firebaseService';

// components
import RenderErrorMessage from 'components/RenderErrorMessage';
import FavoritePictures from 'components/FavoritePictures';

// style
import './index.scss';

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

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const date = new Date();

const Apod: React.FC<Props> = ({ getPictureOfTheDay, picture, isLoading }) => {
  const [pictureOfTheDay, setPictureOfTheDay] = useState(picture);
  const [dateValue, setDateValue] = useState(
    JSON.parse(localStorage.getItem('pictureOfTheDay') || '{}').date
  );
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites') || '[]'));

  const getFavoritePictures = async () => {
    const favPicturesFromFirebase = await Promise.all([firebaseService.get()]);
    setFavorites(favPicturesFromFirebase[0]);
    localStorage.setItem('favorites', JSON.stringify(favPicturesFromFirebase[0]));
  };

  useEffect(() => {
    const storedPictureOfTheDay = JSON.parse(localStorage.getItem('pictureOfTheDay') || '{}');

    if (storedPictureOfTheDay.url) {
      setPictureOfTheDay(storedPictureOfTheDay);
      setDateValue(storedPictureOfTheDay.date);
    } else {
      const currentDate = formatDate(new Date());
      setDateValue(currentDate);
      getPictureOfTheDay(currentDate);
    }
    getFavoritePictures();
  }, []);

  const getUpdatedPictureOfTheDay = async () => {
    const res = await getPictureOfTheDay(dateValue);
    setPictureOfTheDay(res);
  };

  useEffect(() => {
    getUpdatedPictureOfTheDay();
  }, [dateValue]);

  // handle date change
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
  };

  // preview favorite picture of the day
  const previewFavoritePicture = (date: string) => {
    const selectedFavorite = favorites.find((favorite: Picture) => favorite.date === date);
    setPictureOfTheDay(selectedFavorite);
    setDateValue(selectedFavorite.date);
  };

  // Previous date button
  const handlePreviousDay = () => {
    const prevDate = previousDay(dateValue);
    setDateValue(prevDate);
  };

  // Next date button
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

  return (
    <div className="app-container">
      {isLoading ? (
        <h1>Loading................</h1>
      ) : (
        <>
          {!pictureOfTheDay?.title && !isLoading ? (
            <RenderErrorMessage
              prevDay={handlePreviousDay}
              nextDay={handleNextDay}
              errorMessage={picture.msg}
            />
          ) : (
            <>
              <h1>{pictureOfTheDay.title}</h1>
              <div className="gallery-container">
                <button className="previous" onClick={handlePreviousDay}>
                  prev date
                </button>
                {pictureOfTheDay.media_type === 'video' ? (
                  <video controls autoPlay loop muted preload="auto">
                    <source src={pictureOfTheDay.url} type="video/mp4" />
                    <source src={pictureOfTheDay.url} type="video/webm" />
                    <p>
                      Your browser doesn't support HTML5 video. Here is a&nbsp;
                      <a href={pictureOfTheDay.url}>link to the video</a>&nbsp; instead.
                    </p>
                  </video>
                ) : (
                  <img src={pictureOfTheDay.url} />
                )}
                <button className="next" onClick={handleNextDay}>
                  Next date
                </button>
              </div>
              <div className="buttons">
                <button className="custom-btn" onClick={addFavorite}>
                  Make favourite
                </button>
                <input
                  type="date"
                  className="custom-btn"
                  min="16-06-1995"
                  max={formatDate(date)}
                  value={dateValue}
                  onChange={handleDateChange}
                />
              </div>
              <div className="description">
                <p>{pictureOfTheDay.explanation}</p>
              </div>
            </>
          )}
        </>
      )}
      <FavoritePictures
        favorites={favorites}
        deleteSingleFavorite={deleteSingleFavorite}
        deleteAllFavorites={deleteAllFavorites}
        previewFavoritePicture={previewFavoritePicture}
      />
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Apod);
