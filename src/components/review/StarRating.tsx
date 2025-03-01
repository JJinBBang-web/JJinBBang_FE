// src/components/review/StarRating.tsx
import React, { useState } from 'react';
import styles from '../../styles/review/StarRating.module.css';

interface StarRatingProps {
  rating: number;
  onRate: (rating: number) => void;
  size?: number;
  color?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onRate,
  size = 24,
  color = '#FF6B3F',
}) => {
  const [hover, setHover] = useState(0);

  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            type="button"
            key={index}
            className={`${styles.starButton} ${
              starValue <= (hover || rating) ? styles.filled : styles.empty
            }`}
            onClick={() => onRate(starValue)}
            onMouseEnter={() => setHover(starValue)}
            onMouseLeave={() => setHover(0)}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={starValue <= (hover || rating) ? color : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
