
using Domain;

namespace Application.Operations
{
public class OpportunitiesByUser
    {
        public string UserDisplayName { get; set; }
        public int LeadsTotal { get; set; }
        public int OpportunitiesTotal { get; set; }
        public OpportunitiesByUser(string userDisplayName, int leadsTotal, int opportunitiesTotal)
        {
            UserDisplayName = userDisplayName;
            LeadsTotal = leadsTotal;
            OpportunitiesTotal = opportunitiesTotal;
        }
    }
}