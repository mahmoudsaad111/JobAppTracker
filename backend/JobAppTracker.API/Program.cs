using System.Text.Json.Serialization;
using JobAppTracker.API.Middlewares;
using JobAppTracker.Application;
using JobAppTracker.Domain.Entities;
using JobAppTracker.Infrastructure;
using JobAppTracker.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder
    .Services.AddInfrastructure(builder.Configuration)
    .AddApplication()
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); // ← teaches JSON serializer to convert enums to/from strings
    });
;
builder.Services.AddAuthorization();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var FrontendUrl = builder.Configuration.GetValue<string>("Frontend:BaseUrl");

// Configure CORS to allow requests from the Angular frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AngularPolicy",
        policy =>
        {
            policy.WithOrigins(FrontendUrl).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
        }
    );
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles(); // to serve uploaded files from wwwroot
app.UseRouting();
app.UseHttpsRedirection();
app.UseCors("AngularPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<ExceptionMiddleware>();
app.MapControllers();

app.Run();
