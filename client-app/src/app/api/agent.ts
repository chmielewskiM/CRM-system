import axios, {AxiosResponse} from 'axios';
import {toast} from 'react-toastify';
import {IContact, ICompleteContactsData} from '../models/contact';
import {ICompleteOrdersData, IOrder} from '../models/order';
import {IDelegatedTaskForm, ICompleteTaskData, IDelegatedTask} from '../models/delegatedTask';
import {IUser, IUserFormValues, User} from '../models/user';
import {ICompleteStats} from '../models/operation';
import {ILead} from '../models/lead';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

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
        console.log(error);
        return Promise.reject(error);
    });

axios
    .interceptors
    .response
    .use(undefined, (error) => {
        if (error.message === 'Network Error' && !error.response) {
            toast.error('Connection error');
        }
        
        // const { status, data, config } = error.response; if ((status === 400 &&
        // config.method === 'post') || (status === 400 && config.method === 'put')) {
        // toast.error('400'); } if (status === 500) {   toast.error('Server errror'); }
        throw error.response;
    });

const responseBody = (response : AxiosResponse) => response.data;

const requests = {
    get: (url : string) => axios
        .get(url)
        .then(responseBody),
    post: (url : string, body : {}) => axios
        .post(url, body)
        .then(responseBody),
    put: (url : string, body : {}) => axios
        .put(url, body)
        .then(responseBody),
    del: (url : string) => axios
        .delete(url)
        .then(responseBody)
};

const Contacts = {
    getContact: (name : String): Promise < IContact > => requests.get(`/contacts/name/${name}`),
    listContacts: (params : URLSearchParams): Promise < ICompleteContactsData > => axios
        .get(`/contacts`, {params: params})
        .then(responseBody),
    addContact: (contact : IContact) => requests.post('/contacts', contact),
    upgradeToPremium: (contact : IContact) => requests.post(`/contacts/upgrade/${contact.id}`, contact),
    startSaleProcess: (contact : IContact) => requests.post(`/contacts/${contact.id}`, contact),
    updateContact: (contact : IContact) => requests.put(`/contacts/${contact.id}`, contact),
    deleteContact: (id : string) => requests.del(`/contacts/${id}`),
    unshareContact: (id : string) => requests.del(`/contacts/remove/${id}`)
};

const Leads = {
    listLeads: (params : URLSearchParams): Promise < ILead[] > => axios
        .get(`/leads`, {params: params})
        .then(responseBody),
    leadDetails: (id : string) => requests.get(`/leads/${id}`),
    addLead: (lead : ILead) => requests.post('/leads', lead),
    changeStatus: (contactId : string, upgrade : boolean) => requests.put(`/leads/${contactId}=${upgrade}`, {}),
    abandonLead: (params : URLSearchParams) => axios
        .delete(`/leads/abandon`, {params: params})
        .then(responseBody)
};

const DelegatedTasks = {
    listTasks: (params : URLSearchParams): Promise < ICompleteTaskData > => axios
        .get('/delegatedTasks', {params: params})
        .then(responseBody),
    listPendingTasks: (activePage : number, pageSize : number): Promise < ICompleteTaskData > => requests.get(`/delegatedTasks/pending/page${activePage}=size${pageSize}`),
    taskDetails: (id : string) => requests.get(`/delegatedTasks/${id}`),
    addTask: (task : IDelegatedTaskForm) => requests.post('/delegatedTasks', task),
    shareTask: (id : string, user : IUserFormValues) => requests.post(`/delegatedTasks/${id}/share/${user.username}`, User),
    unshareTask: (id : string) => requests.post(`/delegatedTasks/unshare/${id}`, {}),
    acceptTask: (task : IDelegatedTask) => requests.post(`/delegatedTasks/accept/${task.id}`, task),
    refuseTask: (task : IDelegatedTask) => requests.post(`/delegatedTasks/refuse/${task.id}`, task),
    finishTask: (task : IDelegatedTask) => requests.post(`/delegatedTasks/finish/${task.id}`, task),
    updateTask: (task : IDelegatedTask) => requests.put(`/delegatedTasks/${task.id}`, task),
    deleteTask: (id : string) => requests.del(`/delegatedTasks/${id}`)
};

const Orders = {
    listOrders: (params : URLSearchParams): Promise < ICompleteOrdersData > => axios
        .get(`/orders`, {params: params})
        .then(responseBody),
    addOrder: (order : IOrder) => requests.post('/orders', order),
    updateOrder: (order : IOrder) => requests.put(`/orders/${order.id}`, order),
    closeOrder: (order : IOrder) => requests.put(`/orders/close/${order.id}`, order),
    deleteOrder: (id : string) => requests.del(`/orders/${id}`)
};

const Users = {
    listUsers: (): Promise < IUser[] > => requests.get('/users'),
    getUser: (username : string): Promise < IUserFormValues > => requests.get(`/users/user/${username}`),
    loggedUser: (): Promise < IUser > => requests.get('/users/logged'),
    login: (user : IUserFormValues): Promise < IUser > => requests.post('/users/login', user),
    registerUser: (user : IUserFormValues): Promise < IUser > => requests.post('/users/register', user),
    updateUser: (user : IUser) => requests.put(`/users/update/${user.id}`, user),
    deleteUser: (username : string) => requests.del(`/users/${username}`)
};

const Operations = {
    listOperations: (): Promise < ICompleteStats > => axios
        .get(`/operations`)
        .then(responseBody),
    countOperations: (): Promise < number > => requests.get('/operations/count')
};

export default {
    Contacts,
    Leads,
    Orders,
    DelegatedTasks,
    Users,
    Operations
};
