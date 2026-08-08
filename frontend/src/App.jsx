import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Companies from "./pages/Companies";
import About from "./pages/About";

import "./App.css";

function App() {
return ( <BrowserRouter> <Navbar />


  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/jobs" element={<Jobs />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/companies" element={<Companies />} />
    <Route path="/about" element={<About />} />
  </Routes>
</BrowserRouter>


);
}

export default App;
