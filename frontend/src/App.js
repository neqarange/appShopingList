import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import DetailPage from "./pages/DetailPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthProvider from "./auth/AuthContext";
import PrivateRoute from "./auth/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/detail/:id" element={<PrivateRoute><DetailPage /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
