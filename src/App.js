import './App.css';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Header from "./components/Header"
import Footer from "./components/Footer"
import Ville from "./components/Ville"

import {BrowserRouter as Router,Routes,Route} from "react-router-dom";
function App() {
  return (
      <div className="App">
        <Router>
          <Header/>
          <Routes>
              <Route exact path="/" element={<Ville/>}/>

          </Routes>
            <Footer/>
        </Router>
      </div>

  );
}

export default App;
