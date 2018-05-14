import moment from 'moment';
import {
  range
} from 'ramda';

export function transform(data) {
  return data.map(m => ({
    datetime: moment(m.datetime, 'DD/MM/YYYY'),
    amount: m.amount
  }));
}

export function filterData(year, data) {
  const date = moment({
    year: parseInt(year, 0)
  });

  return data.filter(f => f.datetime >= date);
}

export function calculateMonthWithRaises(raiseFrecuency, raisesCount) {
  return range(0, Math.floor(raisesCount)).map(m => m * raiseFrecuency + raiseFrecuency - 1);
}

export function calculateData(anualRaise: number, raiseFrecuency: number, baseRent: number, data) {

  const raisesCount = 12 / raiseFrecuency;
  const raiseAmount = anualRaise / raisesCount;

  const monthWithRaises = calculateMonthWithRaises(raiseFrecuency, raisesCount);

  return data.reduce((acc, cur) => {
    const raise = monthWithRaises.includes(cur.datetime.month()) ? raiseAmount : null;
    const newBaseRent = acc.length === 0 ? baseRent : acc[acc.length - 1].newRent;
    const newRent = newBaseRent + newBaseRent * (raise ? raise / 100 : 0);

    return [
      ...acc,
      {
        ...cur,
        raise: monthWithRaises.includes(cur.datetime.month()) ? raiseAmount : null,
        newRent: newRent
      }
    ];
  }, []);
}