using System;
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Contacts.Queries
{
    public class ListContactsQuery : IRequest<(List<Contact>, int)>
    {
        public bool InProcess { get; set; }
        public bool Premium { get; set; }
        public string OrderBy { get; set; }
        public int? ActivePage { get; set; }
        public int? PageSize { get; set; }
        public string FilterInput { get; set; }
        public bool Uncontracted { get; set; }
        public ListContactsQuery(bool inProcess, bool premium, string orderBy, int? activePage, int? pageSize, string filterInput, bool uncontracted)
        {
            Uncontracted = uncontracted;
            InProcess = inProcess;
            Premium = premium;
            OrderBy = orderBy;
            ActivePage = activePage + 1;
            PageSize = pageSize;
            FilterInput = filterInput;
        }
    }
}