import React, { Component } from 'react';
import styles from './Card.module.scss';

class Card extends Component {
  render() {
    const { name, value, className } = this.props;
    // console.log(className);
    return (
      <div className={styles.cardWrapper}>
        <div>{name}</div>
        <div>{value}</div>
        <div style={{ background: className }}></div>
      </div>
    );
  }
}
export default Card;
