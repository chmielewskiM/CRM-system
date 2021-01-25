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
  { start: new Date(), end: new Date(), title: '123' },
  { start: new Date(), end: new Date(), title: '456' },
];


const eventPropGetter = (event: any, start: any, end: any, isSelected: boolean) => {
  const style = {
    backgroundColor: '#FF0000',
    paddingLeft: '10px',
    color: 'white',
  };
  return {
    style: style,
  };
};
interface CalendarWithTooltipProps {
  events: Event[];
}

export const MyCalendar: React.FC = () => {
  const rootStore = useContext(RootStoreContext);
  const { render, rr, sel, bool, body, selectedEvent } = rootStore.homeStore;
  const { closeModal, confirmModal, modal, openModal } = rootStore.modalStore;
  useEffect(() => {
    console.log('cal');
  }, [rr]);

  return (
    <Fragment>
      <div id="rbc">
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          views={['month']}
          onSelectEvent={(data, e) => openModal(data.title, '', '')}
        />
        <InfoModal open={false} body="" />
      </div>
    </Fragment>
  );
};

export default observer(MyCalendar);
