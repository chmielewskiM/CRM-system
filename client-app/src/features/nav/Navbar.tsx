import React, { useContext, useEffect } from 'react';
import { Menu, Container, Image, Dropdown, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

export const Navbar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { isLoggedIn, user, logout, topAccess } = rootStore.userStore;
  const { toggledNav, toggleIcon, toggleNav, closeMobileNav, rowButtons } = rootStore.commonStore;
  const { addLeadForm, rr } = rootStore.leadStore;

  useEffect(() => {}, [user]);

  return (
    <Menu position="left" pointing secondary vertical className={toggleIcon}>
      <Container className="sideBar">
        <Button onClick={toggleNav} toggle={toggledNav} icon={toggleIcon} />
        <Menu.Item header className="nav-header">
          <Image fluid centered src="/assets/logo.png" alt="logo" />
          <h3>SteelBay</h3>
        </Menu.Item>
        <Menu.Item
          icon="chart line"
          className="link"
          name="Dashboard"
          as={NavLink}
          to="/dashboard"
          onClick={closeMobileNav}
        />
        <Menu.Item
          icon="address book"
          className="link"
          name="Contacts"
          as={NavLink}
          to="/contacts"
          onClick={closeMobileNav}
        />
        <Menu.Item
          icon="street view"
          className="link"
          name="Leads"
          onClick={closeMobileNav}
          as={NavLink}
          to="/leads"
        />
        <Menu.Item
          icon="tasks"
          className="link"
          name="Tasks"
          onClick={closeMobileNav}
          as={NavLink}
          to="/tasks"
        />
        <Menu.Item
          icon="paste"
          className="link"
          name="Orders"
          onClick={closeMobileNav}
          as={NavLink}
          to="/orders"
        />
        {topAccess && (
          <Menu.Item
            icon="cog"
            className="link admin"
            name="Admin Panel"
            onClick={closeMobileNav}
            as={NavLink}
            to="/panel"
          />
        )}
        <Menu.Item>
          <Dropdown size="big" text={`Logged as ${user?.displayName}`}>
            <Dropdown.Menu>
              <Dropdown.Item
                className="logout"
                icon="power"
                label="Log out"
                size="big"
                onClick={logout}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
