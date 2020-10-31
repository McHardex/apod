/* eslint-disable no-console */

import React, { useState, useEffect } from 'react';
import { RootState } from 'reducers';
import { getPictureOfTheDay } from 'actions/apod';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { formatDate, nextDay, previousDay } from 'utilities';
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

type Props = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const date = new Date();

const Apod: React.FC<Props> = ({ getPictureOfTheDay, picture, isLoading }) => {
  const [pictureOfTheDay, setPictureOfTheDay] = useState(picture);
  const [dateValue, setDateValue] = useState(formatDate(date));
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favorites') || '[]')
  );

  useEffect(() => {
    const storedPictureOfTheDay = JSON.parse(
      localStorage.getItem('pictureOfTheDay') || '{}'
    );

    if (storedPictureOfTheDay.url) {
      setPictureOfTheDay(storedPictureOfTheDay);
      setDateValue(storedPictureOfTheDay.date);
    } else {
      console.log(storedPictureOfTheDay, 'storedPictureOfTheDay');
      getPictureOfTheDay(dateValue);
    }
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

  // add favorite picture of the day
  const addFavourite = () => {
    const storedFavourites = JSON.parse(
      localStorage.getItem('favorites') || '[]'
    );
    const checkDiplicate = storedFavourites.some(
      (favorite: any) => favorite.date === picture.date
    );
    if (checkDiplicate) {
      console.log('exists');
    } else {
      storedFavourites.push(picture);
      setFavorites([...favorites, picture]);
      localStorage.setItem('favorites', JSON.stringify(storedFavourites));
    }
  };

  // preview favorite picture of the day
  const selectFavorite = (date: string) => {
    const selectedFavorite = favorites.find(
      (favorite: any) => favorite.date === date
    );

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
    if (dateValue !== previousDay(formatDate(new Date()))) {
      setDateValue(nextDate);
    }
  };

  return (
    <div className="app-container">
      {!pictureOfTheDay?.date && isLoading ? (
        <p>...loading...</p>
      ) : (
        <>
          <h1>{pictureOfTheDay.title}</h1>
          <div className="gallery-container">
            <button className="previous" onClick={handlePreviousDay}>
              next date
            </button>
            {pictureOfTheDay.media_type === 'video' ? (
              <video controls autoPlay loop muted preload="auto">
                <source src={pictureOfTheDay.url} type="video/mp4" />
                <source src={pictureOfTheDay.url} type="video/webm" />
                <p>
                  Your browser doesn't support HTML5 video. Here is a{' '}
                  <a href={pictureOfTheDay.url}>link to the video</a> instead.
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
            <button className="custom-btn" onClick={addFavourite}>
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

          <h3>Favorites</h3>
          <div className="favorites">
            {favorites.map((favorite: any) => (
              <button
                key={favorite.title}
                onClick={() => selectFavorite(favorite.date)}
              >
                <img src={favorite.url} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Apod);
