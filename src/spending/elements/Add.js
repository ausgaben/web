import * as React from 'react';
import { Form } from '../../form/Form';
import PropTypes from 'prop-types';
import { Input } from '../../form/Input';
import { NavigationContainer } from '../../navigation/NavigationContainer';
import { MainContainer } from '../../main/MainContainer';
import { IconWithText } from "../../button/IconWithText";
import { CheckingAccount } from '@ausgaben/models';

import styles from './Add.scss';
import { Icon } from '../../button/Icon';
import { Toggle } from '../../form/Toggle'

export class Add extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      category: '',
      title: '',
      amount: '',
      saving: false,
      type: 'spending',
      bookedAt: new Date(),
      booked: false,
    };
  }

  isCategoryValid = () => this.state.category.length >= 1;
  isTitleValid = () => this.state.title.length >= 1;
  isAmountValid = () => this.state.amount.length >= 1;
  isValid = () => {
    return this.isCategoryValid()
      && this.isTitleValid()
      && this.isAmountValid()
  };

  componentWillMount = () => {
    if (!this.props.list.length) {
      this.props.onFetchList()
    } else {
      if (!this.props.checkingAccount) {
        this.props.onFetch()
      }
    }
  }

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
      )
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
            onSubmit={() => this.props.onAddSpending(this.state.name)}
            submitting={this.props.submitting}
            valid={this.isValid()}
            error={this.props.error}
            icon={<Icon>add_circle_outline</Icon>}
          >
            <div className='description'>
              <div className="input-with-toggle">
                <Input
                  id="category"
                  label="Category"
                  placeholder="e.g. 'Groceries'"
                  isValid={this.isCategoryValid()}
                  onChange={category => this.setState({category})}
                  disabled={this.props.submitting}
                />
                <Toggle
                  id="saving"
                  value={this.state.saving}
                  states={{'Saving': true, 'No saving': false}}
                  disabled={this.props.submitting}
                  onChange={saving => this.setState({saving})}/>
              </div>
              <Input
                id="title"
                label="Title"
                placeholder="e.g. 'Whole Foods'"
                isValid={this.isTitleValid()}
                onChange={title => this.setState({title})}
                disabled={this.props.submitting}
              />
            </div>
            <div className='input-with-toggle'>
              <Input
                id="amount"
                label="Amount"
                placeholder="e.g. '1,234.56'"
                prepend={this.props.checkingAccount.currency}
                isValid={this.isAmountValid()}
                onChange={amount => this.setState({amount})}
                disabled={this.props.submitting}
              />
              <Toggle
                id="type"
                value={this.state.type}
                states={{'Spending': 'spending', 'Income': 'income'}}
                disabled={this.props.submitting}
                onChange={type => this.setState({type})}/>
            </div>
            <div className='booked'>
              <Input
                id="bookedAt"
                label="Booked At"
                type="date"
                value={this.state.bookedAt}
                onChange={bookedAt => this.setState({bookedAt})}
                disabled={this.props.submitting}
              />
              <Toggle
                id="booked"
                value={this.state.booked}
                states={{'Booked': true, 'Pending': false}}
                disabled={this.props.submitting}
                onChange={booked => this.setState({booked})}/>
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
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error)
};
