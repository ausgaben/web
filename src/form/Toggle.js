import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Toggle extends React.Component {
  render() {
    return (
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        <label className="btn btn-secondary active">
          <input
            type="radio"
            name="options"
            id="option1"
            autoComplete="off"
            checked
          />
          <span>Active</span>
        </label>
        <label className="btn btn-secondary">
          <input type="radio" name="options" id="option2" autoComplete="off" />
          <span>Radio</span>
        </label>
        <label className="btn btn-secondary">
          <input type="radio" name="options" id="option3" autoComplete="off" />
          <span>Radio</span>
        </label>
      </div>
    );
  }
}

Toggle.propTypes = {
  id: PropTypes.string.isRequired
};
