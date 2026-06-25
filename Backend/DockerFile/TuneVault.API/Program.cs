using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.SignalR;
using TuneVault.Application.PipelineBehaviors;
using TuneVault.Application.Interfaces;
using TuneVault.Application.UseCases.Auth;
using TuneVault.Application.Validators;
using TuneVault.Domain.Interfaces;
using TuneVault.Infrastructure.Auth;
using TuneVault.Infrastructure.Dapper;
using TuneVault.Infrastructure.FileStorage;
using TuneVault.Infrastructure.Repositories;
using TuneVault.Infrastructure.Services;
using TuneVault.Infrastructure.SignalR;


var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────
builder.Services.AddSingleton<DataContextDapper>();

// ── Repositories ──────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();
// Register other repositories required by application handlers
builder.Services.AddScoped<IMediaItemRepository, MediaItemRepository>();
builder.Services.AddScoped<IAlbumRepository, AlbumRepository>();
builder.Services.AddScoped<IArtistRepository, ArtistRepository>();
builder.Services.AddScoped<IPlaylistRepository, PlaylistRepository>();
builder.Services.AddScoped<IInteractionRepository, InteractionRepository>();
builder.Services.AddScoped<IShareRepository, ShareRepository>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();



// ── JWT Service ───────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IFileStorageService, LocalFileStorageService>();

// ── MediatR ───────────────────────────────────────────
builder.Services.AddMediatR(cfg =>
    cfg.RegisterServicesFromAssembly(
        typeof(RegisterHandler).Assembly));

// ── Pipeline Behavior (Validation tự động) ────────────
builder.Services.AddTransient(
    typeof(IPipelineBehavior<,>),
    typeof(ValidationBehavior<,>));

// ── FluentValidation ──────────────────────────────────
builder.Services.AddValidatorsFromAssembly(
    typeof(RegisterValidator).Assembly);

// ── JWT Authentication ────────────────────────────────
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };

        opt.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;

                if (!string.IsNullOrEmpty(accessToken) &&
                    path.StartsWithSegments("/notificationHub"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            }
        };
    });

// ── CORS cho React Frontend ───────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // cần cho SignalR sau này
    });
});

// ── File Upload ───────────────────────────────────────
builder.Services.Configure<Microsoft.AspNetCore.Http.Features.FormOptions>(opt =>
{
    opt.MultipartBodyLengthLimit = 500 * 1024 * 1024; // 500MB
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// ── SignalR and Services───────────────────────────────
builder.Services.AddSignalR();
builder.Services.AddScoped<INotificationPushService, SignalRNotificationService>();

// ── AI Service (Gemini)───────────────────────────────
builder.Services.AddScoped<IAIService,GeminiService>();  
builder.Services.AddHttpClient<IAIService,GeminiService>();  

var app = builder.Build();
// ── Middleware Pipeline ───────────────────────────────
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReact");    // ← phải trước Authentication
app.UseStaticFiles();         // ← serve file mp3/mp4
app.UseAuthentication();      // ← phải trước Authorization
app.UseAuthorization();
app.MapControllers();
app.MapHub<NotificationHub>("/notificationHub");

app.Run();

