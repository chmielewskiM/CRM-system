import React from 'react'
import { Container } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export const Homepage = () => {
    return (
        <Container>
            <h1>Homepage</h1>
            <Link to='/home'>Log in</Link>
        </Container>
    )
}
