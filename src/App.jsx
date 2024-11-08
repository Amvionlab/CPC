import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useContext,
} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import "./App.css";

import User from "./components/Admin/User";
import Location from "./components/Admin/Location";
import Branch from "./components/Admin/Branch";
import Access from "./components/Admin/Access";
import Template from "./components/Admin/Template";
import Type from "./components/Admin/Type";
import Group from "./components/Admin/Group"; // Your custom Group component
import IP_Address from "./components/Admin/IP_Address";
import Employee from "./components/Admin/Employee";
import Vendor from "./components/Admin/Vendor";
import Smtp from "./components/Admin/Smtp";
import Login from "./components/Login/Login";
import Sales from "./components/Sales/Sales";
import Target from "./components/Target/Target";
import Am from "./components/Am/Am";
import ChangePass from "./components/Login/Change_pass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../src/components/UserContext/UserContext";
import { TicketProvider } from "../src/components/UserContext/TicketContext";
import SideMenu from "./components/sideMenu/SideMenu";
import Setup from "./components/Setup/Setup";
import Status from "./components/Admin/Status";
import SubStatus from "./components/Admin/SubStatus";
const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // 1 hour

function App() {
  const { user, setUser } = useContext(UserContext);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [open, setOpen] = useState(false);
  const timeoutIdRef = useRef(null);

  const resetTimeout = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => {
      setIsAuthenticated(false);
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }, INACTIVITY_TIMEOUT);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
      resetTimeout();

      const events = [
        "mousemove",
        "mousedown",
        "keypress",
        "scroll",
        "touchstart",
      ];
      const resetUserTimeout = () => resetTimeout();

      events.forEach((event) =>
        window.addEventListener(event, resetUserTimeout)
      );

      return () => {
        events.forEach((event) =>
          window.removeEventListener(event, resetUserTimeout)
        );
        if (timeoutIdRef.current) {
          clearTimeout(timeoutIdRef.current);
        }
      };
    } else {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("user");
    }
  }, [isAuthenticated, resetTimeout, setUser]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    toast.success("Logged in successfully!");
  };

  return (
    <Router>
      <div className="App bg-second font-sui">
        <ToastContainer />
        {isAuthenticated ? (
          <>
            <div className="main-content flex overflow-y-hidden">
              <SideMenu />
              <div className="flex-1 md:overflow-y-auto h-screen">
                <TicketProvider>
                  <Routes>
                    <Route path="/password-change" element={<ChangePass />} />

                    {user && user.setup === "1" && (
                      <>
                        <Route path="*" element={<Navigate to="/setup" />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/target" element={<Target />} />
                        <Route path="/area-manager" element={<Am />} />
                      </>
                    )}
                    {user && user.setup === "0" && (
                      <>
                        <Route path="*" element={<Navigate to="/sales" />} />
                        <Route path="/sales" element={<Sales />} />
                        <Route path="/target" element={<Target />} />
                        <Route path="/area-manager" element={<Am />} />
                      </>
                    )}

                    {user && user.setup === "1" && (
                      <>
                        <Route path="/setup/user" element={<User />} />
                        <Route path="/setup/status" element={<Status />} />
                        <Route
                          path="/setup/substatus"
                          element={<SubStatus />}
                        />
                        <Route path="/setup/access" element={<Access />} />
                        <Route path="/setup" element={<Setup />} />
                        <Route path="/Setup/location" element={<Location />} />
                        <Route path="/Setup/branch" element={<Branch />} />
                        <Route path="/Setup/group" element={<Group />} />
                        <Route path="/Setup/type" element={<Type />} />
                        <Route
                          path="/Setup/ip_address"
                          element={<IP_Address />}
                        />
                        <Route path="/Setup/employee" element={<Employee />} />
                        <Route path="/Setup/vendor" element={<Vendor />} />
                        <Route path="/Setup/smtp" element={<Smtp />} />
                        <Route path="/Setup/template" element={<Template />} />
                      </>
                    )}
                  </Routes>
                </TicketProvider>
              </div>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="*" element={<Login onLogin={handleLogin} />} />
            <Route path="password-change" element={<ChangePass />} />
          </Routes>
        )}
      </div>
    </Router>
  );
}

export default App;
