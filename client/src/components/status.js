import React, { Component } from "react";
import { ReactDOM } from "react";
import ItemManager from "../contracts/ItemManager.json";
import Item from "../contracts/Item.json";
import getWeb3 from "../getWeb3";
import "./add.css";
let statusitem = "";
class status extends Component {
  state = { index: 0, loaded: false };

  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();

      this.itemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] &&
          ItemManager.networks[networkId].address
      );
      this.item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address
      );

      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleSubmit = async () => {
    const { index } = this.state;
    let result = await this.itemManager.methods.gets(index).call();

    if (result === "1") {
      statusitem = "Payment Completed Ready For Delivery";
    } else if (result === "2") {
      statusitem = "Delivered";
    } else if (result === "0") {
      statusitem = "Initial State";
    }
    document.getElementById("demo").innerHTML = statusitem;
  };

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Supply Chain Management System</h1>
        <h2>Status</h2>
        <h2>Track Your Order</h2>
        Item ID :{" "}
        <input
          type="text"
          name="index"
          value={this.state.index}
          onChange={this.handleInputChange}
        />
        <br />
        <br />
        <button type="button" onClick={this.handleSubmit}>
          Check Status
        </button>
        <br />
        <p id="demo"></p>
      </div>
    );
  }
}

export default status;
