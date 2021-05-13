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
using System;
using Microsoft.OpenApi.Models;
using System.Reflection;
using System.IO;
using Application.Operations.Repository;
using Application.Validators;

namespace API
{
    public class Startup
    {
        private readonly IWebHostEnvironment _env;
        public IConfiguration Configuration { get; }
        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            _env = env;
            Configuration = configuration;
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

            services.AddMediatR(typeof(Application.Contacts.QueryHandlers.ListContactsQueryHandler).Assembly,
                                typeof(Application.DelegatedTasks.QueryHandlers.ListTasksQueryHandler).Assembly,
                                typeof(Application.Orders.QueryHandlers.ListOrdersQueryHandler).Assembly,
                                typeof(Application.Leads.QueryHandlers.ListLeadsQueryHandler).Assembly);

            services.AddAutoMapper(typeof(Application.Contacts.QueryHandlers.ListContactsQueryHandler),
                                typeof(Application.DelegatedTasks.QueryHandlers.ListTasksQueryHandler),
                                typeof(Application.Orders.QueryHandlers.ListOrdersQueryHandler),
                                typeof(API.Controllers.LeadsController),
                                typeof(Application.Leads.QueryHandlers.ListLeadsQueryHandler));

            services.AddControllers(opt =>
            {
                var policy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                opt
                    .Filters
                    .Add(new AuthorizeFilter(policy));
            }).AddFluentValidation(cfg =>
            {
                cfg.RegisterValidatorsFromAssemblyContaining<UserValidator>();
                cfg.LocalizationEnabled = false;
            });

            services.AddTransient<IValidatorInterceptor, ValidatorInterceptor>();
  
            services
                .AddControllers()
                .AddNewtonsoftJson(opt => opt.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.TryAddSingleton<ISystemClock, SystemClock>();

            services.AddSwaggerGen(cfg =>
                {
                    cfg.SwaggerDoc("v2", new OpenApiInfo { Title = "CRM API", Version = "v2" });
                    cfg.CustomSchemaIds(x => x.FullName);
                    // cfg.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                    // {
                    //     Description = "JWT Authorization header using the bearer scheme",
                    //     Name = "Authorization",
                    //     In = ParameterLocation.Header,
                    //     Type = SecuritySchemeType.ApiKey
                    // });
                    // cfg.AddSecurityRequirement(new OpenApiSecurityRequirement
                    // {
                    //     {new OpenApiSecurityScheme{Reference = new OpenApiReference
                    //     {
                    //         Id = "Bearer",
                    //         Type = ReferenceType.SecurityScheme
                    //     }}, new List<string>()}
                    // });

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
            services.AddScoped<IOperationsRepository, OperationsRepository>();
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
            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v2/swagger.json", "CRM API");
            });
            app.UseAuthentication();
            app.UseCors("CorsPolicy");
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "spa-homepage",
                    pattern: "{controller=Homepage}/{action=Index}"
                );
                endpoints.MapFallbackToController("Index", "Homepage");
            });
        }
    }
}
