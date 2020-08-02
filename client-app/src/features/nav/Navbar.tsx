import React from 'react'
import { Menu, Container, Image } from 'semantic-ui-react'
import { NavLink } from 'react-router-dom'

export const Navbar = () => {
    return (
        <Menu fixed='left' pushable pointing secondary vertical>
            <Container  className='sideBar'>
            
            <Menu.Item header>
                <Image fluid centered src="/assets/logo.png" alt="logo"/>
                <h3>SteelBay</h3>
            </Menu.Item>
            <Menu.Item className='link' name='Dashboard' as={NavLink} to='/home'/>
            <Menu.Item className='link' name='Contacts' as={NavLink} to='/contacts'/>
            <Menu.Item className='link' name='Orders' as={NavLink} to='/orders'/>
            <Menu.Item className='link' name='Stock' as={NavLink} to='/stock'/>
            <Menu.Item className='link' name='Log out' as={NavLink} exact to='/'/>
            </Container>
        </Menu>
    )
}
