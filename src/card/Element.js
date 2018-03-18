import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Styles.scss';

export class BaseCard extends React.Component {
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
      {this.props.children}
    </div>
  );
}

BaseCard.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.instanceOf(Error)),
  icon: PropTypes.element,
  title: PropTypes.string.isRequired
};

export const ListCard = props => (
  <BaseCard {...props}>
    <ul className="list-group list-group-flush">
      {React.Children.map(props.children, child => (
        <li className="list-group-item">{child}</li>
      ))}
    </ul>
  </BaseCard>
);

export const Card = props => (
  <BaseCard {...props}>
    <div className="card-body">{props.children}</div>
  </BaseCard>
);
