import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Main.css';

function Main() {
    return (
        <div className="main-wrapper">
            <Header/>
            <div className="main-content">
                <h2>Test Main Page's Body Part!</h2>
            </div>
            <Footer/>
        </div>
    );
}

export default Main;
