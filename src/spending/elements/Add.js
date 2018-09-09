import * as React from "react";
import PropTypes from "prop-types";
import { NavigationContainer } from "../../navigation/NavigationContainer";
import { MainContainer } from "../../main/MainContainer";
import { IconWithText } from "../../button/IconWithText";
import { CheckingAccount } from "@ausgaben/models";
import { Icon } from "../../button/Icon";
import { SpendingForm } from './SpendingForm'

export class Add extends React.Component {
  componentWillMount = () => {
    if (!this.props.checkingAccount) {
      this.props.onFetchCheckingAccount();
    }
  };

  render () {
    if (!this.props.checkingAccount) {
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
            onSubmit={this.props.onAdd.bind(undefined, this.props.checkingAccount)}
            error={this.props.error}
            success={this.props.success}
            isSubmitting={this.props.isSubmitting}
            icon={<Icon>add_circle_outline</Icon>}
            title={"add spending"}
            defaultState={({
              category: "",
              title: "",
              amount: 0,
              saving: false,
              bookedAt: new Date(),
              booked: true,
            })}
          />
        </MainContainer>
      </>
    );
  }
}

Add.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount),
  onFetchCheckingAccount: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  success: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired
};
