import React from 'react';
import CardItem from './CardItem';
import placeholder from "../assets/images/placeholder.jpg"
import '../assets/styles/cards.css';

const Cards = () => {

    const cardData = [
        {
            src: placeholder,
            title: 'Card Title 1',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            src: placeholder,
            title: 'Card Title 2',
            description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
            src: placeholder,
            title: 'Card Title 3',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        },
        {
            src: placeholder,
            title: 'Card Title 3',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        },
        {
            src: placeholder,
            title: 'Card Title 3',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        },
        {
            src: placeholder,
            title: 'Card Title 3',
            description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.',
        },
    ];

    return (
        <>
        <h1 className='cards_header'> Latest Announcements</h1>
        <div className="cards">
            {cardData.map((card, index) => (
                <CardItem 
                    key={index} 
                    src={card.src} 
                    title={card.title} 
                    description={card.description} 
                />
            ))}
        </div>
        </>
    );
};

export default Cards;
