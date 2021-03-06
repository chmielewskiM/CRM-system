import React, { Fragment, useEffect } from 'react';
import { Button } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import {
  leadControls,
  opportunityControls,
  quoteControls,
  invoiceControls,
} from '../../../app/common/options/buttons';
import { useStores } from '../../../app/stores/rootStore';
import { ILead } from '../../../app/models/lead';

interface IProps {
  lead: ILead;
}

export const LeadControls: React.FC<IProps> = (props) => {
  const { leadStore } = useStores();

  useEffect(() => {}, []);

  const status = props.lead.contact.status;

  const importControls = (status: string) => {
    switch (status) {
      case 'Lead':
        return leadControls;
      case 'Opportunity':
        return opportunityControls;
      case 'Quote':
        return quoteControls;
      case 'Invoice':
        return invoiceControls;
    }
  };

  return (
    <Fragment>
      <Button.Group>
        {importControls(status)?.map((button: any) => (
          <Fragment key={button.key}>
            <Button
              as={button.as}
              href={
                button.as == 'a'
                  ? 'mailto:'.concat(props.lead.contact.email)
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
                leadStore.handleLead(button.functionArg, props.lead);
                leadStore.setTargetLead(props.lead);
              }}
              disabled={
                leadStore.submitting ||
                (button.className == 'invoice' && props.lead.order == null)
              }
            />
          </Fragment>
        ))}
      </Button.Group>
    </Fragment>
  );
};
export default observer(LeadControls);
