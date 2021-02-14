using Application.Operations;
namespace Application.Operations
{
public class Totals
    {
        public int LeadsTotal { get; set; }
        public int OpportunitiesTotal { get; set; }
        public int QuotesTotal { get; set; }
        public int InvoicesTotal { get; set; }
        public int ConversionsTotal { get; set; }
        public int OrdersTotal { get; set; }
        public double RevenueTotal { get; set; }
        public Sources SourcesTotal { get; set; }
        public Totals(int leadsTotal, int opportunitiesTotal, int quotesTotal, int invoicesTotal, int conversionsTotal, int ordersTotal, double revenueTotal, Sources sourcesTotal)
        {
            LeadsTotal = leadsTotal;
            OpportunitiesTotal = opportunitiesTotal;
            QuotesTotal = quotesTotal;
            InvoicesTotal = invoicesTotal;
            ConversionsTotal = conversionsTotal;
            OrdersTotal = ordersTotal;
            RevenueTotal = revenueTotal;
            SourcesTotal = sourcesTotal;
        }

    }
}