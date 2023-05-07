import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "./components/Header"
import Footer from "./components/Footer"
import Ville from "./components/Ville"
import Zone from "./components/Zone"
import User from "./components/User"
import Restaurant from "./components/Restaurant"
import Serie from "./components/Serie"

import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
function App() {
  return (
      <div className="App">
        <Router>
          <Header/>
          <Routes>
              <Route exact path="/" element={<Ville/>}/>
              <Route exact path="/zone" element={<Zone/>}/>
              <Route exact path="/user" element={<User/>}/>
              <Route exact path="/restaurant" element={<Restaurant/>}/>
              <Route exact path="/serie" element={<Serie/>}/>

          </Routes>
            <Footer/>
        </Router>
      </div>

  );
}

export default App;
