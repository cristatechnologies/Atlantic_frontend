"use client";
import React from 'react';
import styles from './AnimatedHeart.module.css'; // Create this file

const AnimatedHeart = ({ isActive, onClick, totalLikes }) => {
  return (
    <li className={styles.heartContainer}>
      <a onClick={onClick}>
        <div className={`${styles.heart} ${isActive ? styles.isActive : ''}`} />
      <span>{totalLikes}</span> 
      </a>
    </li>
  );
};

export default AnimatedHeart;