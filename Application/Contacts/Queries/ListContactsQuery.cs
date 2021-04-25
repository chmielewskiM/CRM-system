using System;
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Contacts.Queries
{
    public class ListContactsQuery : IRequest<(List<Contact>, int)>
    {
        public bool InProcess { get; }
        public bool Premium { get; }
        public string OrderBy { get; }
        public int? ActivePage { get; }
        public int? PageSize { get; }
        public string FilterInput { get; }
        public bool Uncontracted { get; }

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