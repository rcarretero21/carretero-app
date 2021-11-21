import React, { Component } from "react";
import "./Carousel.css";
import axios from "axios";
import Select from "react-select";
import lottoIcon from "./assets/lottery-icon-6.png";

const API_BASE_URL = "http://localhost/api/drawings";

const currencies = {
  EUR: "€",
  DOLLAR: "$",
};
const colorsArray = ["green", "cyan"];

function getRandomItem(array, name) {
  if (name.length < 10) return array[0];
  if (10 <= name.length < 12) return array[1];
  if (name.length >= 12) return array[2];
}

export default class Carousel extends Component {
  constructor(props) {
    super(props);

    this.handler = this.handler.bind(this);
  }

  state = {
    carouselLottoItems: [],
    displayDetails: false,
    selectedDataName: "",
    selectedDataDates: [],
  };

  async handler(inputProps) {
    let selectedLottoData;
    await axios.get(API_BASE_URL + "/" + inputProps.name).then((res) => {
      selectedLottoData = res.data;
    });
    const lastDate = selectedLottoData.last.date;
    const lastDateValue =
      lastDate.year.toString() +
      lastDate.month.toString() +
      lastDate.day.toString();
    const lastDateLabel = [lastDate.day, lastDate.month, lastDate.year].join(
      "/"
    );
    this.setState({
      displayDetails: !this.state.displayDetails,
      selectedData: inputProps.name,
      selectedDataDates: [{ value: lastDateValue, label: lastDateLabel }],
    });
  }

  componentDidMount() {
    axios.get(API_BASE_URL).then((res) => {
      const response = res.data;
      const inflatedData = [];
      Object.keys(response).forEach((lottoKey) => {
        const drawDate = [
          response[lottoKey].next.date.day,
          response[lottoKey].next.date.month,
          response[lottoKey].next.date.year,
        ].join("/");
        inflatedData.push({
          id: lottoKey,
          name: lottoKey,
          nextDrawPrize:
            currencies[response[lottoKey].next.currency] +
            response[lottoKey].next.jackpot +
            " millions ",
          nextDrawDate: drawDate,
        });
      });
      this.setState({ carouselLottoItems: inflatedData });
    });
  }

  render() {
    return (
      <div>
        <div class="carousel-item">
          {this.state.carouselLottoItems.map((lottoItem) => (
            <LottoItem
              handler={this.handler}
              class="item"
              key={lottoItem.id}
              name={lottoItem.name}
              nextDrawPrize={lottoItem.nextDrawPrize}
              nextDrawDate={lottoItem.nextDrawDate}
            ></LottoItem>
          ))}
        </div>
        {this.state.displayDetails && (
          <LottoDetails
            key={this.state.selectedData}
            lottoName={this.state.selectedData}
            options={this.state.selectedDataDates}
            value={this.state.selectedDataDates[0]}
          ></LottoDetails>
        )}
      </div>
    );
  }
}

class LottoItem extends Component {
  render() {
    const color = getRandomItem(colorsArray, this.props.name);
    return (
      <div
        class="carousel-container"
        onClick={() =>
          this.props.handler({
            name: this.props.name,
            nextDrawDate: this.props.nextDrawDate,
          })
        }
      >
        <div class="two-columns">
          <div class="first-column">
            <h3
              class="lotto-name"
              style={{ textTransform: "capitalize", color: color }}
            >
              {this.props.name}
            </h3>
            <h4>Draw prize: {this.props.nextDrawPrize}</h4>
            <h4>Draw date: {this.props.nextDrawDate}</h4>
          </div>
          <div class="second-column">
            <img class="lotto-icon" src={lottoIcon}></img>
          </div>
        </div>
      </div>
    );
  }
}

class LottoDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.options[0].value,
      showTable: false,
      selectedLottoData: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  processDateResults(results) {
    let oddsData = [];
    Object.keys(results.odds).forEach((odd) => {
      results.odds[odd].currency = results.currency;
      results.odds[odd].oddKey = odd;
      oddsData.push(results.odds[odd]);
    });
    return oddsData.sort((a, b) => b.prize - a.prize);
  }

  async handleChange(dateSelected) {
    let queryResult;
    await axios
      .get(API_BASE_URL + "/" + this.props.lottoName + "/" + dateSelected.value)
      .then((res) => {
        queryResult = res.data;
      });
    const processedResultData = this.processDateResults(queryResult.last[0]);
    this.setState({
      value: dateSelected.value,
      showTable: true,
      selectedLottoData: processedResultData,
    });
  }

  currentDateOptions = [];

  addTableRow = (result, index) => {
    return (
      <tr key={result.oddKey}>
        <td>{index + 1}</td>
        <td>{"-----------------------"}</td>
        <td>{result.winners + "x"}</td>
        <td>
          {result.prize.toLocaleString() + " " + currencies[result.currency]}
        </td>
      </tr>
    );
  };

  render() {
    return (
      <div class="carousel-select-container">
        <form class="selector-form">
          <label>
            <div class="select-div">
              <span class="selector-label">Select date: </span>
              <Select
                value={this.props.value}
                onChange={this.handleChange}
                options={this.props.options}
              ></Select>
            </div>
          </label>
        </form>
        {this.state.showTable && (
          <table class="table-container">
            <thead>
              <tr>
                <th>Tier</th>
                <th>Match</th>
                <th>Winners</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {this.state.selectedLottoData.map((dataEntry, index) => {
                return this.addTableRow(dataEntry, index);
              })}
            </tbody>
          </table>
        )}
      </div>
    );
  }
}
