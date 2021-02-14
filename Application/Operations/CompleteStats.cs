using System;
using System.Collections.Generic;
using Domain;

namespace Application.Operations
{
    public class CompleteStats
    {
        public Totals ThisMonthTotals { get; set; }
        public Totals OneMonthTotals { get; set; }
        public Totals SixMonthsTotals { get; set; }
        public List<CollectedOperationData> ThisMonthData { get; set; }
        public List<CollectedOperationData> OneMonthData { get; set; }
        public List<CollectedOperationData> SixMonthsData { get; set; }
        public List<OpportunitiesByUser> OneMonthOpportunitiesByUser { get; set; }
        public List<OpportunitiesByUser> SixMonthsOpportunitiesByUser { get; set; }

        public CompleteStats(List<CollectedOperationData> thisMonthData, Totals thisMonthTotals,
                                List<CollectedOperationData> oneMonthData, Totals oneMonthTotals,
                                List<CollectedOperationData> sixMonthsData, Totals sixMonthsTotals,
                                List<OpportunitiesByUser> oneMonthOpportunitiesByUser, List<OpportunitiesByUser> sixMonthsOpportunitiesByUser)
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