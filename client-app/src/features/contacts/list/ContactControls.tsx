import React, { Fragment, useContext, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {
  leadControls,
  opportunityControls,
  quoteControls,
  invoiceControls,
  contactControls,
} from '../../../app/common/options/buttons';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { IContact } from '../../../app/models/contact';
import ShareContactForm from '../form/ShareContactForm';

interface IProps {
  contact: IContact;
}

export const ContactControls: React.FC<IProps> = (props) => {
  const rootStore = useContext(RootStoreContext);
  const { modal, openModal, confirmModal } = rootStore.modalStore;

  const {
    submitting,
    handleContact,
    shareContactForm,
    rr,
  } = rootStore.contactStore;
  useEffect(() => {}, [rr]);

  const status = props.contact.status;

  return (
    <Fragment>
      <Button.Group>
        {contactControls.map((button: any) => (
          <Fragment key={button.key}>
            <Button
              as={button.as}
              href={
                button.as == 'a'
                  ? 'mailto:'.concat(props.contact.email)
                  : undefined
              }
              icon={button.icon}
              content={
                <span className="button-description">{button.content}</span>
              }
              size={button.size}
              compact={button.compact}
              className={button.className}
              onClick={() => {
                handleContact(button.functionArg, props.contact);
              }}
              // disabled={submitting || (button.className ==  'invoice' && props.lead.order == null) }
              disabled={submitting}
            />
          </Fragment>
        ))}
      </Button.Group>
    </Fragment>
  );
};
export default observer(ContactControls);
