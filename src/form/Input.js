import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
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
          onBlur={this.props.onBlur}
        />
        {this.props.helpText && (
          <small className="form-text text-muted">{this.props.helpText}</small>
        )}
      </div>
    );
  }
}

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  helpText: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  isValid: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func
};
