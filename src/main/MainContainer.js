import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import styles from './MainContainer.scss';

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

export const MainContainer = withRouter(
  connect(mapStateToProps)(({ classNames, children }) => {
    return <main className={classNames}>{children}</main>;
  })
);
