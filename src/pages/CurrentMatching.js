import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/CurrentMatching.css';

function CurrentMatching() {
    return (
        <div className="current-matching-wrapper">
            <Header/>
            <div className="current-matching-content">
                <h2>Test CurrentMatching Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default CurrentMatching;
