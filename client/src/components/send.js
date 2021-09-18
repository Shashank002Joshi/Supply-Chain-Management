import React, { Component } from "react";
import ItemManager from "../contracts/ItemManager.json";
import Item from "../contracts/Item.json";
import getWeb3 from "../getWeb3";
import "./add.css";

class send extends Component {
  state = { cost: 0, itemadd: "Addr", fadd: "Addr", loaded: false };

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
    const { cost, itemadd, fadd } = this.state;
    await this.web3.eth.sendTransaction({
      from: fadd,
      to: itemadd,
      value: cost,
      gas: 2000000,
    });

    document.getElementById("demo").innerHTML = "Payment Successful";
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
        <h2>Payment Gateway</h2>
        <h2>Send Funds To The Item's Address</h2>
        Cost :{" "}
        <input
          type="text"
          name="cost"
          value={this.state.cost}
          onChange={this.handleInputChange}
        />
        Address Of Item:{" "}
        <input
          type="text"
          name="itemadd"
          value={this.state.itemadd}
          onChange={this.handleInputChange}
        />
        Account Address:{" "}
        <input
          type="text"
          name="fadd"
          value={this.state.fadd}
          onChange={this.handleInputChange}
        />
        <br />
        <br />
        <button type="button" onClick={this.handleSubmit}>
          Pay
        </button>
        <p id="demo"></p>
      </div>
    );
  }
}

export default send;
