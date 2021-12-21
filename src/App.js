import AppBar from "./shiksha-os/menu";
import { NativeBaseProvider } from "native-base";
import Home from "./shiksha-os/home";
import Students from "./shiksha-os/modules/students/list";
import Classes from "./shiksha-os/modules/classes/classes";
import Attendance from "./modules/attendance/attendance";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <SubApp>
              <Home />
            </SubApp>
          }
        />
        <Route
          path="/classes"
          element={
            <SubApp>
              <Classes />
            </SubApp>
          }
        />
        <Route
          path="/students"
          element={
            <SubApp>
              <Students />
            </SubApp>
          }
        />
        <Route
          path="/attendance"
          element={
            <SubApp>
              <Attendance />
            </SubApp>
          }
        />
      </Routes>
    </Router>
  );
}

export function SubApp({ children }) {
  return (
    <NativeBaseProvider>
      <AppBar />
      {children}
    </NativeBaseProvider>
  );
}
