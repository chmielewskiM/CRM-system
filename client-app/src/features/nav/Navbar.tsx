import React, { useContext } from 'react';
import { Menu, Container, Image, Dropdown, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';

export const Navbar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user, logout } = rootStore.userStore;
  const { toggledNav, toggleIcon, toggleNav } = rootStore.commonStore;
  return (
    <Menu position="left" pointing secondary vertical className={toggleIcon}>
      <Container className="sideBar">
        <Button onClick={toggleNav} toggle={toggledNav} icon={toggleIcon} />
        <Menu.Item header>
          <Image fluid centered src="/assets/logo.png" alt="logo" />
          <h3>SteelBay</h3>
        </Menu.Item>
        <Menu.Item className="link" name="Dashboard" as={NavLink} to="/dashboard" />
        <Menu.Item className="link" name="Contacts" as={NavLink} to="/contacts" />
        <Menu.Item className="link" name="Leads" as={NavLink} to="/leads" />
        <Menu.Item className="link" name="Tasks" as={NavLink} to="/tasks" />
        <Menu.Item className="link" name="Orders" as={NavLink} to="/orders" />
        <Menu.Item className="link" name="Stock" as={NavLink} to="/stock" />
        <Menu.Item>
          <Dropdown size="big" text={`Logged as ${user?.displayName}`}>
            <Dropdown.Menu>
              <Dropdown.Item className="logout" icon="power" label="Log out" size="big" onClick={logout} />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
};
