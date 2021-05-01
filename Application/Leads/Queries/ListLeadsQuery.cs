using System;
using System.Collections.Generic;
using Domain;
using MediatR;

namespace Application.Leads.Queries
{
    public class ListLeadsQuery : IRequest<List<Lead>>
    {
        public string UserId { get; }
        public string UserLevel { get; }
        public bool AllLeads { get; }
        public string Status { get; }
        public string SortBy { get; }

        public ListLeadsQuery(string userId, string userLevel, bool allLeads, string status, string sortBy)
        {
            UserId = userId;
            UserLevel = userLevel;
            AllLeads = allLeads;
            Status = status;
            SortBy = sortBy;
        }
    }
}
