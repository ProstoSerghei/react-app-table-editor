import React, {useState, useEffect} from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

import {useAllOrdersQuery, useAllUsersQuery, usePutTodoDataMutation, usePostTodoDataMutation} from '../store/backend/back.api';




export default function Orders() {
    const {isLoading, data: orders} = useAllOrdersQuery()
    const {data: users} = useAllUsersQuery()
    const navigate = useNavigate()
    useEffect(()=>{
        let cookie = new Cookies()
        if (!cookie.get('token')) {
            navigate('/')
        }
    }, [])
    return (
        <Container fluid='xxl' className="content p-0 bg-dark">
            <Row className="m-0">
                <Col>
                    {isLoading && <h2 className="text-center mt-5">Loading...</h2>}
                    {Boolean(orders) && <Table  bordered variant="dark">
                        <OrdersTableHeader />
                        <tbody>
                            {orders.map((order, index)=>(
                                <OrderRow key={index} order={order} users={users} />
                            ))}
                        </tbody>
                        </Table>
                    }
                </Col>
            </Row>
            <Row className="m-0 p-0">
                <Col>
                    <AddOrderFormModal users={users}/>
                </Col>
            </Row>
        </Container>
    )
}


function OrderRow(data){
    let order = data.order
    let users = data.users
    const [check, setCheck] = useState(order.state)

    const [putData, result] = usePutTodoDataMutation()

    const cancelBtnHandler = (e)=>{
        window.location.reload()
    }
    
    const saveBtnHandler = (e)=>{
        let changedEls = document.querySelectorAll('.changed-row')

        changedEls.forEach(el=>{
            let orderId = el.dataset.id
            let orderNum = el.querySelector('.order-num').value
            let orderUserId = el.querySelector('.user-id-sel').value
            let orderTitle = el.querySelector('.order-title').value
            let orderDesc = el.querySelector('.order-desc').value
            let orderState = el.querySelector('.order-state > input').checked
            let bodyRequest = {
                "user_id": orderUserId,
                "order": orderNum,
                "title": orderTitle,
                "description": orderDesc,
                "state": orderState
            }
            putData({id:orderId, ...bodyRequest})
        })
    }

    const checkHandler = (e)=>{
        setSuccess(e.target.parentElement.parentElement, e.target.parentElement.parentElement.parentElement)
        setCheck(prev=>!prev)
    }
    
    const selectHandler = (e)=>{
        setSuccess(e.target, e.target.parentElement.parentElement)
    }
    
    const orderNum = useInput(order.order)
    const orderTitle = useInput(order.title)
    const orderDesc = useInput(order.description)

    useEffect(()=>{
        document.querySelector('.cancel-btn').addEventListener('click', cancelBtnHandler)
        document.querySelector('.save-btn').addEventListener('click', saveBtnHandler)

        return ()=>{
            document.querySelector('.cancel-btn').removeEventListener('click', cancelBtnHandler)
            document.querySelector('.save-btn').removeEventListener('click', saveBtnHandler)
        }
    },[])
    return (
        <tr data-bs-theme="dark" className="m-0 p-0" data-id={order.id}>
            <td className="p-1"><Form.Control
            type="number"
            className="rounded-0 text-reset border-0 order-num"
            {...orderNum}
            />
            
            </td>

            <td className="p-1"><Form.Select 
            className="rounded-0 text-reset border-0 user-id-sel"
            onChange={selectHandler}
            >
                <option value={order.user.pk}>{order.user.username}</option>
                {Boolean(users) && users.map(user=>{
                    if (user.pk !== order.user.pk) {
                        return (
                            <option key={user.pk} value={user.pk}>{user.username}</option>
                    
                    )}
                    return false
                })}
            </Form.Select>
            </td>

            <td className="p-1"><Form.Control 
            className="rounded-0 text-reset border-0 order-title" 
            {...orderTitle}
            />
            
            </td>

            <td className="p-1"><Form.Control 
            className="rounded-0 text-reset border-0 order-desc" 
            {...orderDesc}
            />
            
            </td>

            <td className="p-1 text-center"><Form.Check 
            className="rounded-0 text-reset border-0 order-state" 
            inline type='checkbox' 
            checked={check}
            onChange={checkHandler}
            />
            
            </td>

            <td className="p-1"><Form.Control 
            className="rounded-0 text-reset border-0 " 
            value={`${order.created.split('T')[0]} ${order.created.split('T')[1].split('.')[0]}`}
            disabled
            />
            
            </td>

            </tr>
    )
}


function OrdersTableHeader(){
    return (
        <thead>
            <tr>
                <th>Номер заказа</th>
                <th>Пользователь</th>
                <th>Заголовок</th>
                <th>Описание</th>
                <th>Состояние</th>
                <th>Дата создания</th>
            </tr>
        </thead>
    )
}


function AddOrderFormModal(data){
    const [postOrder] = usePostTodoDataMutation()
    const users = data.users
    const [show, setShow] = useState(false);
    
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const orderNumInput = useInput('')
    const orderTitleInput = useInput('')
    const orderDescInput = useInput('')

    const [selected, setSelected] = useState(2)

    const onSubmitHandler = (e)=>{
        e.preventDefault()
        let form = e.target
        let data = {
            user_id: form.orderUserId.value,
            order: form.orderNum.value,
            title: form.orderTitle.value,
            description: form.orderDesc.value
        }
        postOrder(data)
        handleClose()
    }
    return (
    <>
        <Button className="btn btn-success d-block m-auto mb-3" onClick={handleShow}>
        Добавить запись
        </Button>

        <Modal
            show={show}
            onHide={handleClose}
            keyboard={false}
        >
            <Form onSubmit={onSubmitHandler}>
                <Modal.Header closeButton>
                    <Modal.Title>Заполните форму</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <FloatingLabel
                    controlId="orderNumfloatingInput"
                    label="Номер заказа"
                    className="mb-3"
                >
                    <Form.Control 
                        type="number"
                        name='orderNum'
                        placeholder="Номер заказа" 
                        {...orderNumInput}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="selectfloatingInput"
                    label="Имя пользователя"
                    className="mb-3"
                >
                    <Form.Select name='orderUserId' value={selected} onChange={(e) => setSelected(e.target.value)}>
                        {Boolean(users) && users.map(user=><option 
                            key={user.pk} 
                            value={user.pk} 
                        >{user.username}</option>)}
                    </Form.Select>
                </FloatingLabel>
                <FloatingLabel
                    controlId="titlefloatingInput"
                    label="Заголовок"
                    className="mb-3"
                >
                    <Form.Control 
                        type="text" 
                        name='orderTitle'
                        placeholder="Заголовок" 
                        {...orderTitleInput}
                    />
                </FloatingLabel>
                <FloatingLabel
                    controlId="orderDescfloatingInput"
                    label="Описание"
                    className="mb-3"
                >
                    <Form.Control 
                        as="textarea"
                        name='orderDesc'
                        placeholder="Описание" 
                        {...orderDescInput}
                        style={{ height: '150px' }}
                    />
                </FloatingLabel>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClose}>
                    Отмена
                    </Button>
                    <Button variant="success" type="submit">Сохранить</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </>
    );
}




function useInput(initValue) {
    const [value, setValue] = useState(initValue)

    const onChange = (e) => {
        setValue(e.target.value)
        setSuccess(e.target, e.target.parentElement.parentElement)
    }

    return {
        value, onChange
    }
}

function setSuccess(el, parEl) {
    if (parEl.tagName === 'TR') {
        let btnsGroupEl = document.querySelector('.save-cancel')
        btnsGroupEl.classList.remove('d-none')
        el.classList.add('bg-success')
        parEl.classList.add('changed-row')
    }
}