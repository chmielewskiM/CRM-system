import React, { Fragment } from 'react'
import { Header, Divider, Label, Segment, Button } from 'semantic-ui-react'
import { IContact } from '../../../app/models/contact'


interface IProps {
    contact: IContact;
    showForm: boolean;
    setShowForm: (showForm: boolean) => void;
    setSelectedContact: (contact: IContact | null) => void;
    deleteContact: (id: string) => void;
}

export const ContactDetails: React.FC<IProps> = ({
    contact,
    setSelectedContact,
    showForm,
    setShowForm,
    deleteContact
}) => {

    return (

        <Segment>
            <Button floated='right' icon='close'
                onClick={() => { setSelectedContact(null) }}
            >

            </Button>
            <Fragment key={contact.id}>

                <Header as='h2' width={16}>
                    Details about {contact.name}
                </Header>

                <Divider clearing />

                <Label as='a' color='red' ribbon>
                    Date added {contact.dateAdded.split('T')[0]}
                </Label>

                <Header as='h3'>Deals</Header>
                <div>Successful:</div>
                <div>Unsuccessful:</div>

                <Divider section />

                <Header as='h3'>Notes</Header>
                {contact.notes}
                <Button.Group widths={2}>
                    <Button onClick={() => setShowForm(true)} primary content='Edit'></Button>
                    <Button onClick={() => deleteContact(contact.id)} negative content='Delete'></Button>
                </Button.Group>
            </Fragment>


        </Segment>
    )
}
