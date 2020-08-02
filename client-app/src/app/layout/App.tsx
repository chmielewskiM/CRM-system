import React, { useEffect, Fragment, useContext } from 'react';
import { Container } from 'semantic-ui-react'
import { Navbar } from '../../features/nav/Navbar';
import { ContactDashboard } from '../../features/contacts/dashboard/ContactDashboard';
import LoaderComponent from './LoaderComponent';
import ContactStore from '../stores/contactStore';
import StockStore from '../stores/stockStore';
import OrderStore from '../stores/orderStore';
import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';
import { Homepage } from '../../features/contacts/home/Homepage';
import { SignIn } from '../../features/signin/SignIn';
import { OrderDashboard } from '../../features/orders/dashboard/OrderDashboard';
import { StockDashboard } from '../../features/stock/dashboard/StockDashboard';
import { ToastContainer, Zoom } from 'react-toastify';

const App = () => {

    const contactStore = useContext(ContactStore);
    const orderStore = useContext(OrderStore);
    const stockStore = useContext(StockStore);
    const { showContactForm, setShowContactForm, selectContact, selectedContact } = contactStore;
    const { showOrderForm, setShowOrderForm, selectOrder, selectedOrder } = orderStore;
    const { showMaterialForm, setShowMaterialForm, selectMaterial, selectedMaterial } = stockStore;

    useEffect(() => {
        contactStore.loadContacts();
        orderStore.loadOrders();
        stockStore.loadMaterials();
    }, [contactStore, orderStore, stockStore]);

    if (contactStore.loadingInitial)
        return <LoaderComponent content='Loading...' />

    return (
        <Fragment>
            <ToastContainer
                autoClose={2000}
                transition={Zoom}
                hideProgressBar={true}
                position='bottom-right' />
            <Route exact path='/' component={SignIn} />
            <Route
                path={'/(.+)'}
                render={() => (
                    <Fragment>
                        <Navbar />
                        <Container className='wrapper'>
                            <Switch>
                                <Route path='/contacts' component={ContactDashboard} />
                                <Route path='/orders' component={OrderDashboard} />
                                <Route path='/stock' component={StockDashboard} />
                            </Switch>
                        </Container>
                    </Fragment>
                )} />

        </Fragment>
    );
}

export default observer(App);
