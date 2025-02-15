import { useState } from 'react'
import './App.css'
import AppRoutes from './routes/Routes'
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);

  return (
      <Router>
          <AppRoutes/>
      </Router>
  );
}

export default App
