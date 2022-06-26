import Login from './components/Login'
import Register from './components/Register'
import './App.css';
import { Route, Routes } from "react-router-dom";
import NewActionAlert from './components/NewActionAlert';
import ActionAlert from './components/ActionAlert';
import Groups from './components/Groups';
import NewGroup from './components/NewGroup';
import { ChannelsMenu } from './components/ChannelsMenu';
import Menu from './components/Menu';
import { ControllerSetting } from './components/ControllerSettings';
import { GroupsMenu } from './components/GroupMenu';
import { SmartHome } from './components/SmartHome';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Menu />} />
        <Route path="/actionAlert" element={<ActionAlert />} />
        <Route path="/newAlert" element={<NewActionAlert />} />
        <Route path="/newGroup" element={<NewGroup />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/channelMenu" element={<ChannelsMenu />} />
        <Route path="/controllerSetting" element={<ControllerSetting />} />
        <Route path="/groupMenu" element={<GroupsMenu />} />
        <Route path="/smartHome" element={<SmartHome />} />
      </Routes>
    </div>

  );
}

export default App;