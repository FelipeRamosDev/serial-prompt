import React, { createContext, useState, useContext } from 'react';

const BtDevicesContext = createContext();

export default function BtDevicesProvider({ children }) {
    const [btDevices, setBtDevices] = useState(false);
    return (
        <BtDevicesContext.Provider
            value={{
                btDevices,
                setBtDevices
            }}
        >
            { children}
        </BtDevicesContext.Provider>
    )
}

export function useBtDevices() {
    const context = useContext(BtDevicesContext);
    const { btDevices, setBtDevices } = context;

    return { btDevices, setBtDevices }
}