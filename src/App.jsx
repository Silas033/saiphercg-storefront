//C:\Users\Silas Carzon\saiphercg2.0\src\App.jsx
import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import CustomerInfoForm from "./pages/CustomerInfoForm";


function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/order" element={<CustomerInfoForm />} /> 
    </Routes>
  );
}

export default App;


