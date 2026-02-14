# TravelSocialApp

TravelSocialApp is a social networking platform for travelers, built with ASP.NET Core. It allows users to share travel stories, explore destinations, and manage bookings.

## Features

- **User Authentication**: Secure sign-up and login using ASP.NET Core Identity.
- **Stories**: Share travel experiences with photos and descriptions.
- **Destinations**: Browse popular travel destinations.
- **Bookings**: Book trips to your favorite locations.
- **Responsive Design**: Mobile-friendly interface with a modern look.

## Technologies Used

- **Framework**: ASP.NET Core 10.0
- **Language**: C#
- **Database**: SQLite (Development) / SQL Server (Production ready)
- **Frontend**: Razor Pages, Bootstrap 5

## Getting Started

### Prerequisites

- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd TravelSocialApp
   ```
3. Restore dependencies:
   ```bash
   dotnet restore
   ```
4. Update the database:
   ```bash
   dotnet ef database update
   ```
5. Run the application:
   ```bash
   dotnet run
   ```

## Project Structure

- `Controllers`: Handles incoming HTTP requests.
- `Models`: Defines data structures and database schema.
- `Views`: Contains the UI pages (Razor Views).
- `Data`: Database context and migrations.
- `wwwroot`: Static files (CSS, JS, images).

## License

This project is licensed under the MIT License.
