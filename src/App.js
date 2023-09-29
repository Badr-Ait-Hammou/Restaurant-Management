import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css"
import "primereact/resources/themes/lara-light-indigo/theme.css";
import 'primeicons/primeicons.css';
import "primereact/resources/primereact.min.css";
import AuthRoute from './Auth/AuthRoute';
import AdminRoute from './Auth/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import 'primeflex/primeflex.css';
import {useDarkMode} from "./components/DarkModeContext";


function App() {
    const { isDarkMode } = useDarkMode();

    return (

            <div className={`App  ${isDarkMode ? 'bg-black ' : 'bg-white'}`}>
                <Router>
                <Routes>
                    <Route path="/*" element={<AuthRoute/>}/>
                    <Route path="ifoulki_meals/*" element={
                        <ProtectedRoute>
                            <AdminRoute />
                        </ProtectedRoute>
                    }/>

                </Routes>
                </Router>
            </div>

    );
}

export default App;
