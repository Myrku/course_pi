using Astro.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.EntityFrameworkCore;
using Astro.Services.Interfaces;
using Astro.Services;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.AspNetCore.Http;
using Astro.Services.MailService;

namespace Astro
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public void ConfigureServices(IServiceCollection services)
        {
            string connection = Configuration.GetConnectionString("DefaultConnection");
            services.AddDbContext<AstroDBContext>(options => options.UseSqlServer(connection));
            services.AddControllersWithViews();
            var authoptions = Configuration.GetSection("Auth").Get<AuthOptions>();
            services.Configure<AuthOptions>(Configuration.GetSection("Auth"));
            services.Configure<BlobConfig>(Configuration.GetSection("BlobConfig"));
            services.Configure<MailSenderConfig>(Configuration.GetSection("MailSender"));

            services.AddTransient<IAuthService, AuthService>();
            services.AddTransient<IPostService, PostService>();
            services.AddTransient<IAdminService, AdminService>();
            services.AddTransient<IReportService, ReportService>();
            services.AddTransient<ICommentService, CommentService>();
            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IRatingService, RatingService>();
            services.AddTransient<IMailSender, MailSender>();

            services.TryAddTransient<IHttpContextAccessor, HttpContextAccessor>();


            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "ClientApp/dist";
            });
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = true; 
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = authoptions.Issuer,

                    ValidateAudience = true,
                    ValidAudience = authoptions.Audience,

                    ValidateLifetime = true,

                    IssuerSigningKey = authoptions.GetSymmetricSecurityKey(),
                    ValidateIssuerSigningKey = true,

                };
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            if (!env.IsDevelopment())
            {
                app.UseSpaStaticFiles();
            }

            app.UseRouting();
            app.UseCors();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                spa.Options.StartupTimeout = new System.TimeSpan(0, 5, 0);

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
