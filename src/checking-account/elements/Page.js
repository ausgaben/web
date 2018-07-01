import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Report } from '@ausgaben/models';
import { CheckingAccountSettings } from './Settings';
import { CheckingAccountSummary } from './Summary';
import { URIValue } from '@rheactorjs/value-objects';
import { NavigationContainer } from '../../navigation/NavigationContainer';
import { MainContainer } from '../../main/MainContainer';
import { Icon } from "../../button/Icon";
import { IconWithText } from "../../button/IconWithText";

import styles from './Styles.scss';

export class CheckingAccountPage extends React.Component {

  componentWillMount = () => {
    if (!this.props.list.length) {
      this.props.onFetchList()
    } else {
      if (!this.props.checkingAccount) {
        this.props.onFetch()
      }
    }
  }

  render = () => {
    if (this.props.error) return <div className="alert alert-danger" role="alert">
      {this.props.error.message}
    </div>
    if (!this.props.checkingAccount) return null;
    return (
      <>
        <NavigationContainer>
          <a
            className="btn btn-light"
            onClick={() => {
              this.props.history.push(`/new/spending/for/${encodeURIComponent(
                this.props.checkingAccount.$id.uuid.toString()
              )}`);
            }}
          >
            <IconWithText icon={<Icon>add_circle_outline</Icon>}>
              Add spending
            </IconWithText>
          </a>
        </NavigationContainer>
        <MainContainer>
          <CheckingAccountSummary {...this.props} />
          <CheckingAccountSettings {...this.props}/>
        </MainContainer>
      </>
    );
  };
}

CheckingAccountPage.propTypes = {
  onFetchList: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.instanceOf(CheckingAccount)).isRequired,
  checkingAccount: PropTypes.instanceOf(CheckingAccount),
  report: PropTypes.instanceOf(Report),
  onUpdate: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  pending: PropTypes.number.isRequired
};
