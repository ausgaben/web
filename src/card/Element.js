import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Styles.scss';

export class Card extends React.Component {
  render = () => (
    <div className="card">
      <div className="card-header">
        <span className="title">{this.props.title}</span>
        {this.props.icon}
      </div>
      {this.props.errors &&
        this.props.errors.length && (
          <div className="card-body">
            {React.Children.map(this.props.errors, ({ message }) => (
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            ))}
          </div>
        )}
      <ul className="list-group list-group-flush">
        {React.Children.map(this.props.children, child => (
          <li className="list-group-item">{child}</li>
        ))}
      </ul>
    </div>
  );
}

Card.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)),
  icon: PropTypes.element,
  title: PropTypes.string.isRequired
};
