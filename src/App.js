import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css"
import Header from './components/Header';
import Footer from './components/Footer';
import AuthRoute from './Auth/AuthRoute';
import AdminRoute from './Auth/AdminRoute';
import PublicRoute from './Auth/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {

    return (

            <div className="App">
                <Router>
                <Routes>
                    <Route path="/*" element={<AuthRoute/>}/>
                    <Route path="admin/*" element={
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
