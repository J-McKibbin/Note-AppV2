import React from 'react';
import './componentStyles/BtnAuth.css'

//creating the button and passing in the props for destructuring
const BtnAuth = ({children, onClick, type='button'}) => {
    return(
        <div>
            {/* Setting the attributes to the props passed in*/}
            <button onClick={onClick} type={type} className='btnAuth'>
                {/* content passed in will be displayed in the button*/}
                {children}
            </button>
        </div>
    )
}

export default BtnAuth;