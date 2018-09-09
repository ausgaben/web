import * as React from "react";
import { Form } from "../../form/Form";
import PropTypes from "prop-types";
import { Input } from "../../form/Input";
import { CheckingAccount } from "@ausgaben/models";

import styles from "./SpendingForm.scss";
import { Toggle } from "../../form/Toggle";

export class SpendingForm extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      ...this.props.defaultState
    };
  }

  isCategoryValid = () => this.state.category.length >= 1;
  isTitleValid = () => this.state.title.length >= 1;
  isAmountValid = () => `${this.state.amount}`.length >= 1;
  isValid = () => {
    return (
      this.isCategoryValid() && this.isTitleValid() && this.isAmountValid()
    );
  };

  componentWillReceiveProps ({success}) {
    if (success === true) {
      this.setState({
        ...this.props.defaultState
      })
    }
  }

  render () {
    return (

      <Form
        title={this.props.title}
        onSubmit={() => this.props.onSubmit(this.state)}
        submitting={this.props.isSubmitting}
        valid={this.isValid()}
        error={this.props.error}
        icon={this.props.icon}
      >
        <div className="description">
          <div className="input-with-toggle">
            <Input
              id="category"
              label="Category"
              placeholder="e.g. 'Groceries'"
              value={this.state.category}
              isValid={this.isCategoryValid()}
              onChange={category => this.setState({category})}
              disabled={this.props.isSubmitting}
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
                {label: "No saving", value: false, icon: "clear"}
              ]}
              disabled={this.props.isSubmitting}
              onChange={saving => this.setState({saving})}
            />
          </div>
          <Input
            id="title"
            label="Title"
            placeholder="e.g. 'Whole Foods'"
            value={this.state.title}
            isValid={this.isTitleValid()}
            onChange={title => this.setState({title})}
            disabled={this.props.isSubmitting}
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
            onChange={amount => this.setState({amount: +amount * 100})}
            disabled={this.props.isSubmitting}
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
            disabled={this.props.isSubmitting}
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
                this.setState({bookedAt: new Date(bookedAt)})
              }
              disabled={this.props.isSubmitting}
              tabindex={4}
            />
            <Toggle
              id="booked"
              value={this.state.booked}
              states={[
                {label: "Booked", value: true, style: "success"},
                {
                  label: "Pending",
                  value: false,
                  style: "danger",
                  icon: "hourglass_empty"
                }
              ]}
              disabled={this.props.isSubmitting}
              onChange={booked => this.setState({booked})}
            />
          </div>
        </div>
      </Form>
    );
  }
}

SpendingForm.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount).isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.instanceOf(Error),
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  success: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  defaultState: PropTypes.shape({
    category: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    saving: PropTypes.bool.isRequired,
    bookedAt: PropTypes.instanceOf(Date).isRequired,
    booked: PropTypes.bool.isRequired,
  }).isRequired
};
