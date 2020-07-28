import axios, { AxiosResponse } from 'axios';
import { IContact } from '../models/contact';

axios.defaults.baseURL = 'http://localhost:5000';

const responseBody = (response: AxiosResponse) => response.data;

const delay = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>(resolve => setTimeout(() => resolve(response), ms));

const requests = {
    get: (url: string) => axios.get(url).then(delay(10)).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(delay(10)).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(delay(10)).then(responseBody),
    del: (url: string) => axios.delete(url).then(delay(10)).then(responseBody)
}

const Contacts = {
    list: (): Promise<IContact[]> => requests.get('/contact'),
    details: (id:string) => requests.get(`/contact/${id}`),
    add: (contact: IContact) => requests.post('/contact', contact),
    update: (contact: IContact) => requests.put(`/contact/${contact.id}`, contact),
    delete: (id: string) => requests.del(`/contact/${id}`)
}

export default {
    Contacts
}