import * as React from 'react';
import PropTypes from 'prop-types';
import { Toggle } from '../../form/Toggle'
import { Input } from '../../form/Input'

export class SpendingsNavigation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      monthly: props.checkingAccount.monthly,
      year: new Date().getFullYear(),
      month: new Date().getMonth()
    }
  }

  isYearValid = () => this.state.year > 2000 && this.state.year <= 2099;
  isMonthValid = () => this.state.year >= 1 && this.state.year <= 12;

  render () {
    return <>
      <nav id="spendingsNavigation">
        <Toggle
          id="monthly"
          value={this.state.monthly}
          states={[
            {
              label: "Monthly",
              value: true,
              style: "secondary",
              icon: "event"
            },
            {
              label: "All",
              value: false,
              style: "secondary",
              icon: "view_headline"
            }
          ]}
          disabled={this.props.isSubmitting}
          onChange={monthly => this.setState({monthly}, () => this.props.onUpdate(this.props.checkingAccount, 'monthly', this.state.monthly))}
        />
        {this.state.monthly && (<>
          <Input
            id="month"
            type="number"
            placeholder="e.g. '12"
            prepend="Month"
            min={1}
            max={12}
            isValid={this.isMonthValid()}
            value={this.state.month}
            onChange={month => this.setState({month}, () => this.props.onDateChange(this.state.year, this.state.month))}
          />
          <Input
            id="year"
            type="number"
            placeholder="e.g. '2018"
            prepend="Year"
            min={2000}
            max={2099}
            isValid={this.isYearValid()}
            value={this.state.year}
            onChange={year => this.setState({year}, () => this.props.onDateChange(this.state.year, this.state.month))}
          />
        </>)}
      </nav>
    </>
  }
}

SpendingsNavigation.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
};
