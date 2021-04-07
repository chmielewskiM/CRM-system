import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { IContact, ContactFormValues, ICompleteContactsData } from '../models/contact';
import { ICompleteOrdersData, IOrder } from '../models/order';
import { IDelegatedTaskForm, ICompleteTaskData, IDelegatedTask } from '../models/delegatedTask';
import { IUser, IUserFormValues, User } from '../models/user';
import { IOperation, CompleteStats, ICompleteStats } from '../models/operation';
import { ILead, Lead } from '../models/lead';

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
  // if (error.message === 'Network Error' && !error.response) {
  //   toast.error('Connection error');
  // }
  // const { status, data, config } = error.response;

  // if ((status === 400 && config.method === 'post') || (status === 400 && config.method === 'put')) {
  //   toast.error('400');
  // }
  // if (status === 500) {
  //   toast.error('Server errror');
  // }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => axios.get(url).then(responseBody),
  post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
  put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
  del: (url: string) => axios.delete(url).then(responseBody),
};

const Contacts = {
  get: (name: String): Promise<IContact> => requests.get(`/contact/name/${name}`),
  listContacts: (params: URLSearchParams): Promise<ICompleteContactsData> => axios.get(`/contact`, {params: params}).then(responseBody),
  details: (id: string) => requests.get(`/contact/${id}`),
  add: (contact: IContact) => requests.post('/contact', contact),
  update: (contact: IContact) => requests.put(`/contact/${contact.id}`, contact),
  delete: (id: string) => requests.del(`/contact/${id}`),
  upgradeToPremium: (contact: IContact)  => requests.put(`/contact/premium/upgrade/${contact.id}`, contact),
  unshare: (id: string) => requests.del(`/contact/remove/${id}`),
};

const Leads = {
  list: (params: URLSearchParams): Promise<ILead[]> => axios.get(`/lead`, {params: params}).then(responseBody),
  details: (id: string) => requests.get(`/lead/${id}`),
  add: (lead: ILead) => requests.post('/lead', lead),
  changeStatus: (contactId: string, upgrade:boolean) => requests.put(`/lead/${contactId}=${upgrade}`, {}),
  editLead: (contact: IContact) => requests.put(`/lead/edit/${contact.id}`, contact),
  abandonLead: (params: URLSearchParams) => axios.delete(`/lead`, {params: params}).then(responseBody),
};

const DelegatedTasks = {
  listTasks: (params: URLSearchParams): Promise<ICompleteTaskData> => axios.get('/delegatedTask', {params: params}).then(responseBody),
  listPendingTasks: (activePage:number, pageSize: number): Promise<ICompleteTaskData> => requests.get(`/delegatedTask/pending/page${activePage}=size${pageSize}`),
  details: (id: string) => requests.get(`/delegatedTask/${id}`),
  add: (task: IDelegatedTaskForm) => requests.post('/delegatedTask', task),
  update: (task: IDelegatedTask) =>
    requests.put(`/delegatedTask/${task.id}`, task),
  delete: (id: string) => requests.del(`/delegatedTask/${id}`),
  share: (id: string, user: IUserFormValues) => requests.post(`/delegatedTask/${id}/share/${user.username}`, User),
  unshare: (id: string) => requests.post(`/delegatedTask/unshare/${id}/`, {}),
  accept: (task: IDelegatedTask) => requests.post(`/delegatedTask/accept/${task.id}/`, task),
  refuse: (task: IDelegatedTask) => requests.post(`/delegatedTask/refuse/${task.id}/`, task),
  finish: (task: IDelegatedTask) => requests.post(`/delegatedTask/finish/${task.id}/`, task),
};

const Orders = {
  list: (params: URLSearchParams): Promise<ICompleteOrdersData> => axios.get(`/order`, {params: params}).then(responseBody),
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
  axios.get(`/operation/`).then(responseBody),
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
