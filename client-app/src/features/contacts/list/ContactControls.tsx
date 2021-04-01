import React, { Fragment, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { contactControls } from '../../../app/common/options/buttons';
import { useStores } from '../../../app/stores/rootStore';
import { IContact } from '../../../app/models/contact';

interface IProps {
  contact: IContact;
}

export const ContactControls: React.FC<IProps> = (props) => {
  const { contactStore } = useStores();

  useEffect(() => {}, []);

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
                contactStore.handleContact(button.functionArg, props.contact);
              }}
              // disabled={submitting || (button.className ==  'invoice' && props.lead.order == null) }
              disabled={contactStore.submitting}
            />
          </Fragment>
        ))}
      </Button.Group>
    </Fragment>
  );
};
export default observer(ContactControls);
