// using System;
// using Microsoft.Data.SqlClient;
// using TuneVault.Infrastructure.Repositories;
// using TuneVault.Infrastructure.Dapper;
// using TuneVault.Domain.Entities;
// using Dapper;
// using Microsoft.Extensions.Configuration;
// class Program
// {
//     static async Task Main()
//     {
//         var configuration = new ConfigurationBuilder()
//     .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
//     .Build();

// // 2. Tự khởi tạo bằng tay (Không cần Dependency Injection)
// var dbContext = new DataContextDapper(configuration);
// var userRepo = new UserRepository(dbContext);

// // 3. GỌI HÀM TEST LUÔN
// Console.WriteLine("=== ĐANG TEST HÀM ===");

// try
// {
//     // Giả sử test lấy thông tin tài khoản U1
//     var user = await userRepo.GetUserByIdAsync("U1");
    
//     if (user != null)
//     {
//         Console.WriteLine($"Thành công! Lấy được user: {user.UserName} - {user.Email}");
//     }
//     else
//     {
//         Console.WriteLine("Hàm chạy thành công nhưng không có dữ liệu (hoặc user đã bị xóa mềm).");
//     }
// }
// catch (Exception ex)
// {
//     Console.WriteLine($"Lỗi rồi: {ex.Message}");
// }
        
//     }
// }

using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using TuneVault.Application.PipelineBehaviors;
using TuneVault.Application.Interfaces;
using TuneVault.Application.UseCases.Auth;
using TuneVault.Application.Validators;
using TuneVault.Domain.Interfaces;
using TuneVault.Infrastructure.Auth;
using TuneVault.Infrastructure.Dapper;
using TuneVault.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// ── Database ──────────────────────────────────────────
builder.Services.AddSingleton<DataContextDapper>();

// ── Repositories ──────────────────────────────────────
builder.Services.AddScoped<IUserRepository, UserRepository>();

// ── JWT Service ───────────────────────────────────────
builder.Services.AddScoped<IJwtService, JwtService>();

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
            ValidateIssuer           = true,
            ValidateAudience         = true,
            ValidateLifetime         = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer    = builder.Configuration["Jwt:Issuer"],
            ValidAudience  = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
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

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Middleware Pipeline ───────────────────────────────
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowReact");    // ← phải trước Authentication
app.UseAuthentication();      // ← phải trước Authorization
app.UseAuthorization();
app.MapControllers();
app.Run();