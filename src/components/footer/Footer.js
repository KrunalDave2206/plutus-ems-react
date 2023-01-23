import React, { useState } from 'react';
import './Footer.scss'

export const FooterComponent = (props) => {
    return (
        <div className='main-footer'>
            &copy;{new Date().getFullYear()} Plutus Technologies PVT. LTD.
        </div>
    )
};