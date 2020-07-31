import React, { Component } from 'react';
import styles from './Home.module.scss';
import Card from '../Card';
// import firebase from '../../firebase';
// import * as admin from 'firebase-admin';
import firebase, { firestore } from '../../firebase';

class Home extends Component {
  state = {
    expenses: null,
    expenseItem: null,
    expenseValue: null,
    incomeTotal: null,
    expenseTotal: null
  };

  addToExpenseList = async expense => {
    const randomID = Math.floor(Math.random() * 1000 + 1).toString();
    // console.log(randomID);
    // const { expenses } = this.state;
    // const hello = expense;
    firestore
      .collection('expenses')
      .doc(randomID)
      .set(expense)
      .then(response => console.log(response))
      .catch(error => console.log(error));

    await this.fetchFirebaseData();
  };

  updateOnExpenseList = async expense => {
    const randomID = Math.floor(Math.random() * 1000 + 1).toString();
    // console.log(randomID);
    // const { expenses } = this.state;
    // const hello = expense;
    firestore
      .collection('expenses')
      .doc('Toby')
      .update(expense)
      .then(response => console.log(response))
      .catch(error => console.log(error));

    await this.fetchFirebaseData();
  };

  componentDidMount = () => {
    this.fetchFirebaseData();
  };

  fetchFirebaseData = () => {
    firestore
      .collection('expenses')
      .get()
      .then(expensesListFirebase => {
        const expenses = expensesListFirebase.docs.map(doc => doc.data());
        this.setState({ expenses: expenses });
        console.log(this.state.expenses);
      })
      .catch(error => console.log(error));
  };

  deleteFromExpenseList = async event => {
    console.log('removing...');
    const nameOfItem = event.target.parentElement.children[0].children[0].innerText;
    const FieldValue = firebase.firestore.FieldValue;
    // console.log({ [nameOfItem]: 'hello' });
    const res = await firestore
      .collection('expenses')
      .doc('Toby')
      .update({ [nameOfItem]: FieldValue.delete() });

    await this.fetchFirebaseData();

    // await try-catch
  };

  addCard = () => {
    const { expenses } = this.state;
    if (expenses) {
      const test = expenses[0];
      const entries = Object.entries(test);
      return entries.map((expense, index) => {
        // console.log(Math.sign(expense[1]));
        // console.log(expense[1]);
        let background = Math.sign(expense[1]) !== -1 ? '#2ecc71' : '#c0392b';
        // console.log(background);
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
    const { expenseItem, expenseValue } = this.state;
    // const currentDate = new Date().toUTCString();
    // const randomID = Math.floor(Math.random() * 1000 + 1).toString();

    // const expense = { [expenseItem]: expenseValue, currentDate: currentDate };
    const expense = { [expenseItem]: expenseValue };
    console.log(expense);
    this.updateOnExpenseList(expense);
  };

  income = () => {
    let income = 0;
    const userExpensesArrayOfArrays = Object.entries(this.state.expenses[0]);

    userExpensesArrayOfArrays.map(singularExpenseKeyValuePair => {
      const value = parseFloat(singularExpenseKeyValuePair[1]);
      return Math.sign(value) !== -1 ? (income += value) : null;
    });
    // this.setState({ incomeTotal: income });
    return income;
  };

  expense = () => {
    let expense = 0;
    const userExpensesArrayOfArrays = Object.entries(this.state.expenses[0]);

    userExpensesArrayOfArrays.map(singularExpenseKeyValuePair => {
      const value = parseFloat(singularExpenseKeyValuePair[1]);
      return Math.sign(value) !== -1 ? null : (expense += value);
    });
    // this.setState({ expenseTotal: Math.abs(expense) });
    return Math.abs(expense);
  };

  yourBalance = () => {
    const income = this.income();
    const expense = this.expense();
    const total = income - expense;

    return total.toFixed(2);
  };

  render() {
    const { expenses, incomeTotal, expenseTotal } = this.state;
    return (
      <div className={styles.AppWrapper}>
        <section className={styles.balance}>
          <h3>Expense Tracker</h3>
          <h4>YOUR BALANCE</h4>
          <h2>{expenses ? this.yourBalance() : 0.0}</h2>
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
          <div className={styles.list}>{this.addCard()}</div>
        </section>
        <section className={styles.addTransaction}>
          <h4>Add New Transaction</h4>
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="item" placeholder="Name of income stream or expense..." onInput={this.stateToggle} />
            {/* <p>
              Amount <br /> (negative - expense, positive - income
            </p> */}
            <input type="number" step="0.01" name="value" placeholder="Income/expense value... (use the '-' prefix for 'expenses')" onInput={this.stateToggle} />
            <input type="submit" value="Add Transaction" />
          </form>
        </section>
      </div>
    );
  }
}
export default Home;
