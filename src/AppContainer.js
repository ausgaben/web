import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { NavigationContainer } from './navigation/NavigationContainer';
import classNames from 'classnames';

import styles from './AppContainer.scss';

const mapStateToProps = ({
  routing: {
    location: { pathname }
  }
}) => {
  let parts = pathname.split('/').filter(s => s.length);
  if (!parts.length) {
    parts.push('dashboard');
  }
  return {
    classNames: classNames(
      parts.reduce((classes, name) => {
        classes[name] = true;
        return classes;
      }, {})
    )
  };
};

export const AppContainer = withRouter(
  connect(mapStateToProps)(({ classNames, children }) => {
    return (
      <>
        <NavigationContainer />
        <main className={classNames}>{children}</main>
      </>
    );
  })
);
