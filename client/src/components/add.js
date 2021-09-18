import React, { Component } from "react";
import ItemManager from "../contracts/ItemManager.json";
import Item from "../contracts/Item.json";
import getWeb3 from "../getWeb3";
import "./add.css";

class add extends Component {
  state = { cost: 0, itemName: "exampleItem1", loaded: false };

  componentDidMount = async () => {
    try {
      if (!window.location.hash) {
        window.location = window.location + "#loaded";
        window.location.reload();
      }
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
      this.listentopayment();
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
    const { cost, itemName } = this.state;
    console.log(itemName, cost, this.itemManager);
    let result = await this.itemManager.methods
      .createitem(itemName, cost)
      .send({ from: this.accounts[0] });
    console.log(result);
    document.getElementById("demo").innerHTML =
      "Send " +
      cost +
      " Wei to " +
      result.events.step.returnValues.loc +
      " and Item ID is " +
      result.events.step.returnValues.Index;
  };

  listentopayment = () => {
    let self = this;
    this.itemManager.events.step().on("data", async function (evt) {
      if (evt.returnValues.step === 1) {
        let itemObj = await self.itemManager.methods
          .itemlist(evt.returnValues.Index)
          .call();

        alert("Item " + itemObj.i.paid + " was paid deliver it now");
      }
      console.log(evt);
    });
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
        <h2>Items Inventory</h2>
        <h2>Add Element</h2>
        Cost:{" "}
        <input
          type="text"
          name="cost"
          value={this.state.cost}
          onChange={this.handleInputChange}
        />
        Item Name:{" "}
        <input
          type="text"
          name="itemName"
          value={this.state.itemName}
          onChange={this.handleInputChange}
        />
        <br />
        <br />
        <button type="button" onClick={this.handleSubmit}>
          Create new Item
        </button>
        <p id="demo"></p>
      </div>
    );
  }
}

export default add;
