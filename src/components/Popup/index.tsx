import React, { useEffect } from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { Picture } from 'types';
import { RootState } from 'reducers';
import { connect } from 'react-redux';
import './index.scss';

// actions
import { getPreviousOrNextPicture } from 'actions/apod';

const mapStateToProps = (state: RootState) => ({
  picture: state.pictures.queryPicture.picture,
  isLoading: state.pictures.queryPicture.loading
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      getPreviousOrNextPicture
    },
    dispatch
  );
};

type Props = {
  getPreviousOrNextPicture: (date: string) => void;
  picture: Picture;
  isLoading: boolean;
  date: string;
};

const Popup: React.FC<Props> = ({ getPreviousOrNextPicture, picture, isLoading, date }) => {
  useEffect(() => {
    getPreviousOrNextPicture(date);
  }, []);
  return (
    <div className="image-popup">
      {isLoading ? <span className="image-loading">loading</span> : <img src={picture.url} />}
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Popup);
