import React from 'react';
import { Picture } from 'types';
import { ReactComponent as DeleteBtn } from 'images/dustbin.svg';
import './index.scss';

type Props = {
  favorites: Picture[];
  deleteAllFavorites: () => void;
  previewFavoritePicture: (date: string) => void;
  deleteSingleFavorite: (e: React.MouseEvent<HTMLButtonElement>, date: string) => void;
};

const FavoritePictures: React.FC<Props> = ({
  favorites,
  deleteAllFavorites,
  previewFavoritePicture,
  deleteSingleFavorite
}) => {
  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h3>Favorite Picture(s) of the Day</h3>
        <button onClick={deleteAllFavorites} className="delete-all">
          Clear Favorites
          <DeleteBtn width="20px" height="20px" fill="#fff" stroke="#fff" />
        </button>
      </div>
      <div className="favorites">
        {favorites.map((favorite: Picture) => (
          <div
            className="favorite-image__wrapper"
            role="button"
            key={favorite.title}
            onClick={() => previewFavoritePicture(favorite.date)}
          >
            <img className="thumbnail" src={favorite.url} alt={favorite.title} />
            <button className="delete" onClick={(e) => deleteSingleFavorite(e, favorite.id!)}>
              Delete
            </button>
            <img src={favorite.url} alt={favorite.title} className="large-img" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePictures;
