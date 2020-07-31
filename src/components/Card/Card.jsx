import React, { Component } from 'react';
import styles from './Card.module.scss';

class Card extends Component {
  render() {
    const { name, value, className, deleteFromExpenseList } = this.props;
    // console.log(className);
    return (
      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div>{name}</div>
          <div>{value}</div>
          <div style={{ background: className }}></div>
        </div>
        <p className={styles.delete} onClick={deleteFromExpenseList}>
          x
        </p>
      </div>
    );
  }
}
export default Card;
