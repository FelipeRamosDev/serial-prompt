import React, { createContext, useState, useContext } from 'react';

const BtConnectionContext = createContext();

export default function BtConnectionProvider({ children }) {
    const [btConnection, setBtConnection] = useState(false);
    return (
        <BtConnectionContext.Provider
            value={{
                btConnection,
                setBtConnection,
            }}
        >
            { children }
        </BtConnectionContext.Provider>
    );
}

export function useBtConnection() {
    const context = useContext(BtConnectionContext);
    const { btConnection, setBtConnection } = context;

    return { btConnection, setBtConnection };
}
