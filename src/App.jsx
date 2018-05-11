// @flow

import React, { Component } from 'react';
import { groupBy, sum } from 'ramda';
import numeral from 'numeral';
import 'numeral/locales/es';

import FILE_DATA from './data.json';
import { transform, filterData, calculateData } from './utils';

numeral.locale('es');

// const years = range(2013, 2018);

const DATA = transform(FILE_DATA);

type Props = {};

type State = {
  yearFrom: number | null,
  anualRaise: number | null,
  raiseFrecuency: number | null,
  baseRent: number | null,
  data: []
};

class App extends Component<Props, State> {
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

  handleOnYearFromChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : null;

    this.setState({
      yearFrom: number
    });

    if (number) {
      this.setState({
        data: calculateData(
          this.state.anualRaise,
          this.state.raiseFrecuency,
          this.state.baseRent,
          filterData(number, this.state.data)
        )
      });
    }
  };

  handleOnAnualRaiseChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : null;

    this.setState({
      anualRaise: number
    });

    if (number) {
      this.setState({
        data: calculateData(
          number,
          this.state.raiseFrecuency,
          this.state.baseRent,
          filterData(this.state.yearFrom, this.state.data)
        )
      });
    }
  };

  handleOnRaiseFrecuencyChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : null;

    this.setState({
      raiseFrecuency: number
    });

    if (number) {
      this.setState({
        data: calculateData(
          this.state.anualRaise,
          number,
          this.state.baseRent,
          filterData(this.state.yearFrom, this.state.data)
        )
      });
    }
  };

  handleOnBaseRentChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const number = value ? parseInt(value, 0) : null;

    this.setState({
      baseRent: number
    });

    if (number) {
      this.setState({
        data: calculateData(
          this.state.anualRaise,
          this.state.raiseFrecuency,
          number,
          filterData(this.state.yearFrom, this.state.data)
        )
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
                    {totalMonths} / {numeral(totalMonths / 12).format('0,0.00')}
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
