import axios, { AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { IContact } from '../models/contact';
import { IOrder } from '../models/order';
import { IMaterial } from '../models/material';
import { IDelegatedTask, IDelegatedTaskForm } from '../models/delegatedTask';

axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Connection error');
  }
  const { status, data, config } = error.response;

  if (
    (status === 400 && config.method === 'post') ||
    (status === 400 && config.method === 'put')
  ) {
    toast.error('400');
  }
  if (status === 500) {
    toast.error('Server errror');
  }
  console.log(error.response);
});

const responseBody = (response: AxiosResponse) => response.data;

const delay = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );

const requests = {
  get: (url: string) => axios.get(url).then(delay(1000)).then(responseBody),
  post: (url: string, body: {}) =>
    axios.post(url, body).then(delay(1000)).then(responseBody),
  put: (url: string, body: {}) =>
    axios.put(url, body).then(delay(1000)).then(responseBody),
  del: (url: string) => axios.delete(url).then(delay(1000)).then(responseBody),
};

const Contacts = {
  list: (): Promise<IContact[]> => requests.get('/contact'),
  details: (id: string) => requests.get(`/contact/${id}`),
  add: (contact: IContact) => requests.post('/contact', contact),
  update: (contact: IContact) =>
    requests.put(`/contact/${contact.id}`, contact),
  delete: (id: string) => requests.del(`/contact/${id}`),
};

const DelegatedTasks = {
  list: (): Promise<IDelegatedTaskForm[]> => requests.get('/delegatedTask'),
  details: (id: string) => requests.get(`/delegatedTask/${id}`),
  add: (delegatedTask: IDelegatedTaskForm) =>
    requests.post('/delegatedTask', delegatedTask),
  update: (delegatedTask: IDelegatedTaskForm) =>
    requests.put(`/delegatedTask/${delegatedTask.id}`, delegatedTask),
  delete: (id: string) => requests.del(`/delegatedTask/${id}`),
};

const Calls = {
  list: (): Promise<IContact[]> => requests.get('/contact'),
  add: (contact: IContact) => requests.post('/contact', contact),
  update: (contact: IContact) =>
    requests.put(`/contact/${contact.id}`, contact),
  delete: (id: string) => requests.del(`/contact/${id}`),
};

const Orders = {
  list: (): Promise<IOrder[]> => requests.get('/order'),
  add: (order: IOrder) => requests.post('/order', order),
  update: (order: IOrder) => requests.put(`/order/${order.id}`, order),
  delete: (id: string) => requests.del(`/order/${id}`),
};

const Materials = {
  list: (): Promise<IMaterial[]> => requests.get('/material'),
  add: (material: IMaterial) => requests.post('/material', material),
  update: (material: IMaterial) =>
    requests.put(`/material/${material.id}`, material),
  delete: (id: string) => requests.del(`/material/${id}`),
};

export default {
  Contacts,
  Orders,
  Materials,
  DelegatedTasks,
};
