import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import { Popup, Segment, Modal, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import InfoModal from '../../../app/common/modals/InfoModal';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const myEventsList = [
  { start: new Date(), end: new Date('2021-01-31 22:49:42.1744062'), title: '123' },
  { start: new Date(), end: new Date(), title: '456' },
];


const eventPropGetter = (event: any, start: any, end: any, isSelected: boolean) => {
  var style = {
    backgroundColor:'',
  };
  switch(event.title){
  case 'Call':
  style.backgroundColor = 'green'
  break;
  case 'Manage':
  style.backgroundColor = 'red'
  break;
  case 'Order':
  style.backgroundColor = 'blue'
  break;
  case 'Send Invoice':
  style.backgroundColor = 'black'
  break;
  }
  return {
    style: style,
  };
};
interface IProps {
  events: {
    start:Date,
    end:Date,
    title:string,
    allDay:boolean,
  }[]
}

export const MyCalendar: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { render, rr, sel, bool, body, selectedEvent } = rootStore.homeStore;
  const { closeModal, confirmModal, modal, openModal } = rootStore.modalStore;
  useEffect(() => {
    rootStore.delegatedTaskStore.loadDelegatedTasks()
    rootStore.delegatedTaskStore.calendarEvents
  }, [rr]);

  return (
    <Fragment>
      <div id="rbc">
        <Calendar
          localizer={localizer}
          events={props.events}
          startAccessor="start"
          endAccessor="end"
          allDayAccessor = 'allDay'
          eventPropGetter={eventPropGetter}
          onView={()=>rootStore.delegatedTaskStore.calendarEvents}
          views={['month', 'day']}
          onSelectEvent={(data, e) => openModal(data.title, '', '')}
        />
        <InfoModal open={false} body="sdsds" />
      </div>
    </Fragment>
  );
};

export default observer(MyCalendar);
