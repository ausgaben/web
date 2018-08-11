import * as React from "react";
import { Form } from "../../form/Form";
import PropTypes from "prop-types";
import { Input } from "../../form/Input";
import { NavigationContainer } from "../../navigation/NavigationContainer";
import { MainContainer } from "../../main/MainContainer";
import { IconWithText } from "../../button/IconWithText";
import { CheckingAccount } from "@ausgaben/models";

import styles from "./Add.scss";
import { Icon } from "../../button/Icon";
import { Toggle } from "../../form/Toggle";

const defaultState = () => ({
  category: "",
  title: "",
  amount: 0,
  saving: false,
  bookedAt: new Date(),
  booked: true,
})

export class Add extends React.Component {
  constructor(props) {
    super(props);
    this.state = defaultState();
  }

  isCategoryValid = () => this.state.category.length >= 1;
  isTitleValid = () => this.state.title.length >= 1;
  isAmountValid = () => `${this.state.amount}`.length >= 1;
  isValid = () => {
    return (
      this.isCategoryValid() && this.isTitleValid() && this.isAmountValid()
    );
  };

  componentWillMount = () => {
    if (!this.props.list.length) {
      this.props.onFetchList();
    } else {
      if (!this.props.checkingAccount) {
        this.props.onFetch();
      }
    }
  };

  componentWillReceiveProps({success}) {
    if (success === true) {
      this.setState(defaultState())
    }
  }

  render() {
    if (!this.props.checkingAccount) {
      return (
        <>
          <NavigationContainer />
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
          <Form
            title="add spending"
            onSubmit={() => this.props.onAddSpending(this.props.checkingAccount, this.state)}
            submitting={this.props.isAdding}
            valid={this.isValid()}
            error={this.props.error}
            icon={<Icon>add_circle_outline</Icon>}
          >
            <div className="description">
              <div className="input-with-toggle">
                <Input
                  id="category"
                  label="Category"
                  placeholder="e.g. 'Groceries'"
                  value={this.state.category}
                  isValid={this.isCategoryValid()}
                  onChange={category => this.setState({ category })}
                  disabled={this.props.isAdding}
                  tabindex={1}
                  autofocus
                />
                <Toggle
                  id="saving"
                  value={this.state.saving}
                  states={[
                    {
                      label: "Saving",
                      value: true,
                      style: "success",
                      icon: "trending_up"
                    },
                    { label: "No saving", value: false, icon: "clear" }
                  ]}
                  disabled={this.props.isAdding}
                  onChange={saving => this.setState({ saving })}
                />
              </div>
              <Input
                id="title"
                label="Title"
                placeholder="e.g. 'Whole Foods'"
                value={this.state.title}
                isValid={this.isTitleValid()}
                onChange={title => this.setState({ title })}
                disabled={this.props.isAdding}
                tabindex={2}
              />
            </div>
            <div className="input-with-toggle">
              <Input
                id="amount"
                label="Amount"
                type="number"
                placeholder="e.g. '1,234.56'"
                prepend={this.props.checkingAccount.currency}
                isValid={this.isAmountValid()}
                value={this.state.amount / 100}
                onChange={amount => this.setState({ amount: +amount * 100})}
                disabled={this.props.isAdding}
                tabindex={3}
              />
              <Toggle
                id="isSpending"
                value={this.state.amount >= 0}
                states={[
                  {
                    label: "Spending",
                    value: true,
                    style: "danger",
                    icon: "unarchive"
                  },
                  {
                    label: "Income",
                    value: false,
                    style: "success",
                    icon: "archive"
                  }
                ]}
                disabled={this.props.isAdding}
                onClick={isSpending =>
                  this.setState({
                    amount: isSpending
                      ? Math.abs(this.state.amount)
                      : -Math.abs(this.state.amount)
                  })
                }
              />
            </div>
            <div className="booked">
              <div className="input-with-toggle">
                <Input
                  id="bookedAt"
                  label="Booked At"
                  type="date"
                  value={this.state.bookedAt.toISOString().substr(0, 10)}
                  onChange={bookedAt =>
                    this.setState({ bookedAt: new Date(bookedAt) })
                  }
                  disabled={this.props.isAdding}
                  tabindex={4}
                />
                <Toggle
                  id="booked"
                  value={this.state.booked}
                  states={[
                    { label: "Booked", value: true, style: "success" },
                    {
                      label: "Pending",
                      value: false,
                      style: "danger",
                      icon: "hourglass_empty"
                    }
                  ]}
                  disabled={this.props.isAdding}
                  onChange={booked => this.setState({ booked })}
                />
              </div>
            </div>
          </Form>
        </MainContainer>
      </>
    );
  }
}

Add.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount),
  list: PropTypes.arrayOf(PropTypes.instanceOf(CheckingAccount)).isRequired,
  onAddSpending: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  success: PropTypes.bool.isRequired,
  isAdding: PropTypes.bool.isRequired
};
