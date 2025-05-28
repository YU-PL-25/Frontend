import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/PreMatching.css';

function PreMatching() {
    return (
        <div className="pre-matching-wrapper">
            <Header/>
            <div className="pre-matching-content">
                <h2>Test PreMatching Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default PreMatching;
