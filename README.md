# Race Track Management System

A real-time race track management system with multiple interfaces for different roles including Front Desk, Race Control, Lap-line Tracker, Leader Board, Next Race, Race Countdown, and Race Flags.

## Live Demo

[Live Demo](https://racetrack.joodkohvi.ee)

## Table of Contents
- [Features](#features)
- [Installation](#installation-guide-for-ubuntu-2204-or-wsl)
  - [Database Setup](#database-setup)
  - [Application Setup](#application-setup)
- [Access](#access)
- [Troubleshooting](#troubleshooting)

## Features

- **Front Desk Interface** (`/front-desk`)
  - Add and manage race sessions
  - Add/edit/remove drivers
  - Assign drivers to cars
  - View upcoming races

- **Race Control Interface** (`/race-control`)
  - Control race status (Start/End)
  - Manage race flags (Safe/Hazard/Danger/Finish)

- **Lap-line Tracker** (`/lap-line-tracker`)
  - Record lap times for each car

- **Leader Board** (`/leader-board`)
  - Real-time race standings
  - Displays fastest lap times & fastest driver of race
  - Shows current lap number

- **Additional Displays**
  - Next Race (`/next-race`): Shows upcoming race information
  - Race Countdown (`/race-countdown`): Displays race timer
  - Race Flags (`/race-flags`): Shows current race flag

## Installation guide for Ubuntu 22.04 (or WSL)

### Prerequisites

- Node.js (works on v22.9.0)
- PostgreSQL (works on 14.13)
- npm (works on 10.9.0)

### Database Setup

1. Installing PostgreSQL
    ```bash
    sudo apt update
    sudo apt install postgresql postgresql-contrib
    ```

2. Create database and user
    ```bash
    # Connect as postgres user
    sudo -u postgres psql

    # Create a new user (replace 'youruser' and 'yourpassword' with desired credentials)
    CREATE USER youruser WITH PASSWORD 'yourpassword';

    # Create database
    CREATE DATABASE racetrack;

    # Grant privileges to the user
    GRANT ALL PRIVILEGES ON DATABASE racetrack TO youruser;

    # Connect to the racetrack database
    \c racetrack

    # Grant schema privileges to the user
    GRANT ALL ON SCHEMA public TO youruser;

    # Grant privileges on future tables (required for schema import)
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO youruser;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO youruser;

    # Exit psql
    \q
    ```

3. Import database schema
    ```bash
    # Import the schema (replace 'youruser' with the username you created)
    # Download the schema file from the repository
    psql -U youruser -d racetrack -f racetrackSchema.sql

    # If the above command fails, try the following:
    # Method 1: Using TCP/IP connection
    PGPASSWORD=yourpassword psql -h localhost -U youruser -d racetrack -f racetrackSchema.sql

    # Method 2: If Method 1 doesnt work, try using sudo
    sudo -u youruser psql -d racetrack -f racetrackSchema.sql

    # Method 3: If Method 1 and 2 dont work, try editing the PostgreSQL config:
    sudo nano /etc/postgresql/14/main/pg_hba.conf

    # Method 3: Modify the following line:
    local   all             all                                     peer
    # To this:
    local   all             all                                     md5

    # Method 3: Save the file and restart PostgreSQL:
    sudo systemctl restart postgresql

    # Method 3: Retry the command:
    psql -U youruser -d racetrack -f racetrackSchema.sql

    # If prompted for password, enter the password you set earlier
    ```

### Application Setup

1. Clone the repository
    ```bash
    git clone https://gitea.kood.tech/andreasholst/racetrack.git
    cd racetrack
    ```

2. Install dependencies
    ```bash
    npm install
    ```

3. Create environment file
    ```bash
    cp .env.example .env
    ```

4. Configure environment variables in `.env`:
    ```bash
    nano .env
    ```

    ```
    JWT_SECRET="YOUR_SECRET"

    PORT=3000

    DB_USER=YOUR_USERNAME
    DB_DATABASE=racetrack
    DB_PASSWORD=YOUR_PASSWORD
    DB_PORT=5432
    DB_HOST=localhost

    receptionist_key=YOUR_RECEPTIONIST_KEY
    observer_key=YOUR_OBSERVER_KEY
    safety_key=YOUR_SAFETY_KEY
    ```

5. Start the application
    ```bash
    # Production mode (1-minute timer)
    npm start

    # Development mode (10-minute timer)
    npm run dev

    # Development mode without logging (10-minute timer)
    npm run dev:nolog
    
    # Development mode with ESLint (10-minute timer)
    npm run dev:eslint
    ```

## Access

> **Note**: Employee interfaces require authentication with corresponding access keys.

Once running, access the interfaces at:

### Employee Interfaces

- Front Desk: [http://localhost:3000/front-desk](http://localhost:3000/front-desk)
- Race Control: [http://localhost:3000/race-control](http://localhost:3000/race-control)
- Lap-line Tracker: [http://localhost:3000/lap-line-tracker](http://localhost:3000/lap-line-tracker)

### Guest Interfaces

- Leader Board: [http://localhost:3000/leader-board](http://localhost:3000/leader-board)
- Next Race: [http://localhost:3000/next-race](http://localhost:3000/next-race)
- Race Countdown: [http://localhost:3000/race-countdown](http://localhost:3000/race-countdown)
- Race Flags: [http://localhost:3000/race-flags](http://localhost:3000/race-flags)

## Troubleshooting
### Common Issues
1. **Database Connection Failed**
   - Verify PostgreSQL is running: `sudo service postgresql status`
   - Check database credentials in `.env`
   - Ensure database port is not blocked

2. **Access Key Issues**
   - Verify all required keys are set in `.env`
   - Keys must be non-empty strings
   - Restart server after changing keys

3. **Port Already in Use**
   - Check if another instance is running: `lsof -i :3000`
   - Kill existing process or change port in `.env`