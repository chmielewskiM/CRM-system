using System;
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Leads.Queries
{
    public class ListLeadsQuery : IRequest<List<Lead>>
    {
        public bool AllLeads { get; }
        public string Status { get; }
        public string SortBy { get; }

        public ListLeadsQuery(bool allLeads, string status, string sortBy)
        {
            AllLeads = allLeads;
            Status = status;
            SortBy = sortBy;
        }
    }
}
