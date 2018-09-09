import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Report, Spending } from '@ausgaben/models';
import { CheckingAccountSettings } from './Settings';
import { CheckingAccountSummary } from './Summary';
import { SpendingsTable } from './SpendingsTable';
import { URIValue } from '@rheactorjs/value-objects';
import { NavigationContainer } from '../../navigation/NavigationContainer';
import { MainContainer } from '../../main/MainContainer';
import { Icon } from "../../button/Icon";
import { IconWithText } from "../../button/IconWithText";

import styles from './Styles.scss';
import { BaseCard } from '../../card/Element'

export class CheckingAccountPage extends React.Component {

  componentWillMount = () => {
    if (!this.props.list.length) {
      this.props.onFetchList()
    } else {
      if (!this.props.checkingAccount) {
        this.props.onFetch()
      } else {
        if (!this.props.spendings) {
          this.props.onFetchSpendings(this.props.checkingAccount)
        }
      }
    }
  }

  componentWillReceiveProps ({checkingAccount}) {
    if (checkingAccount !== this.props.checkingAccount) {
      this.props.onFetchSpendings(checkingAccount)
    }
  }

  render = () => {
    if (this.props.error) return <div className="alert alert-danger" role="alert">
      {this.props.error.message}
    </div>
    const {spendings, checkingAccount} = this.props;
    if (!checkingAccount) return null;

    const bookedSpendings = spendings && spendings.filter(({booked}) => booked)
    const pendingSpendings = spendings && spendings.filter(({booked}) => !booked)
    const onEdit = spending => this.props.onEditSpending(checkingAccount, spending)

    return (
      <>
        <NavigationContainer>
          <a
            className="btn btn-light"
            onClick={() => {
              this.props.history.push(`/new/spending/for/${encodeURIComponent(
                checkingAccount.$id.uuid.toString()
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

          {bookedSpendings && <BaseCard
            title="Booked"
            icon={<Icon>check</Icon>}
          >
            <SpendingsTable spendings={bookedSpendings} checkingAccount={checkingAccount} onEdit={onEdit}/>
          </BaseCard>}
          {pendingSpendings && <BaseCard
            title="Pending"
            icon={<Icon>hourglass_empty</Icon>}
          >
            <SpendingsTable spendings={pendingSpendings} checkingAccount={checkingAccount} onEdit={onEdit}/>
          </BaseCard>}
        </MainContainer>
      </>
    );
  };
}

CheckingAccountPage.propTypes = {
  onFetchList: PropTypes.func.isRequired,
  onFetch: PropTypes.func.isRequired,
  onFetchSpendings: PropTypes.func.isRequired,
  onEditSpending: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.instanceOf(CheckingAccount)).isRequired,
  checkingAccount: PropTypes.instanceOf(CheckingAccount),
  report: PropTypes.instanceOf(Report),
  onUpdate: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  pending: PropTypes.number.isRequired,
  spendings: PropTypes.arrayOf(PropTypes.instanceOf(Spending)),
};
