using API.Middleware;
using Application.Interfaces;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;
using Application;
using System;
using Microsoft.OpenApi.Models;
using Application.Orders;
using Application.Contacts;
using Application.Leads;
using Application.DelegatedTasks;
using Application.AppUser;
using System.Collections.Generic;
using System.Reflection;
using System.IO;

namespace API
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _env = env;
            Configuration = configuration;
        }

        public IConfiguration Configuration
        {
            get;
        }

        // This method gets called by the runtime. Use this method to add services to
        // the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseLazyLoadingProxies();
                if (_env.IsProduction())
                    opt.UseSqlServer(Configuration.GetConnectionString("RemoteConnection"));
                else opt.UseSqlServer(Configuration.GetConnectionString("LocalConnection"));
            });

            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithOrigins("http://localhost:3000", "http://localhost:5000");
                    // .AllowCredentials();
                });
            });
            services.AddMediatR(typeof(Application.Contacts.ListContacts.Handler).Assembly, typeof(Application.DelegatedTasks.ListTasks.Handler).Assembly, typeof(Application.Orders.ListOrders.Handler).Assembly, typeof(Application.Leads.ListLeads.Handler).Assembly);
            services.AddAutoMapper(typeof(Application.Contacts.ListContacts.Handler), typeof(Application.DelegatedTasks.ListTasks.Handler), typeof(Application.Orders.ListOrders.Handler), typeof(Application.Leads.ListLeads.Handler));
            services.AddMvc(opt =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                opt
                    .Filters
                    .Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<AddContact>();
                cfg.RegisterValidatorsFromAssemblyContaining<AddLead>();
                cfg.RegisterValidatorsFromAssemblyContaining<AddTask>();
                cfg.RegisterValidatorsFromAssemblyContaining<AddOrder>();
                cfg.RegisterValidatorsFromAssemblyContaining<RegisterUser>();
                cfg.LocalizationEnabled = false;
            });

            services
                .AddControllers()
                .AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.TryAddSingleton<ISystemClock, SystemClock>();

            services.AddSwaggerGen(cfg =>
                {
                    cfg.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
                    cfg.CustomSchemaIds(x => x.FullName);
                    cfg.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    {
                        Description = "JWT Authorization header using the bearer scheme",
                        Name = "Authorization",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.ApiKey
                    });
                    cfg.AddSecurityRequirement(new OpenApiSecurityRequirement
                    {
                        {new OpenApiSecurityScheme{Reference = new OpenApiReference
                        {
                            Id = "Bearer",
                            Type = ReferenceType.SecurityScheme
                        }}, new List<string>()}
                    });

                    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                    cfg.IncludeXmlComments(xmlPath);
                });

            var builder = services.AddIdentityCore<User>(
                opt =>
                {
                    opt.Password.RequireNonAlphanumeric = false;
                    opt.Password.RequiredUniqueChars = 0;
                    opt.Password.RequireDigit = false;
                    opt.Password.RequireUppercase = false;
                })
                .AddDefaultTokenProviders();

            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);

            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<User>>();

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Key"]));

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt =>
                {
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false
                    };
                });

            services.AddScoped<IJwtGenerator, JwtGenerator>();
            services.AddScoped<IUserAccessor, UserAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP
        // request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<ErrorHandlingMiddleware>();
            if (env.IsDevelopment())
            {
                // app.UseDeveloperExceptionPage();

            }

            app.UseRouting();
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseCors("CorsPolicy");
            app.UseAuthorization();
            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });
            app.UseEndpoints(endpoints =>
            {

                endpoints.MapControllerRoute(
                    name: "spa-homepage",
                    pattern: "{controller=Homepage}/{action=Index}"
                );
                endpoints.MapFallbackToController("Index", "Homepage");
            });
            // app.UseMvc();
        }
    }
}
