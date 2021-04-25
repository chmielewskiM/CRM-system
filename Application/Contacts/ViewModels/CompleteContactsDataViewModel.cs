using System.Collections.Generic;

namespace Application.Contacts
{
    public class CompleteContactsDataViewModel
    {
        public List<ContactViewModel> Contacts { get; set; }
        public int ContactsTotal { get; set; }
        public CompleteContactsDataViewModel(List<ContactViewModel> contacts, int contactsTotal)
        {
            ContactsTotal = contactsTotal;
            Contacts = contacts;
        }
    }
}