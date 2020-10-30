import React, { useEffect } from 'react';
import { RootState } from 'reducers';
import { getPictureOfTheDay } from 'actions/apod';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import moment from 'moment';

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

const Apod: React.FC<Props> = ({ getPictureOfTheDay, picture, isLoading }) => {
  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    getPictureOfTheDay(today);
  }, []);
  return <div>Loading {isLoading}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Apod);
