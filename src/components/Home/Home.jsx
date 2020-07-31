import React, { Component } from 'react';
import styles from './Home.module.scss';
import Card from '../Card';
// import firebase from '../../firebase';
// import * as admin from 'firebase-admin';
import firebase, { firestore, provider } from '../../firebase';

class Home extends Component {
  state = {
    user: null,
    expenses: null,
    expenseItem: null,
    expenseValue: null,
    incomeTotal: null,
    expenseTotal: null
  };

  signIn = () => {
    firebase.auth().signInWithRedirect(provider);
  };

  signOut = async () => {
    firebase.auth().signOut();
    await this.getUser();
    this.setState({
      expenses: null
    });
  };

  getUser = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user }, this.fetchFirebaseData);
      } else {
        this.setState({ user: null });
      }
    });
  };

  getSignInOutJsx = () => {
    const { user } = this.state;
    const { signIn } = this;
    if (user) {
      return <li onClick={this.signOut}>Sign-Out</li>;
    } else {
      return <li onClick={this.signIn}>Sign-in</li>;
    }
  };

  addToExpenseList = async expense => {
    // const randomID = Math.floor(Math.random() * 1000 + 1).toString();
    // console.log(randomID);
    // const { expenses } = this.state;
    // const hello = expense;
    const userEmail = this.state.user.email;

    console.log('expense-SET', expense);
    firestore
      .collection('expenses')
      .doc(userEmail)
      .set(expense)
      .then(response => console.log(response))
      .catch(error => console.log(error));

    await this.fetchFirebaseData();
  };

  updateOnExpenseList = async expense => {
    // const { expenses } = this.state;

    const userEmail = this.state.user.email;
    console.log('expense-UPDATE', expense);
    firestore
      .collection('expenses')
      .doc(userEmail)
      .update(expense)
      .then(response => console.log(response))
      .catch(error => console.log(error));

    await this.fetchFirebaseData();
  };

  componentDidMount = () => {
    this.getUser();
  };

  fetchFirebaseData = async () => {
    const userEmail = this.state.user.email;
    console.log('userEmail', userEmail);

    firestore
      .collection('expenses')
      .doc(userEmail)
      .get()
      .then(expensesListFirebase => {
        console.log(expensesListFirebase.data());
        const expenses = expensesListFirebase.data();
        console.log(expenses);
        this.setState({ expenses: expenses });
      })
      .catch(error => console.log(error));
  };

  deleteFromExpenseList = async event => {
    console.log('removing...');
    const nameOfItem = event.target.parentElement.children[0].children[0].innerText;
    const FieldValue = firebase.firestore.FieldValue;
    const userEmail = this.state.user.email;

    const res = await firestore
      .collection('expenses')
      .doc(userEmail)
      .update({ [nameOfItem]: FieldValue.delete() });

    await this.fetchFirebaseData();

    // await try-catch
  };

  addCard = () => {
    const { expenses } = this.state;
    console.log(expenses);
    console.log(Object.entries(expenses));

    if (expenses) {
      const entries = Object.entries(expenses);
      return entries.map((expense, index) => {
        let background = Math.sign(expense[1]) !== -1 ? '#2ecc71' : '#c0392b';
        return <Card name={expense[0]} value={expense[1]} key={index} className={background} deleteFromExpenseList={this.deleteFromExpenseList} />;
      });
    }
  };

  stateToggle = event => {
    console.log(event.target.name);
    if (event.target.name === 'item') {
      this.setState({ expenseItem: event.target.value });
      console.log(this.state.expenseItem);
    } else if (event.target.name === 'value') {
      this.setState({ expenseValue: event.target.value });
      console.log(this.state.expenseValue);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { expenseItem, expenseValue, expenses } = this.state;
    // const currentDate = new Date().toUTCString();
    const entries = Object.entries(expenses);
    console.log('entries', entries);
    const alreadyExistCheck = entries.map(entry => {
      const check = entry[0].includes(expenseItem);
      return check;
    });
    const newState = { ...this.state.expenses, [expenseItem]: expenseValue };
    console.log('check me', newState);

    alreadyExistCheck.includes(true) ? this.updateOnExpenseList(newState) : this.addToExpenseList(newState);
  };

  income = () => {
    let income = 0;
    const userExpensesArrayOfArrays = Object.entries(this.state.expenses);

    userExpensesArrayOfArrays.map(singularExpenseKeyValuePair => {
      const value = parseFloat(singularExpenseKeyValuePair[1]);
      return Math.sign(value) !== -1 ? (income += value) : null;
    });
    return income;
  };

  expense = () => {
    let expense = 0;
    const userExpensesArrayOfArrays = Object.entries(this.state.expenses);

    userExpensesArrayOfArrays.map(singularExpenseKeyValuePair => {
      const value = parseFloat(singularExpenseKeyValuePair[1]);
      return Math.sign(value) !== -1 ? null : (expense += value);
    });
    return Math.abs(expense);
  };

  yourBalance = () => {
    const income = this.income();
    const expense = this.expense();
    const total = income - expense;
    // console.log(Math.sign(total));
    if (Math.sign(total) === -1) {
      return <h2 style={{ color: '#c0392b' }}>-£{Math.abs(total.toFixed(2))}</h2>;
    } else if (Math.sign(total) === 1) {
      return <h2 style={{ color: '#2ecc71' }}>£{total.toFixed(2)}</h2>;
    } else return <h2 style={{ color: 'orange' }}>{total.toFixed(2)}</h2>;
  };

  render() {
    const { expenses, incomeTotal, expenseTotal } = this.state;
    return (
      <div className={styles.AppWrapper}>
        <section className={styles.balance}>
          <h3>Expense Tracker</h3>
          <h4>YOUR BALANCE</h4>
          {expenses ? this.yourBalance() : <h2>0.0</h2>}
          <div className={styles.incomeExpense}>
            <div className={styles.income}>
              <h4>INCOME</h4>
              <p>+£{expenses ? this.income() : 0.0}</p>
            </div>
            <div className={styles.expense}>
              <h4>EXPENSE</h4>
              <p>-£{expenses ? this.expense() : 0.0}</p>
            </div>
          </div>
        </section>
        <section className={styles.history}>
          <h4>History</h4>
          <div className={styles.list}>{expenses ? this.addCard() : null}</div>
        </section>
        <section className={styles.addTransaction}>
          <h4>Add New Transaction</h4>

          <form onSubmit={this.handleSubmit}>
            <input type="text" name="item" placeholder="Name of income stream or expense..." onInput={this.stateToggle} />
            <input type="number" step="0.01" name="value" placeholder="Income/expense value... (use the '-' prefix for 'expenses')" onInput={this.stateToggle} />
            <input type="submit" value="Add Transaction" />
          </form>
        </section>
        <nav className={styles.navBar}>
          <ul>{this.getSignInOutJsx()}</ul>
        </nav>
        {/* {this.state.user ? console.log(this.state.user.email) : null}; */}
      </div>
    );
  }
}
export default Home;
