import React, { Component } from 'react';
import styles from './Card.module.scss';

class Card extends Component {
  state = {
    showBox: false
  };

  handleBoxToggle = () => {
    this.setState({ showBox: !this.state.showBox });
  };

  render() {
    const { name, value, className, deleteFromExpenseList } = this.props;
    const { showBox } = this.state;
    // console.log(className);
    return (
      <div className={styles.cardWrapper} onMouseEnter={this.handleBoxToggle} onMouseLeave={this.handleBoxToggle}>
        <div className={styles.card}>
          <div>{name}</div>
          <div>{value}</div>
          <div style={{ background: className }}></div>
        </div>
        {showBox ? (
          <p className={styles.delete} onClick={deleteFromExpenseList}>
            x
          </p>
        ) : null}
      </div>
    );
  }
}
export default Card;
