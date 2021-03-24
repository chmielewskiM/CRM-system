using System.Collections.Generic;

namespace Application.Contacts
{
    public class CompleteContactsData
    {
        public List<ContactDTO> Contacts { get; set; }
        public int ContactsTotal { get; set; }

        public CompleteContactsData(List<ContactDTO> contacts, int contactsTotal)
        {
            ContactsTotal = contactsTotal;
            Contacts = contacts;

        }
    }
}