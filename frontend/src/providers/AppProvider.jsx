import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

const useApp = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within a <AppProvider />')
    }

    return context;
}

const AppProvider = ({ children }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [alert, setAlert] = useState(null);
    const contextValue = { user, setUser, alert, setAlert };
    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export { useApp };
export default AppProvider;
