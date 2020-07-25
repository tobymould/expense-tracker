import React, { Component } from 'react';
import styles from './Home.module.scss';

class Home extends Component {
  render() {
    return (
      <div className={styles.AppWrapper}>
        <section className={styles.balance}>
          <h3>Expense Tracker</h3>
          <h4>YOUR BALANCE</h4>
          <p>£0.00</p>
          <div className={styles.incomeExpense}>
            <div className={styles.income}>
              <h4>INCOME</h4>
              <p>+£0.00</p>
            </div>
            <div className={styles.expense}>
              <h4>EXPENSE</h4>
              <p>-£0.00</p>
            </div>
          </div>
        </section>
        <section className={styles.history}>
          <h4>History</h4>
          <ul></ul>
        </section>
        <section className={styles.addTransaction}>
          <h4>Add new transaction</h4>
          <p>Text</p>
          <input type="text" />
          <p>
            Amount <br /> (negative - expense, positive - income
          </p>
          <input type="number" />
          <button> Add transaction</button>
        </section>
      </div>
    );
  }
}
export default Home;
