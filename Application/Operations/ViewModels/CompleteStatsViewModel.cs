using System;
using System.Collections.Generic;
using Domain;

namespace Application.Operations.ViewModels
{
    public class CompleteStatsViewModel
    {
        public TotalsViewModel ThisMonthTotals { get; set; }
        public TotalsViewModel OneMonthTotals { get; set; }
        public TotalsViewModel SixMonthsTotals { get; set; }
        public List<CollectedOperationDataViewModel> ThisMonthData { get; set; }
        public List<CollectedOperationDataViewModel> OneMonthData { get; set; }
        public List<CollectedOperationDataViewModel> SixMonthsData { get; set; }
        public List<OpportunitiesByUserViewModel> OneMonthOpportunitiesByUser { get; set; }
        public List<OpportunitiesByUserViewModel> SixMonthsOpportunitiesByUser { get; set; }

        public CompleteStatsViewModel(List<CollectedOperationDataViewModel> thisMonthData, TotalsViewModel thisMonthTotals,
                                List<CollectedOperationDataViewModel> oneMonthData, TotalsViewModel oneMonthTotals,
                                List<CollectedOperationDataViewModel> sixMonthsData, TotalsViewModel sixMonthsTotals,
                                List<OpportunitiesByUserViewModel> oneMonthOpportunitiesByUser, List<OpportunitiesByUserViewModel> sixMonthsOpportunitiesByUser)
        {
            ThisMonthTotals = thisMonthTotals;
            ThisMonthData = thisMonthData;
            OneMonthTotals = oneMonthTotals;
            OneMonthData = oneMonthData;
            SixMonthsTotals = sixMonthsTotals;
            SixMonthsData = sixMonthsData;
            OneMonthOpportunitiesByUser = oneMonthOpportunitiesByUser;
            SixMonthsOpportunitiesByUser = sixMonthsOpportunitiesByUser;
        }
    }
}