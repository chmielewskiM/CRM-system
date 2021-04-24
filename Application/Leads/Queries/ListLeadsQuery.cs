using System;
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Leads.Queries
{
    public class ListLeadsQuery : IRequest<List<Lead>>
    {
        public bool AllLeads { get; set; }
        public string Status { get; set; }
        public string SortBy { get; set; }
        public ListLeadsQuery(bool allLeads, string status, string sortBy)
        {
            AllLeads = allLeads;
            Status = status;
            SortBy = sortBy;
        }
    }
}
