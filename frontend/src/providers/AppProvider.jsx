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
    const [isAuth, setIsAuth] = useState(false);

    const contextValue = { isAuth, setIsAuth };
    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export { useApp };
export default AppProvider;
