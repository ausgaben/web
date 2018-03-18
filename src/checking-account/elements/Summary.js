import * as React from 'react';
import { BaseCard } from '../../card/Element';
import PropTypes from 'prop-types';
import { CheckingAccount, Report } from '@ausgaben/models';
import { Money, Percent } from '../../money/Element'

import { Icon } from '../../button/Icon';

export class CheckingAccountSummary extends React.Component {
  render () {
    const {name, currency} = this.props.checkingAccount
    return (
      <BaseCard
        title={name}
        icon={<Icon>poll</Icon>}
      >
        {this.props.report && <Summary {...this.props.report} pending={this.props.pending} symbol={currency}/>}
      </BaseCard>
    );
  }
}

CheckingAccountSummary.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount).isRequired,
  report: PropTypes.instanceOf(Report),
  pending: PropTypes.number.isRequired,
};

const Summary = ({symbol, balance, income, spendings, savings, pending}) => (<table className="table">
  <thead>
  <tr>
    <th>
      Balance {savings > 0 && income > 0 && (<Percent>{balance / income}</Percent>)}
    </th>
    <th className="money">
      <Money symbol={symbol}>{balance}</Money>
    </th>
  </tr>
  </thead>
  <tbody>

  <tr>
    <td>
      Income
    </td>
    <td className="money">
      <Money symbol={symbol}>{income}</Money>
    </td>
  </tr>

  {spendings < 0 && income > 0 && (<tr>
    <td>
      Spendings (<Percent>{(spendings / income) * -1}</Percent>)
    </td>
    <td className="money">
      <Money symbol={symbol}>{spendings}</Money>
    </td>
  </tr>)}

  {savings < 0 && income > 0 && (<tr>
    <td>
      Savings {income && pending && <Percent>{(pending / income) * -1}</Percent>}
    </td>
    <td className="money">
      <Money symbol={symbol}>{savings}</Money>
    </td>
  </tr>)}

  {pending > 0 && (<tr>
    <td>
      Pending <span data-ng-if="vm.report.income &amp;&amp; vm.pending">(12%)</span>
    </td>
    <td className="money">
      <Money symbol={symbol}>{pending}</Money>
    </td>
  </tr>)}

  </tbody>
</table>)

