import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, Navigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ViewPlaces from "./components/ViewPlaces";
import AddPlace from "./components/AddPlace";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import NotFound from "./components/NotFound";

const token = sessionStorage.getItem("token");

const PrivateRoute = ({ path, element }) => {
  return token ? (
    ["/login", "/register", "/forgotPassword"].includes(path) ? (
      <Navigate to="/" />
    ) : (
      element
    )
  ) : (
    <Navigate to="/login" />
  );
};

const RoleBasedRoute = ({ path, element }) => {
  console.log(path);
  return token ? element : <Navigate to="/" />;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!sessionStorage.getItem("token")
  );

  useEffect(() => {
    setIsLoggedIn(!!sessionStorage.getItem("token"));
  }, [isLoggedIn]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <div className="App container mx-auto">
      <nav className="flex justify-between place-items-center bg-slate-400 p-4 rounded-md text-white">
        <h2 className="text-xl lg:text-3xl">
          <NavLink to="/" exact>
            Our Places
          </NavLink>
        </h2>
        <ul className="flex gap-x-4 lg:gap-x-6 place-items-center text-lg">
          {isLoggedIn ? (
            <>
              {/* <li>
                <NavLink to="/view-places">View Places</NavLink>
              </li> */}
              <li>
                <NavLink to="/add-place">Add Place</NavLink>
              </li>
            </>
          ) : (
            <li>
              <NavLink to="/">All Users</NavLink>
            </li>
          )}
          {isLoggedIn ? (
            <li>
              <a href="/login" onClick={handleLogout}>
                LogOut
              </a>
            </li>
          ) : (
            <li>
              <NavLink to="/login">Authenticate</NavLink>
            </li>
          )}
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        {/* Only to user */}
        <Route
          path="/add-place"
          element={
            <RoleBasedRoute
              path="/add-place"
              element={<AddPlace />} 
            />
          }
        />
        {/* Visible to anyone */}
        <Route path="/view-places/:id" element={<ViewPlaces />} />

        {token ? (
          <Route
            path="/login"
            element={
              <PrivateRoute
                path="/login"
                element={<Login setIsLoggedIn={setIsLoggedIn} />}
              />
            }
          />
        ) : (
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} />}
          />
        )}
        {token ? (
          <Route
            path="/register"
            element={<PrivateRoute path="/register" element={<Register />} />}
          />
        ) : (
          <Route path="/register" element={<Register />} />
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
