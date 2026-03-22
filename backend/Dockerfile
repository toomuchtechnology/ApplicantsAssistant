FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY backend/backend.csproj .
RUN dotnet restore

COPY . .

RUN dotnet build -c Release -o /app/build

RUN dotnet tool install --global dotnet-ef --version 9.0.0

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app

COPY --from=publish /app/publish .
COPY --from=build /root/.dotnet/tools /root/.dotnet/tools

ENV PATH="$PATH:/root/.dotnet/tools"

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/bin/sh", "/app/entrypoint.sh"]