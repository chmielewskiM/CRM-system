using System;

namespace Application.Operations.ViewModels
{
    public class CollectedOperationDataViewModel
    {

        public int Leads { get; set; }
        public int Opportunities { get; set; }
        public int Quotes { get; set; }
        public int Invoices { get; set; }
        public int Conversions { get; set; }
        public int Orders { get; set; }
        public double Revenue { get; set; }
        public SourcesViewModel Sources { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public CollectedOperationDataViewModel(DateTime dateStart, DateTime dateEnd, int leads, int opportunities,
                                        int quotes, int invoices, int conversions, int orders, double revenue, SourcesViewModel sources)
        {
            DateStart = dateStart;
            DateEnd = dateEnd;
            Leads = leads;
            Opportunities = opportunities;
            Quotes = quotes;
            Invoices = invoices;
            Conversions = conversions;
            Orders = orders;
            Revenue = revenue;
            Sources = sources;
        }

    }
}