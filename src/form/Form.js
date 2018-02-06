import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './Form.scss';
import { IconButton } from '../button/IconButton';

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(ev) {
    ev.preventDefault();
    this.props.onSubmit();
  }

  render() {
    return (
      <form className="card">
        <div className="card-header">
          <span className="title">{this.props.title}</span>
          {this.props.icon}
        </div>
        <div className="card-body">{this.props.children}</div>
        <div className="card-footer">
          <div className="controls">
            {!this.props.submitting &&
              !this.props.error && (
                <IconButton
                  icon="send"
                  disabled={!this.props.valid}
                  onClick={this.onSubmit}
                >
                  Submit
                </IconButton>
              )}
            {this.props.submitting && (
              <IconButton icon="hourglass_empty" disabled spin>
                <em>Sending ...</em>
              </IconButton>
            )}
            {!this.props.submitting &&
              this.props.error && (
                <IconButton
                  icon="info"
                  disabled={!this.props.valid}
                  onClick={this.onSubmit}
                >
                  Submit
                </IconButton>
              )}
            {this.props.controls}
          </div>
          {this.props.error && (
            <div className="alert alert-danger" role="alert">
              {this.props.error.message}
            </div>
          )}
        </div>
      </form>
    );
  }
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  controls: PropTypes.element,
  valid: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error),
  icon: PropTypes.element
};
