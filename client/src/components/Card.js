import React from 'react';
import classNames from 'classnames';
import './Card.css';

const Card = ({ 
  children, 
  className = '', 
  variant = 'default',
  padding = 'default',
  hover = false,
  ...props 
}) => {
  const cardClasses = classNames(
    'card',
    `card-${variant}`,
    `card-padding-${padding}`,
    {
      'card-hover': hover,
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;