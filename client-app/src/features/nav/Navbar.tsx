import React, { useEffect } from 'react';
import { Menu, Container, Image, Dropdown, Button } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';
import { useStores } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

export const Navbar: React.FC = () => {
  const { commonStore, userStore } = useStores();

  useEffect(() => {}, [userStore.user]);

  return (
    <Menu
      position="left"
      pointing
      secondary
      vertical
      className={`${commonStore.toggleIcon} sidebar`}
    >
      <Container>
        <Button
          onClick={commonStore.toggleNav}
          toggle={commonStore.toggledNav}
          icon={commonStore.toggleIcon.split(' ')[0]}
          className={`${commonStore.toggleIcon.split(' ')[1]} toggle-sidebar`}
        />
        <Menu.Item header className="sidebar-header">
          <Image fluid centered src="/assets/logo.png" alt="logo" />
          <h3>SteelBay</h3>
        </Menu.Item>
        <Menu.Item
          icon="chart line"
          className="link"
          name="Dashboard"
          as={NavLink}
          to="/dashboard/home"
          onClick={commonStore.closeMobileNav}
        />
        <Menu.Item
          icon="address book"
          className="link"
          name="Contacts"
          as={NavLink}
          to="/dashboard/contacts"
          onClick={() => commonStore.closeMobileNav()}
        />
        <Menu.Item
          icon="street view"
          className="link"
          name="Leads"
          onClick={commonStore.closeMobileNav}
          as={NavLink}
          to="/dashboard/leads"
        />
        <Menu.Item
          icon="tasks"
          className="link"
          name="Tasks"
          onClick={commonStore.closeMobileNav}
          as={NavLink}
          to="/dashboard/tasks"
        />
        <Menu.Item
          icon="paste"
          className="link"
          name="Orders"
          onClick={commonStore.closeMobileNav}
          as={NavLink}
          to="/dashboard/orders"
        />
        {userStore.topAccess && (
          <Menu.Item
            icon="cog"
            className="link admin"
            name="Admin Panel"
            onClick={commonStore.closeMobileNav}
            as={NavLink}
            to="/dashboard/panel"
          />
        )}
        <Menu.Item>
          <Dropdown
            size="big"
            text={`Logged as ${userStore.user?.displayName}`}
          >
            <Dropdown.Menu>
              <Dropdown.Item
                className="logout"
                icon="power"
                label="Log out"
                size="big"
                onClick={userStore.logout}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Item>
      </Container>
    </Menu>
  );
};

export default observer(Navbar);
