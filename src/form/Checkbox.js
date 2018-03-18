import * as React from 'react';
import PropTypes from 'prop-types';

export class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked === undefined ? false : props.checked
    };
  }

  render() {
    return (
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          value="1"
          id={this.props.id}
          disabled={this.props.disabled}
          checked={this.state.checked}
          onChange={() =>
            this.setState({ checked: !this.state.checked }, () =>
              this.props.onChange(this.state.checked)
            )
          }
        />
        <label className="form-check-label" htmlFor={this.props.id}>
          {this.props.label}
        </label>
      </div>
    );
  }
}

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool
};
