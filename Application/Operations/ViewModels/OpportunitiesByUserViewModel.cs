
using Domain;

namespace Application.Operations.ViewModels
{
public class OpportunitiesByUserViewModel
    {
        public string UserDisplayName { get; set; }
        public int LeadsTotal { get; set; }
        public int OpportunitiesTotal { get; set; }
        public OpportunitiesByUserViewModel(string userDisplayName, int leadsTotal, int opportunitiesTotal)
        {
            UserDisplayName = userDisplayName;
            LeadsTotal = leadsTotal;
            OpportunitiesTotal = opportunitiesTotal;
        }
    }
}