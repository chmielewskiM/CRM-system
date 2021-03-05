import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues } from '../models/contact';
import { IOrder } from '../models/order';
import { IDelegatedTaskForm } from '../models/delegatedTask';
import { IUser, IUserFormValues, User } from '../models/user';
import { IOperation, CompleteStats, ICompleteStats } from '../models/operation';
import { wait } from '@testing-library/react';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (cfg) => {
    const token = window.localStorage.getItem('jwt');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Connection error');
  }
  const { status, data, config } = error.response;

  if ((status === 400 && config.method === 'post') || (status === 400 && config.method === 'put')) {
    toast.error('400');
  }
  if (status === 500) {
    toast.error('Server errror');
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const delay = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) => setTimeout(() => resolve(response), ms));

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
};

const Contacts = {
  get: (name: String): Promise<IContact> => requests.get(`/contact/name/${name}`),
  list: (): Promise<IContact[]> => requests.get('/contact'),
  details: (id: string) => requests.get(`/contact/${id}`),
  add: (contact: IContact) => requests.post('/contact', contact),
  update: (contact: IContact) => requests.put(`/contact/${contact.id}`, contact),
  delete: (id: string) => requests.del(`/contact/${id}`),
};

const Leads = {
  list: (): Promise<IContact[]> => requests.get('/lead'),
  details: (id: string) => requests.get(`/lead/${id}`),
  add: (contact: IContact) => requests.post('/lead', contact),
  update: (contact: IContact) => requests.put(`/lead/${contact.id}`, contact),
  delete: (id: string) => requests.del(`/lead/${id}`),
};

const DelegatedTasks = {
  list: (): Promise<IDelegatedTaskForm[]> => requests.get('/delegatedTask'),
  details: (id: string) => requests.get(`/delegatedTask/${id}`),
  add: (delegatedTask: IDelegatedTaskForm) => requests.post('/delegatedTask', delegatedTask),
  update: (delegatedTask: IDelegatedTaskForm) =>
    requests.put(`/delegatedTask/${delegatedTask.id}`, delegatedTask),
  delete: (id: string) => requests.del(`/delegatedTask/${id}`),
  share: (id: string, user: IUserFormValues) => requests.post(`/delegatedTask/${id}/share/${user.username}`, User),
};

const Calls = {
  list: (): Promise<IContact[]> => requests.get('/contact'),
  add: (contact: IContact) => requests.post('/contact', contact),
  update: (contact: IContact) => requests.put(`/contact/${contact.id}`, contact),
  delete: (id: string) => requests.del(`/contact/${id}`),
};

const Orders = {
  list: (params: URLSearchParams): Promise<IOrder[]> => axios.get(`/order`, {params: params}).then(responseBody),
  add: (order: IOrder) => requests.post('/order', order),
  update: (order: IOrder) => requests.put(`/order/${order.id}`, order),
  delete: (id: string) => requests.del(`/order/${id}`),
  closeOrder:(order: IOrder)  => requests.put(`/order/close/${order.id}`, order),
};

const Users = {
  get: (username: String): Promise<IUserFormValues> => requests.get(`/user/${username}`),
  list: (): Promise<IUser[]> => requests.get('/user/list'),
  logged: (): Promise<IUser> => requests.get('/user'),
  login: (user: IUserFormValues): Promise<IUser> => requests.post('/user/login', user),
  register: (user: IUserFormValues): Promise<IUser> => requests.post('/user/register', user),
};
const Operations = {
  list: (): Promise<ICompleteStats> => 
  axios.get(`/operation/`).then(delay(1000)).then(responseBody),
  add: (operation: IOperation) => requests.post('/operation', operation),
  delete: (id: string) => requests.del(`/operation/${id}`),
};

export default {
  Contacts,
  Leads,
  Orders,
  DelegatedTasks,
  Users,
  Operations
};
