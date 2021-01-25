import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { options } from '../../../app/common/options/leadSettings';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IContact } from '../../../app/models/contact';
import ConfirmationModal from '../../../app/common/modals/ConfirmationModal';

interface IProps {
  contact: IContact;
}

export const LeadSettings: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { openModal } = rootStore.modalStore;
  const { handleSettings, status, rr } = rootStore.leadStore;
  useEffect(() => {}, [rr]);

  const [cont, setContact] = useState(props.contact);

  return (
    <Fragment>
      <ConfirmationModal contact={cont} />
      <Dropdown className="button icon teal" floating trigger={<></>} icon="settings" item>
        <Dropdown.Menu>
          {options.map((opt: any) => {
            return (
              !(cont.status == 'Active' && opt.key == 'downgrade') &&
              !(cont.status == 'Invoice' && opt.key == 'upgrade') && (
                <Dropdown.Item
                  key={opt.key}
                  onClick={() => {
                    handleSettings(opt.key, cont);
                  }}
                >
                  {opt.text}
                </Dropdown.Item>
              )
            );
          })}
          {options.map((opt: any) => {
            return (
              cont.status == 'Active' &&
              opt.key == 'downgrade' && (
                <Dropdown.Item
                  disabled
                  key={opt.key}
                  onClick={() => {
                    handleSettings(opt.key, cont);
                  }}
                >
                  {opt.text}
                </Dropdown.Item>
              )
            );
          })}
          {(status == 'Active' || status == 'Opportunity') && (
            <Dropdown.Item
              onClick={() => {
                openModal('Are you sure?', 'this.contact', 'Really sure?');
              }}
            >
              Delete
            </Dropdown.Item>
          )}
          {status == 'Invoice' && <Dropdown.Item>Convert</Dropdown.Item>}
          {status == 'Quote' && <Dropdown.Item>Quote refused</Dropdown.Item>}
        </Dropdown.Menu>
      </Dropdown>
    </Fragment>
  );
};
export default observer(LeadSettings);
