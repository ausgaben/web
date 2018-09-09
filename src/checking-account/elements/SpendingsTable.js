import * as React from 'react';
import PropTypes from 'prop-types';
import { CheckingAccount, Spending } from '@ausgaben/models';
import { Money } from '../../money/Element'
import { Date } from '../../date/Element'
import { IconWithText } from '../../button/IconWithText'
import { Icon } from '../../button/Icon'

export const SpendingsTable = ({checkingAccount: {currency}, spendings, onEdit}) => (<table className="table spendings">
  <tbody>
  {spendings
    .sort(({category: c1}, {category: c2}) => c2 - c1)
    .sort(({bookedAt: t1}, {bookedAt: t2}) => t2.getTime() - t1.getTime())
    .map((spending, idx, array) => {
      const {amount, bookedAt, category, saving, title, $id: {uuid}} = spending;
      return <React.Fragment key={uuid.toString()}>
        {(idx === 0 || (array[idx - 1] && array[idx - 1].category !== array[idx].category)) && <tr>
          <th colSpan={3}>
            {category}
          </th>
        </tr>}
        <tr>
          <td>
            <a
              onClick={() => onEdit(spending)}
            >
              <Date>{bookedAt}</Date>
            </a>
          </td>
          <td>
            <a
              onClick={() => onEdit(spending)}
            >
              {title}
            </a>
          </td>
          <td>
            <a
              onClick={() => onEdit(spending)}
            >
              <Money symbol={currency}>{amount}</Money>
            </a>
          </td>
        </tr>
      </React.Fragment>
    })}
  </tbody>
</table>)


SpendingsTable.propTypes = {
  checkingAccount: PropTypes.instanceOf(CheckingAccount).isRequired,
  spendings: PropTypes.arrayOf(PropTypes.instanceOf(Spending)).isRequired,
  onEdit: PropTypes.func.isRequired
};
