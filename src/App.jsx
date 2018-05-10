import React, { Component } from 'react';
import moment from 'moment';
import { range } from 'ramda';

import FILE_DATA from './data.json';

// const years = [2013, 2014, 2015, 2016, 2017];
const years = range(2013, 2018);

function transform(data) {
  return data.map(m => ({ datetime: moment(m.datetime, 'DD/MM/YYYY'), amount: m.amount }));
}

const DATA = transform(FILE_DATA);

function filterData(year, data) {
  const date = moment({ year: parseInt(year, 0) });

  return data.filter(f => f.datetime >= date);
}

function calculateMonthWithRaises(raiseFrecuency, raisesCount) {
  return range(0, raiseFrecuency).map(m => m * raisesCount);
}

function calculateData(anualRaise, raiseFrecuency, baseRent, data) {
  const raisesCount = 12 / raiseFrecuency;
  const raiseAmount = anualRaise / raisesCount;

  const monthWithRaises = calculateMonthWithRaises(raisesCount, raiseFrecuency);

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

class App extends Component {
  state = {
    yearFrom: 2013,
    anualRaise: 24,
    raiseFrecuency: 6,
    baseRent: 2500,
    data: []
  };

  componentDidMount() {
    this.setState({
      data: calculateData(
        this.state.anualRaise,
        this.state.raiseFrecuency,
        this.state.baseRent,
        filterData(this.state.yearFrom, DATA)
      )
    });
  }

  handleOnYearFromChange = event => {
    const { value } = event.target;

    this.setState({
      yearFrom: value,
      data: calculateData(
        this.state.anualRaise,
        this.state.raiseFrecuency,
        this.state.baseRent,
        filterData(value, DATA)
      )
    });
  };

  handleOnAnualRaiseChange = event => {
    const { value } = event.target;

    this.setState({
      anualRaise: value,
      data: calculateData(value, this.state.raiseFrecuency, this.state.baseRent, DATA)
    });
  };

  handleOnRaiseFrecuencyChange = event => {
    const { value } = event.target;

    this.setState({
      raiseFrecuency: value,
      data: calculateData(this.state.anualRaise, value, this.state.baseRent, DATA)
    });
  };

  handleOnBaseRentChange = event => {
    const { value } = event.target;

    this.setState({
      baseRent: value,
      data: calculateData(this.state.anualRaise, this.state.raiseFrecuency, value, DATA)
    });
  };

  render() {
    return (
      <div>
        <label>Año Desde:</label>
        <select value={this.state.yearFrom} onChange={this.handleOnYearFromChange}>
          {years.map(m => <option key={m} value={m} label={m} />)}
        </select>

        <label>% Aumento Anual</label>
        <input value={this.state.anualRaise} onChange={this.handleOnAnualRaiseChange} />

        <label>Meses de Frecuencia Aumento</label>
        <input value={this.state.raiseFrecuency} onChange={this.handleOnRaiseFrecuencyChange} />

        <label>Alquiler Base</label>
        <input value={this.state.baseRent} onChange={this.handleOnBaseRentChange} />

        <br />
        <table>
          <thead>
            <tr>
              <th>Mes</th>
              <th>Cantidad</th>
            </tr>
          </thead>

          <tbody>
            {this.state.data.map((m, i) => (
              <tr key={i}>
                <td>{m.datetime.format('MMMM YYYY')}</td>
                <td>{m.amount}</td>
                <td>{m.raise ? <span>{m.raise} %</span> : null}</td>
                <td>{m.newRent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
