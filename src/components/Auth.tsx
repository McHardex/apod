import React from 'react';
import { RootState } from 'reducers';
import { login, logout } from 'actions/user';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => ({
  username: state.user.username
});

const mapDispatchToProps = { login, logout };

type Props = ReturnType<typeof mapStateToProps> & typeof mapDispatchToProps;

const Auth: React.FunctionComponent<Props> = ({ username }) => {
  return <div>{username}</div>;
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
