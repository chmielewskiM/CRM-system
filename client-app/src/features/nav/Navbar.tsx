import React from 'react'
import { Menu, Container } from 'semantic-ui-react'

export const Navbar = () => {
    return (
        <Menu fixed='left' pointing secondary vertical>
            <Container  className='sideBar'>
            
            <Menu.Item header>
                <img src="/assets/logo.png" alt="logo"/>
                <h3>SteelBay</h3>
            </Menu.Item>
            <Menu.Item name='Dashboard'/>
            <Menu.Item name='Contacts'/>
            <Menu.Item name='Orders'/>
            <Menu.Item name='Stock'/>
            <Menu.Item name='Log out'/>
            </Container>
        </Menu>
    )
}
