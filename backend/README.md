# JobAppTracker

A simple ASP.NET Core Web API for tracking job applications, built with .NET 10 and Entity Framework Core.

## Projects

- `JobAppTracker.API` - ASP.NET Core Web API project (entry point)
- `JobAppTracker.Infrastructure` - EF Core DbContext, entity models and data access

## Prerequisites

- .NET 10 SDK
- EF Core tools: `dotnet tool install --global dotnet-ef` (if not already installed)
- A database server (e.g. SQL Server, PostgreSQL, or SQLite). Connection string is configured via `appsettings.json` or user secrets.
- Optional: Docker (if you want to run in a container)

## Configuration

1. Add your connection string.

- Using `appsettings.Development.json` or `appsettings.json` (not recommended for production), or
- Using User Secrets for local development (recommended):

```powershell
# from the solution root or the API project folder
dotnet user-secrets init --project JobAppTracker.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=(localdb)\\mssqllocaldb;Database=JobAppTrackerDb;Trusted_Connection=True;MultipleActiveResultSets=true" --project JobAppTracker.API
```

Your `JobAppTracker.API` project already contains a `UserSecretsId` and is ready to accept secrets.

## Database migrations

If migrations are kept in the infrastructure project, run EF Core CLI commands pointing to the infrastructure project and the API as startup project.

Create a migration:

```powershell
# from solution root
dotnet ef migrations add InitialCreate --project JobAppTracker.Infrastructure --startup-project JobAppTracker.API
```

Apply migrations to the database:

```powershell
dotnet ef database update --project JobAppTracker.Infrastructure --startup-project JobAppTracker.API
```

If your migrations are in the API project, adjust `--project` accordingly.

## Running the API

- From Visual Studio: set `JobAppTracker.API` as the startup project and run (F5).
- From command line:

```powershell
cd JobAppTracker.API
dotnet run
```

The API will start and (by default) listen on the configured Kestrel endpoints. Use the Swagger UI (if enabled) to explore endpoints, typically at `https://localhost:{port}/swagger`.

## Docker

If you wish to containerize the app, add a `Dockerfile` and a `docker-compose` configuration. Example steps:

```powershell
# build
docker build -t jobapptracker:latest -f JobAppTracker.API/Dockerfile .
# run
docker run -e ConnectionStrings__DefaultConnection="<conn-string>" -p 5000:80 jobapptracker:latest
```

Adjust environment variable names to match your configuration provider.

## Tests

If this repository contains tests, run them with:

```powershell
dotnet test
```

## Contributing

- Fork the repository and open a pull request with clear description of changes.
- Follow established coding conventions used in the project.

## Troubleshooting

- EF CLI cannot find the startup project: make sure you run commands from the solution root or specify `--startup-project` and `--project` correctly.
- Connection/permission issues: verify connection string and database server is reachable.

## License

This repository does not include a license file. Add a `LICENSE` file if you intend to make the project open source.