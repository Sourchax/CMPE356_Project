import React from 'react';
import PropTypes from 'prop-types';
import '../assets/styles/cardItem.css';

const CardItem = ({ src, title, description }) => {
    return (
        <div className="card">
            <img src={src} alt={title} className="card__image" />
            <div className="card__content">
                <p className="card__title">{title}</p>
                <p className="card__description">{description}</p>
            </div>
        </div>
    );
};

CardItem.propTypes = {
    src: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
};

export default CardItem;
