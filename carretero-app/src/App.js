import "./App.css";
import Carousel from "./Carousel";
import React, { Component } from "react";

export default class App extends Component {
  render() {
    return (
      <div>
        <div class="carousel">
          <Carousel></Carousel>
        </div>
      </div>
    );
  }
}
