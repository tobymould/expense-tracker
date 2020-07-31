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
    expenseValue: null
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
    const { expenses } = this.state;
    const test = expenses[0];
    const entries = Object.entries(test);
    console.log(entries);
    console.log(test);
    // let background = Math.sign(expense[1]) !== -1 ? '#2ecc71' : '#c0392b';
  };

  render() {
    const { expenses } = this.state;
    return (
      <div className={styles.AppWrapper}>
        <section className={styles.balance}>
          <h3>Expense Tracker</h3>
          <h4>YOUR BALANCE</h4>
          <p>£0.00</p>
          <div className={styles.incomeExpense}>
            <div className={styles.income}>
              <h4>INCOME</h4>
              {/* <p>+£{0.0}</p> */}
              {this.income}
            </div>
            <div className={styles.expense}>
              <h4>EXPENSE</h4>
              <p>-£{0.0}</p>
            </div>
          </div>
        </section>
        <section className={styles.history}>
          <h4>History</h4>
          {/* <Card className={styles.plus} /> */}
          {this.addCard()}
        </section>
        <section className={styles.addTransaction}>
          <h4>Add new transaction</h4>
          <form onSubmit={this.handleSubmit}>
            <input type="text" name="item" placeholder="expense item name..." onInput={this.stateToggle} />
            {/* <p>
              Amount <br /> (negative - expense, positive - income
            </p> */}
            <input type="number" name="value" placeholder="expense item value..." onInput={this.stateToggle} />
            <input type="submit" />
          </form>
        </section>
      </div>
    );
  }
}
export default Home;
