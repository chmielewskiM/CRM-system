import axios, {AxiosResponse} from 'axios';
import {toast} from 'react-toastify';
import {IContact} from '../models/contact';
import {IOrder} from '../models/order';
import {IMaterial} from '../models/material';
import {IDelegatedTaskForm} from '../models/delegatedTask';
import {IUser, IUserFormValues} from '../models/user';
import {useContext} from 'react';
import {RootStoreContext} from '../stores/rootStore';

axios.defaults.baseURL = 'http://localhost:5000';

axios
    .interceptors
    .request
    .use((cfg) => {
        const token = window
            .localStorage
            .getItem('jwt');
        if (token) 
            cfg.headers.Authorization = `Bearer ${token}`;
        return cfg;
    }, (error) => {
        return Promise.reject(error);
    });

axios
    .interceptors
    .response
    .use(undefined, (error) => {
        if (error.message === 'Network Error' && !error.response) {
            toast.error('Connection error');
        }
        const {status, data, config} = error.response;

        if ((status === 400 && config.method === 'post') || (status === 400 && config.method === 'put')) {
            toast.error('400');
        }
        if (status === 500) {
            toast.error('Server errror');
        }
        throw error.response;
    });

const responseBody = (response : AxiosResponse) => response.data;

const delay = (ms : number) => (response : AxiosResponse) => new Promise < AxiosResponse > ((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url : string) => axios
        .get(url)
        .then(delay(10))
        .then(responseBody),
    post: (url : string, body : {}) => axios
        .post(url, body)
        .then(delay(10))
        .then(responseBody),
    put: (url : string, body : {}) => axios
        .put(url, body)
        .then(delay(10))
        .then(responseBody),
    del: (url : string) => axios
        .delete(url)
        .then(delay(10))
        .then(responseBody)
};

const Contacts = {
    list: (): Promise < IContact[] > => requests.get('/contact'),
    details: (id : string) => requests.get(`/contact/${id}`),
    add: (contact : IContact) => requests.post('/contact', contact),
    update: (contact : IContact) => requests.put(`/contact/${contact.id}`, contact),
    delete: (id : string) => requests.del(`/contact/${id}`)
};

const DelegatedTasks = {
    list: (): Promise < IDelegatedTaskForm[] > => requests.get('/delegatedTask'),
    details: (id : string) => requests.get(`/delegatedTask/${id}`),
    add: (delegatedTask : IDelegatedTaskForm) => requests.post('/delegatedTask', delegatedTask),
    update: (delegatedTask : IDelegatedTaskForm) => requests.put(`/delegatedTask/${delegatedTask.id}`, delegatedTask),
    delete: (id : string) => requests.del(`/delegatedTask/${id}`)
};

const Calls = {
    list: (): Promise < IContact[] > => requests.get('/contact'),
    add: (contact : IContact) => requests.post('/contact', contact),
    update: (contact : IContact) => requests.put(`/contact/${contact.id}`, contact),
    delete: (id : string) => requests.del(`/contact/${id}`)
};

const Orders = {
    list: (): Promise < IOrder[] > => requests.get('/order'),
    add: (order : IOrder) => requests.post('/order', order),
    update: (order : IOrder) => requests.put(`/order/${order.id}`, order),
    delete: (id : string) => requests.del(`/order/${id}`)
};

const Materials = {
    list: (): Promise < IMaterial[] > => requests.get('/material'),
    add: (material : IMaterial) => requests.post('/material', material),
    update: (material : IMaterial) => requests.put(`/material/${material.id}`, material),
    delete: (id : string) => requests.del(`/material/${id}`)
};

const User = {
    logged: (): Promise < IUser > => requests.get('/user'),
    login: (user : IUserFormValues): Promise < IUser > => requests.post('/user/login', user),
    register: (user : IUserFormValues): Promise < IUser > => requests.post('/user/register', user)
};

export default {
    Contacts,
    Orders,
    Materials,
    DelegatedTasks,
    User
};
