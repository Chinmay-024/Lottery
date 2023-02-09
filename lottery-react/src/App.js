import React from "react";
import web3 from "./web3";
import lottery from "./lottery";
import Button from "@mui/material/Button";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: "",
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether"),
    });

    this.setState({ message: "You have been entered!" });
  };

  onClick = async () => {
    const accounts = await web3.eth.getAccounts();

    this.setState({ message: "Waiting on transaction success..." });

    await lottery.methods.pickWinner().send({
      from: accounts[0],
    });

    this.setState({ message: "A winner has been picked!" });
  };

  render() {
    return (
      <div>
        <h1 style={{ margin: "1rem", padding: "auto", textAlign: "center" }}>
          Lottery Contract
        </h1>
        <p style={{ margin: "1rem", padding: "auto", textAlign: "center" }}>
          This contract is managed by {this.state.manager}. There are currently{" "}
          {this.state.players.length} people entered, competing to win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>

        <hr />
        <form onSubmit={this.onSubmit} style={{ margin: "1rem" }}>
          <h2>Want to try your luck?</h2>
          <div>
            <label>Amount of ether to enter</label>
            <input
              style={{
                marginLeft: "1rem",
                padding: "0.8rem",
                textAlign: "center",
                height: "15px",
              }}
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </div>
          <Button variant="contained">Enter</Button>
        </form>

        <hr />

        <h2 style={{ margin: "1rem" }}>Ready to pick a winner?</h2>
        <Button
          style={{ marginLeft: "1rem", marginBottom: "0.5rem" }}
          onClick={this.onClick}
          variant="contained"
        >
          Pick a winner!
        </Button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );
  }
}
export default App;
