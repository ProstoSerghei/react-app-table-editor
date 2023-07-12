import React from "react";
import { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

import {useGetTokenMutation} from '../store/backend/back.api';



export default function Login() {
    const [state, setState] = useState({
        username: '',
        password: ''
    })

    const [alert, setAlert] = useState({
        dNone: 'd-none',
        mess: 'Ok'
    })

    const [postData, result] = useGetTokenMutation()


    const fromSubmitHandler = (e)=>{
        e.preventDefault()
        e.target.username.disabled = true
        e.target.password.disabled = true
        e.target.submit.disabled = true
        postData({username: state.username, password: state.password}).then(res=>{
            if(res.error){
                e.target.username.disabled = false
                e.target.password.disabled = false
                e.target.submit.disabled = false
                setAlert(prev=>{
                    return {...prev, mess: res.error.data?.non_field_errors[0], dNone: ''}
                })
            }
        })
    }

    const inputHandler= (e)=>{
        let key = e.target.name
        let value = e.target.value
        setState(prev => {
            return {
                ...prev,
                [key]: value
            }
        })
    }

    const navigate = useNavigate()
    useEffect(()=>{
        let cookie = new Cookies()
        if (cookie.get('token')) {
            navigate('/orders')
        }
    }, [])
    
    return (
        <Container fluid='xxl' className="content bg-dark">
            <Row className="justify-content-md-center mt-5">
                <Col md='6'>
                    <Form className="auth-form" onSubmit={fromSubmitHandler}>
                        <Alert variant='danger' className={alert.dNone}>
                            {alert.mess}
                        </Alert>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Имя пользователя:</Form.Label>
                            <Form.Control 
                            type="text" 
                            name='username' 
                            onChange={inputHandler}
                            value={state.username}
                            placeholder="Введите имя пользователя" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Пароль:</Form.Label>
                            <Form.Control 
                            type="password" 
                            name='password' 
                            onChange={inputHandler}
                            value={state.password}
                            placeholder="Введите пароль" />
                        </Form.Group>
                        <Button name='submit' variant="primary" type="submit">
                            Войти
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}