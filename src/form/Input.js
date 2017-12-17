import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      hasInput: false
    };
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor={this.props.id}>{this.props.label}</label>
        <input
          className={classNames({
            'form-control': true,
            'is-invalid':
              !this.props.disabled &&
              this.state.hasInput &&
              !this.props.isValid,
            'is-valid':
              !this.props.disabled && this.state.hasInput && this.props.isValid
          })}
          value={this.state.value}
          onChange={({ target: { value } }) =>
            this.setState({ value, hasInput: true }, () =>
              this.props.onChange(this.state.value)
            )
          }
          id={this.props.id}
          placeholder={this.props.placeholder}
          type={this.props.type || 'text'}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isValid: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
