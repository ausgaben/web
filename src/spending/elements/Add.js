import * as React from 'react';
import { Form } from '../../form/Form';
import PropTypes from 'prop-types';
import { Input } from '../../form/Input';

import styles from './Add.scss';
import { Icon } from '../../button/Icon';

export class Add extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      category: '',
      title: '',
      amount: '',
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

  render () {
    return (
      <Form
        title="add spending"
        onSubmit={() => this.props.onAddSpending(this.state.name)}
        submitting={this.props.submitting}
        valid={this.isValid()}
        error={this.props.error}
        icon={<Icon>add_circle_outline</Icon>}
      >
        <div className='description'>
          <Input
            id="category"
            label="Category"
            placeholder="e.g. 'Groceries'"
            isValid={this.isCategoryValid()}
            onChange={category => this.setState({category})}
            disabled={this.props.submitting}
          />
          <Input
            id="title"
            label="Title"
            placeholder="e.g. 'Whole Foods'"
            isValid={this.isTitleValid()}
            onChange={title => this.setState({title})}
            disabled={this.props.submitting}
          />
        </div>
        <div className='amount-with-options'>
          <Input
            id="amount"
            label="Amount"
            placeholder="e.g. '1,234.56'"
            prepend={this.props.checkingAccount.currency}
            isValid={this.isAmountValid()}
            onChange={amount => this.setState({amount})}
            disabled={this.props.submitting}
          />
        </div>
      </Form>
    );
  }
}

Add.propTypes = {
  checkingAccount: PropTypes.object.isRequired,
  onAddSpending: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error)
};
