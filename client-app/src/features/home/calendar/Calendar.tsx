import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useEffect, useState } from 'react';
import { useStores } from '../../../app/stores/rootStore';
import CalendarModal from './CalendarModal';
import LoaderComponent from '../../../app/layout/LoaderComponent';

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
  {
    start: new Date(),
    end: new Date('2021-01-31 22:49:42.1744062'),
    title: '123',
  },
  { start: new Date(), end: new Date(), title: '456' },
];

const eventPropGetter = (
  event: any,
  start: any,
  end: any,
  isSelected: boolean
) => {
  var style = {
    backgroundColor: '',
  };
  switch (event.title) {
    case 'Call':
      style.backgroundColor = 'green';
      break;
    case 'Manage':
      style.backgroundColor = 'red';
      break;
    case 'Order':
      style.backgroundColor = 'blue';
      break;
    case 'Send Invoice':
      style.backgroundColor = 'black';
      break;
  }
  return {
    style: style,
  };
};
interface IProps {
  events: {
    start: Date;
    deadline: Date;
    title: string;
    allDay: boolean;
    createdBy: string;
    pending: boolean;
    notes: string;
  }[];
  loading: boolean;
}

export const MyCalendar: React.FC<IProps> = (props) => {
  const { modalStore, delegatedTaskStore } = useStores();
  useEffect(() => {
    delegatedTaskStore.loadTasks();
    modalStore.closeModal();
  }, []);

  const [event, setEvent] = useState(props.events[0]);
  
  console.log(props.events[0]);
  return (
    <Fragment>
      {props.loading && <LoaderComponent content="Loading..." />}
      <div id="rbc">
        <Calendar
          localizer={localizer}
          events={props.events}
          startAccessor="start"
          endAccessor="deadline"
          allDayAccessor="allDay"
          eventPropGetter={eventPropGetter}
          onView={() => delegatedTaskStore.calendarEvents}
          views={['month', 'day']}
          onSelectEvent={(data, e) => {
            modalStore.openModal(data.title);
            setEvent(data);
          }}
        />
        <CalendarModal open={false} event={event} />
      </div>
    </Fragment>
  );
};

export default observer(MyCalendar);
