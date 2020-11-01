import React from 'react';
import { Picture } from 'types';
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
    <div>
      {favorites.length > 0 && (
        <>
          <div className="favorites-header">
            <h3>Favorites</h3>
            <button onClick={deleteAllFavorites}>Clear Favorites</button>
          </div>
          <div className="favorites">
            {favorites.map((favorite: Picture) => (
              <div
                className="favorite-image__wrapper"
                role="button"
                key={favorite.title}
                onClick={() => previewFavoritePicture(favorite.date)}
              >
                <img src={favorite.url} />
                <button className="delete" onClick={(e) => deleteSingleFavorite(e, favorite.id!)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritePictures;
