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
import Header from "./components/Header/Header";
import User from "./components/Admin/User";
import Department from "./components/Admin/Department";
import Customer from "./components/Admin/Customer";
import Domain from "./components/Admin/Domain";
import SubDomain from "./components/Admin/SubDomain";
import Location from "./components/Admin/Location"; // Location component
import Sla from "./components/Admin/Sla";
import Ticket_noc from "./components/Admin/Ticket_noc";
import Access from "./components/Admin/Access";
import Ticket_status from "./components/Admin/Ticket_status";
import Ticket_service from "./components/Admin/Ticket_service";
import Ticket_type from "./components/Admin/Ticket_type";
import Type from "./components/Admin/Type";
import Group from "./components/Admin/Group";  // Your custom Group component
import IP_Address from "./components/Admin/IP_Address";
import Employee from "./components/Admin/Employee";
import Login from "./components/Login/Login";
import ChangePass from "./components/Login/Change_pass";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../src/components/UserContext/UserContext";
import { TicketProvider } from "../src/components/UserContext/TicketContext";
import SideMenu from "./components/sideMenu/SideMenu";
import Management from "./components/Management/Management";
import Setup from "./components/Setup/Setup";
import AssetType from "./AssetType/AssetType";
import TypeTable from "./TypeTable/TypeTable";
import { Group as GroupIcon } from "@mui/icons-material";  // Renamed the MUI icon import

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
              <div className="flex-1 md:overflow-y-auto pt-12 h-screen">
                <Header />
                <TicketProvider>
                  <Routes>
                    <Route path="/password-change" element={<ChangePass />} />
                    {user && user.setup === "1" && (
                      <Route
                        path="*"
                        element={<Navigate to="/setup/access" />}
                      />
                    )}
                    {user && user.setup === "0" && (
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    )}

                    <>
                      <Route path="/setup/user" element={<User />} />
                      <Route path="/admin/customer" element={<Customer />} />
                      <Route path="/setup/access" element={<Access />} />
                      <Route path="/management" element={<Management />} />
                      <Route path="/setup" element={<Setup />} />
                      <Route path="/:id/type" element={<AssetType />} />
                      <Route
                        path="/:id/:type/typetable"
                        element={<TypeTable />}
                      />
                      <Route
                        path="/admin/department"
                        element={<Department />}
                      />
                      <Route path="/admin/sla" element={<Sla />} />
                      <Route path="/admin/domain" element={<Domain />} />
                      <Route path="/admin/location" element={<Location />} />
                      <Route
                        path="/admin/ticket_status"
                        element={<Ticket_status />}
                      />
                      <Route
                        path="/admin/ticket_service"
                        element={<Ticket_service />}
                      />
                      <Route
                        path="/admin/ticket_type"
                        element={<Ticket_type />}
                      />
                      <Route
                        path="/admin/ticket_noc"
                        element={<Ticket_noc />}
                      />
                      <Route path="/admin/subdomain" element={<SubDomain />} />
                      <Route path="/Setup/location" element={<Location />} />
                      <Route path="/Setup/group" element={<Group />} />
                      <Route path="/Setup/type" element={<Type />} />
                      <Route path="/Setup/ip_address" element={<IP_Address />} />
                      <Route path="/Setup/employee" element={<Employee />} />

                    </>
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
