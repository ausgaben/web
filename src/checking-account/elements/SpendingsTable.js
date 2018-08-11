import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Spending } from '@ausgaben/models';
import { Money } from '../../money/Element'
import { Date } from '../../date/Element'

export const SpendingsTable = ({checkingAccount: {currency}, spendings}) => (<table className="table spendings">
  <tbody>
  {spendings
    .sort(({category: c1}, {category: c2}) => c2 - c1)
    .sort(({bookedAt: t1}, {bookedAt: t2}) => t2.getTime() - t1.getTime())
    .map(({amount, bookedAt, category, saving, title, $id: {uuid}}, idx, array) => <React.Fragment key={uuid.toString()}>
      {(idx === 0 || (array[idx - 1] && array[idx - 1].category !== array[idx].category)) && <tr>
        <th colSpan={3}>
          {category}
        </th>
      </tr>}
      <tr>
        <td>
          <Date>{bookedAt}</Date>
        </td>
        <td>
          {title}
        </td>
        <td>
          <Money symbol={currency}>{amount}</Money>
        </td>
      </tr>
    </React.Fragment>)}
  </tbody>
</table>)


SpendingsTable.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount).isRequired,
  spendings: PropTypes.arrayOf(PropTypes.instanceOf(Spending)).isRequired
};
