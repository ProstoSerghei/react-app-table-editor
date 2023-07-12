import {Link} from 'react-router-dom';
import { useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

import Cookies from "universal-cookie";


export default function Navigation() {
    let currentPath = window.location.pathname
    let cookie = new Cookies()
    let token = cookie.get('token')
    const navLinkHandler = (e)=> {
        let navBarEl = document.querySelector('.navbar-el')
        navBarEl.querySelectorAll('a').forEach(el=>{
            el.classList.remove('active')
        })
        e.target.classList.add('active')
    }

    const logouHandler = (e)=>{
        cookie.remove('token')
        e.target.classList.add('d-none')
        window.location.reload()
    }
    return (
        <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary navbar-el" >
            <Container>
                <Navbar.Brand href="#home">Table Editor</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} onClick={navLinkHandler} to='/orders'
                            className={currentPath === '/orders' && 'active'}
                            >Заказы</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                    <Navbar.Collapse className="justify-content-end">
                        <ButtonGroup aria-label="Basic example" className='me-5 save-cancel d-none'>
                        <Button variant="success" className='save-btn' >Сохранить</Button>
                        <Button variant="danger" className='cancel-btn'>Отменить</Button>
                        </ButtonGroup>
                        <Nav>
                            {!token && <Nav.Link as={Link} onClick={navLinkHandler} to='/'
                            className={currentPath === '/' && 'active'}
                            >Войти</Nav.Link>}
                            {token && <Nav.Link as={Link} onClick={logouHandler} to='/'
                            className={currentPath === '/' && 'active'}
                            >Выйти</Nav.Link>}
                            
                        </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}



