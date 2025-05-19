import React, { useState, useEffect } from 'react';

function Test() {
    useEffect(() => {
        console.log("test called");
    });

    return(
        <>
            <button>test button</button>
        </>
    )
}

export default Test;