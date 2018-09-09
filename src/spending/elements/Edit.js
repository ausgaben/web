import * as React from "react";
import PropTypes from "prop-types";
import { NavigationContainer } from "../../navigation/NavigationContainer";
import { MainContainer } from "../../main/MainContainer";
import { IconWithText } from "../../button/IconWithText";
import { CheckingAccount, Spending } from "@ausgaben/models";
import { Icon } from "../../button/Icon";
import { SpendingForm } from './SpendingForm'

export class Edit extends React.Component {
  componentWillMount = () => {
    if (!this.props.spending) {
      this.props.onFetchSpending();
    }
  };

  render () {
    if (!this.props.spending || !this.props.checkingAccount) {
      return (
        <>
          <NavigationContainer/>
          <MainContainer>
            <div className="card">
              <div className="card-body">
                <IconWithText icon={<Icon spin>hourglass_empty</Icon>}>
                  Fetching ...
                </IconWithText>
              </div>
            </div>
          </MainContainer>
        </>
      );
    }

    const {
      spending: {
        category,
        title,
        amount,
        saving,
        bookedAt,
        booked,
      }
    } = this.props;

    return (
      <>
        <NavigationContainer>
          <a
            className="btn btn-light"
            onClick={() => {
              this.props.history.push(
                `/checking-account/${encodeURIComponent(
                  this.props.checkingAccount.$id.uuid.toString()
                )}`
              );
            }}
          >
            <IconWithText icon={<Icon>account_balance_wallet</Icon>}>
              <span>{this.props.checkingAccount.name}</span>
            </IconWithText>
          </a>
        </NavigationContainer>
        <MainContainer>
          <SpendingForm
            checkingAccount={this.props.checkingAccount}
            onSubmit={data => this.props.onEdit(this.props.spending, data)}
            error={this.props.error}
            success={this.props.success}
            isSubmitting={this.props.isSubmitting}
            icon={<Icon>create</Icon>}
            title={"edit spending"}
            defaultState={({
              category,
              title,
              amount,
              saving,
              bookedAt,
              booked,
            })}
          />
        </MainContainer>
      </>
    );
  }
}

Edit.propTypes = {
  spending: PropTypes.instanceOf(Spending),
  checkingAccount: PropTypes.instanceOf(CheckingAccount),
  onFetchSpending: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  success: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired
};
