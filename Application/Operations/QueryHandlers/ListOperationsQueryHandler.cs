using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Application.Operations.ViewModels;
using Application.Operations.Queries;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Operations.QueryHandlers
{
    public class ListOperationsQueryHandler : IRequestHandler<ListOperationsQuery, CompleteStatsViewModel>
    {
        private readonly DataContext _context;
        private readonly ILogger<ListOperationsQueryHandler> _logger;
        private readonly IUserAccessor _userAccessor;

        public ListOperationsQueryHandler(DataContext context, ILogger<ListOperationsQueryHandler> logger, IUserAccessor userAccessor)
        {
            _userAccessor = userAccessor;
            _logger = logger;
            _context = context;
        }

        public async Task<CompleteStatsViewModel> Handle(ListOperationsQuery request, CancellationToken cancellationToken)
        {
            //get all users from database
            var users = await _context.Users.ToListAsync();

            //get operations from database as queryable
            IQueryable<Operation> allOperations = _context.Operations
                                    .OrderBy(x => x.Date)
                                    .AsQueryable();

            //sort data and return data tuples
            var thisMonth = collectOperations("thisMonth", allOperations, users);
            var oneMonth = collectOperations("oneMonth", allOperations, users);
            var sixMonths = collectOperations("sixMonths", allOperations, users);

            //create and return instance which contains sorted and filtered data
            CompleteStatsViewModel completeStats = new CompleteStatsViewModel(thisMonth.Item1, thisMonth.Item2,
                                                            oneMonth.Item1, oneMonth.Item2,
                                                            sixMonths.Item1, sixMonths.Item2,
                                                            oneMonth.Item3, sixMonths.Item3);

            return completeStats;
        }

        static (List<CollectedOperationDataViewModel>, TotalsViewModel, List<OpportunitiesByUserViewModel>) collectOperations(string period, IQueryable<Operation> allOperations, List<User> users)
        {
            var rangeStart = new DateTime();
            var rangeEnd = new DateTime();
            int rangeMonths = 0;
            double rangeDays = 0.0;
            double[] intervalDays = new double[7];
            int[] intervalMonths = new int[7];

            for (int i = 0; i < 7; i++)
            {
                intervalDays[i] = 0.0;
                intervalMonths[i] = 0;
            }

            if (period == "thisMonth")
            {
                //this month from day one
                rangeDays = -(DateTime.Now - new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1)).Days - 1;

                int p = rangeDays < 15 ? 3 : 2;
                for (int i = -1; i < p; i++)
                {
                    intervalDays[i + 1] = -rangeDays * (((double)i + 1) / 4);
                    intervalDays[p + 1] = -rangeDays;
                }

                //set initial dates
                rangeStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
                rangeEnd = rangeStart;

                var sortedOperations = sortOperations(allOperations, rangeStart, rangeEnd, rangeDays, intervalDays,
                                            intervalMonths);

                return collectSortedData(sortedOperations.Item1, sortedOperations.Item2, sortedOperations.Item3, users);
            }
            else if (period == "oneMonth")
            {
                //last 30 days
                rangeDays = -30.0;
                for (int i = 0; i < 4; i++)
                {
                    intervalDays[i] = -rangeDays * (((double)i) / 4);
                }


                //set initial dates, rangeDays+1 correction to make it last 30 days, including today
                rangeStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(rangeDays + 1);
                rangeEnd = rangeStart;

                var sortedOperations = sortOperations(allOperations, rangeStart, rangeEnd, rangeDays, intervalDays,
                                            intervalMonths);

                return collectSortedData(sortedOperations.Item1, sortedOperations.Item2, sortedOperations.Item3, users);
            }
            else
            {
                //6 past months from day one
                rangeMonths = -6;
                for (int i = 0; i < 7; i++)
                {
                    intervalMonths[i] = i;
                }

                //set initial dates
                rangeStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(rangeMonths);
                rangeEnd = rangeStart;

                var sortedOperations = sortOperations(allOperations, rangeStart, rangeEnd, rangeDays, intervalDays,
                                            intervalMonths);

                return collectSortedData(sortedOperations.Item1, sortedOperations.Item2, sortedOperations.Item3, users);
            }
        }

        private static (List<List<Operation>>, DateTime[], DateTime[]) sortOperations(IQueryable<Operation> queriedOperations, DateTime dateStart, DateTime dateEnd, double rangeDays,
                                        double[] intervalDays, int[] intervalMonths)
        {
            List<List<Operation>> sortedOperations = new List<List<Operation>>();

            //determine number of periods
            int p = rangeDays != 0 ? 4 : 6;
            DateTime[] startDates = new DateTime[p];
            DateTime[] endDates = new DateTime[p];

            for (int i = 0; i < p; i++)
            {
                var sortedData = queriedOperations.Where(x =>
                             x.Date >= dateStart.AddMonths(intervalMonths[i]).AddDays((int)intervalDays[i])
                            && x.Date <= dateEnd.AddMonths(intervalMonths[i + 1]).AddDays((int)intervalDays[i + 1])).ToList();
                startDates.SetValue(dateStart.AddMonths(intervalMonths[i]).AddDays((int)intervalDays[i]), i);
                endDates.SetValue(dateEnd.AddMonths(intervalMonths[i + 1]).AddDays((int)intervalDays[i + 1]), i);

                //correcting last day (whis is today) for last 30 days period
                if (rangeDays == -30 && i == p - 1)
                {
                    endDates[i] = new DateTime(DateTime.Now.Year, DateTime.Now.Month, DateTime.Now.Day).AddDays(1).AddTicks(-1);
                    sortedData = queriedOperations.Where(x =>
                             x.Date >= dateStart.AddMonths(intervalMonths[i]).AddDays((int)intervalDays[i])
                            && x.Date <= endDates[i]).ToList();
                }

                sortedOperations.Add(sortedData);
            }

            return (sortedOperations, startDates, endDates);
        }

        //count total revenue
        private static double countRevenue(List<Operation> operations)
        {
            double revenue = 0;
            foreach (Operation operation in operations)
            {
                revenue += operation.Revenue;
            }

            return revenue;
        }

        //count amount of the particular lead source and create instance of Sources
        private static SourcesViewModel countSources(List<Operation> operations)
        {
            int web = operations.Count(x => x.Source == "Web");
            int socialMedia = operations.Count(x => x.Source == "Social Media");
            int flyers = operations.Count(x => x.Source == "Flyers");
            int commercial = operations.Count(x => x.Source == "Commercial");
            int formerClient = operations.Count(x => x.Source == "Former Client");

            return new SourcesViewModel(web, socialMedia, flyers, commercial, formerClient);
        }

        private static (List<CollectedOperationDataViewModel>, TotalsViewModel, List<OpportunitiesByUserViewModel>) collectSortedData(List<List<Operation>> list, DateTime[] startDate, DateTime[] endDate, List<User> users)
        {

            TotalsViewModel totals = new TotalsViewModel(0, 0, 0, 0, 0, 0, 0, new SourcesViewModel(0, 0, 0, 0, 0));
            List<CollectedOperationDataViewModel> collectedOperationsByDateRange = new List<CollectedOperationDataViewModel>();
            CollectedOperationDataViewModel data;
            List<OpportunitiesByUserViewModel> usersStats = new List<OpportunitiesByUserViewModel>();
            users.Remove(users.Find(x => x.UserName == "Admin"));

            foreach (var u in users)
            {
                var user = new OpportunitiesByUserViewModel(u.DisplayName, 0, 0);
                usersStats.Add(user);
            }

            for (int i = 0; i < list.Count; i++)
            {
                data = new CollectedOperationDataViewModel
                (
                    startDate[i],
                    endDate[i],
                    list[i].Count(x => x.Lead == true),
                    list[i].Count(x => x.Opportunity == true),
                    list[i].Count(x => x.Quote == true),
                    list[i].Count(x => x.Invoice == true),
                    list[i].Count(x => x.Conversion == true),
                    list[i].Count(x => x.Order == true),
                    countRevenue(list[i]),
                    countSources(list[i])
                );
                collectedOperationsByDateRange.Add(data);

                totals.LeadsTotal += list[i].Count(x => x.Lead == true);
                totals.OpportunitiesTotal += list[i].Count(x => x.Opportunity == true);
                totals.QuotesTotal += list[i].Count(x => x.Quote == true);
                totals.InvoicesTotal += list[i].Count(x => x.Invoice == true);
                totals.ConversionsTotal += list[i].Count(x => x.Conversion == true);
                totals.OrdersTotal += list[i].Count(x => x.Order == true);
                list[i].ForEach(x => totals.RevenueTotal += x.Revenue);
                totals.SourcesTotal.Web += list[i].Count(x => x.Source == "Web");
                totals.SourcesTotal.Flyers += list[i].Count(x => x.Source == "Flyers");
                totals.SourcesTotal.Commercial += list[i].Count(x => x.Source == "Commercial");
                totals.SourcesTotal.SocialMedia += list[i].Count(x => x.Source.Equals("Social Media"));
                totals.SourcesTotal.FormerClient += list[i].Count(x => x.Source.Equals("Former Client"));

                foreach (var u in usersStats)
                {
                    u.LeadsTotal += list[i].Count(x => x.Lead == true && x.UserOperation.User.DisplayName.Equals(u.UserDisplayName) == true);
                    u.OpportunitiesTotal += list[i].Count(x => x.Opportunity == true && x.UserOperation.User.DisplayName.Equals(u.UserDisplayName) == true);
                }
            }

            return (collectedOperationsByDateRange, totals, usersStats);
        }
    }
}
