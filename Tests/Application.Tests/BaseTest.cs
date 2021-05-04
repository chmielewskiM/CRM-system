using API;
using Application.Interfaces;
using Application.Users.ViewModels;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using Xunit.Sdk;

namespace Application.Tests
{
    public class BaseTest
    {
        public Mock<IMediator> Mediator { get; }
        public DataContext Context { get; }
        public Mock<IUserAccessor> UserAccessor { get; }
        public Mock<IOperationsRepository> OperationsRepository { get; }

        public BaseTest()
        {
            Mediator = new Mock<IMediator>();
            Context = DbContextFactory.Create();
            UserAccessor = new Mock<IUserAccessor>();
            OperationsRepository = new Mock<IOperationsRepository>();
        }
    }
}
