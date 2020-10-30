import React from 'react';
import { RootState } from 'reducers';
import { loadProducts } from 'actions/product';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';

const mapStateToProps = (state: RootState) => ({
  cart: state.products.cart
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      loadProducts
    },
    dispatch
  );
};

type Props = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

const Products: React.FunctionComponent<Props> = ({ cart }) => {
  return <div>{cart}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
