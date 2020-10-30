import React, { useEffect } from 'react';
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

const Products: React.FC<Props> = ({ cart, loadProducts }) => {
  useEffect(() => {
    loadProducts();
  });
  return <div>my cart here man</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Products);
