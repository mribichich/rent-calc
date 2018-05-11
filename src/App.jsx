// @flow

import React, { Component } from 'react';
import moment from 'moment';
import { range, groupBy, sum } from 'ramda';
import numeral from 'numeral';
import 'numeral/locales/es';

import FILE_DATA from './data.json';

numeral.locale('es');

// const years = range(2013, 2018);

function transform(data) {
  return data.map(m => ({ datetime: moment(m.datetime, 'DD/MM/YYYY'), amount: m.amount }));
}

const DATA = transform(FILE_DATA);

function filterData(year, data) {
  const date = moment({ year: parseInt(year, 0) });

  return data.filter(f => f.datetime >= date);
}

function calculateMonthWithRaises(raiseFrecuency, raisesCount) {
  return range(0, Math.floor(raisesCount)).map(m => m * raiseFrecuency + raiseFrecuency - 1);
}

function calculateData(anualRaise, raiseFrecuency, baseRent, data) {
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

class App extends Component {
  state = {
    yearFrom: 2013,
    anualRaise: 20,
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
    const number = value ? parseInt(value, 0) : value;

    this.setState({
      yearFrom: number
    });

    if (number) {
      this.setState({
        data: calculateData(
          this.state.anualRaise,
          this.state.raiseFrecuency,
          this.state.baseRent,
          filterData(number, DATA)
        )
      });
    }
  };

  handleOnAnualRaiseChange = event => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : value;

    this.setState({
      anualRaise: number
    });

    if (number) {
      this.setState({
        data: calculateData(number, this.state.raiseFrecuency, this.state.baseRent, DATA)
      });
    }
  };

  handleOnRaiseFrecuencyChange = event => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : value;

    this.setState({
      raiseFrecuency: number
    });

    if (number) {
      this.setState({
        data: calculateData(this.state.anualRaise, number, this.state.baseRent, DATA)
      });
    }
  };

  handleOnBaseRentChange = event => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : value;

    this.setState({
      baseRent: number
    });

    if (number) {
      this.setState({
        data: calculateData(this.state.anualRaise, this.state.raiseFrecuency, number, DATA)
      });
    }
  };

  render() {
    const { data } = this.state;

    const byYear = groupBy(g => g.datetime.year());
    const dataGroupByYear = byYear(data);

    const totalMonths = data.length;
    const currentTotal = sum(data.map(m => m.amount));
    const newTotal = sum(data.map(m => m.newRent));

    return (
      <div style={{ margin: 16 }}>
        <br />

        <div>
          <label style={{ marginLeft: 16, marginRight: 8 }}>Año Desde</label>
          {/* <select value={this.state.yearFrom} onChange={this.handleOnYearFromChange}>
            {years.map(m => <option key={m} value={m} label={m} />)}
          </select> */}
          <input type="number" value={this.state.yearFrom} onChange={this.handleOnYearFromChange} min={2013} />

          <label style={{ marginLeft: 16, marginRight: 8 }}>% Aumento Anual</label>
          <input type="number" value={this.state.anualRaise} onChange={this.handleOnAnualRaiseChange} min={1} />

          <label style={{ marginLeft: 16, marginRight: 8 }}>Meses de Frecuencia Aumento</label>
          <input type="number" value={this.state.raiseFrecuency} onChange={this.handleOnRaiseFrecuencyChange} min={1} />

          <label style={{ marginLeft: 16, marginRight: 8 }}>Alquiler Base</label>
          <input type="number" value={this.state.baseRent} onChange={this.handleOnBaseRentChange} min={1} />
        </div>

        <br />
        <hr />
        <br />

        {/* <table>
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
                <td>{numeral(m.newRent).format('0,0.00')}</td>
              </tr>
            ))}
          </tbody>
        </table> */}

        <div style={{ display: 'flex' }}>
          {Object.keys(dataGroupByYear).map((yearKey, yearKeyIndex) => (
            <div style={{ margin: 6 }}>
              <h3>{yearKey}</h3>

              <table key={yearKeyIndex} style={{ border: 'grey solid 1px', borderSpacing: 10 }}>
                <thead>
                  <tr>
                    <th>Mes</th>
                    <th>Actual</th>
                    <th>%</th>
                    <th>Nuevo</th>
                  </tr>
                </thead>

                <tbody>
                  {dataGroupByYear[yearKey].map((m, i) => (
                    <tr key={i}>
                      <td>{m.datetime.format('MMM')}</td>
                      <td>{m.amount}</td>
                      <td>{m.raise ? <span>{numeral(m.raise).format('0,0.00')}</span> : null}</td>
                      <td>{numeral(m.newRent).format('0,0.00')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <br />

        <div>
          <table style={{ borderSpacing: 10 }}>
            {/* <thead>
            <tr>
              <th>Mes</th>
              <th>Cantidad</th>
            </tr>
          </thead> */}

            <tbody>
              <tr>
                <td>Total Meses/Años:</td>
                <td>
                  <strong>
                    {totalMonths} / {totalMonths / 12}
                  </strong>
                </td>
              </tr>

              <tr>
                <td>Total Actual:</td>
                <td>
                  <strong>{numeral(currentTotal).format('0,0.00')}</strong>
                </td>
              </tr>

              <tr>
                <td>Total Nuevo:</td>
                <td>
                  <strong>{numeral(newTotal).format('0,0.00')}</strong>
                </td>
              </tr>

              <tr>
                <td>Diff:</td>
                <td>
                  <strong>{numeral(newTotal - currentTotal).format('0,0.00')}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default App;
