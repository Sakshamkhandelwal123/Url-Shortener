# Url Shortener

## Installation

To install the dependencies for this project, run the following command:

```bash
$ npm install
```

## Running the application

To start the application run the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# test mode
$ npm run test
```

## Environment Variables

This application uses environment variables to configure various settings. These variables are stored in an `.env` file located in the root of the project.

Here's a brief description of each environment variable:

### Environment

```
APP_ENV= # The environment in which the application is running (e.g. development, main)
PORT= # Port where server is listening
```

### Database

```
DB_DIALECT= # The dialect of the database server
DB_HOST= # The hostname of the database server
DB_PORT= # The port number on which the database server is listening
DB_USERNAME= # The username of the database user
DB_PASSWORD= # The password of the database user
DB_NAME= # The name of the database
```

### JWT

```
JWT_SECRET= # The private key used to sign JWTs
```

### Redis

```
REDIS_HOST= # The hostname of redis server
REDIS_PORT= # The port number on which the redis server is listening
```

Make sure to replace the placeholder values with your own values before starting the application.

## Approach

### Analytics System

#### Overview:

The analytics system tracks various metrics related to URL clicks, including referral sources, time-based click analysis, and device types. It provides insights into user behavior and helps in making data-driven decisions.

#### Implementation:

1. Referral Sources:

   Functionality: Tracks the referral sources from which users access the shortened URLs.
   Implementation: The AnalyticsService retrieves the referral sources by querying the database for the referrer field associated with each click.

2. Time-based Click Analysis:

   Functionality: Analyzes the most active hours for URL clicks.
   Implementation: The AnalyticsService retrieves clicks grouped by hour using Sequelize's date functions and aggregates the count of clicks for each hour.

3. Device Types:

   Functionality: Tracks the types of devices used to access the shortened URLs.
   Implementation: Similar to referral sources, the AnalyticsService retrieves the device types from the deviceType field associated with each click.

#### API Access:

    The analytics data can be accessed via the API endpoints provided by the AnalyticsController. Clients can make HTTP requests to retrieve analytics data for specific short URLs.

### Scalability Solutions

#### Overview:

The system is designed to handle high volumes of requests with minimal latency. To achieve scalability, we utilize several strategies:

1. Scheduled Task for URL Deletion:

   Functionality: Deletes expired URLs from the database to prevent the database from growing indefinitely.
   Implementation: The ShortenService includes a scheduled task using Nest.js's @nestjs/schedule module. It runs daily to delete expired URLs, ensuring the database remains optimized.

2. Redis Caching for URL Retrieval:

   Functionality: Implements caching using Redis to enhance the performance of URL retrieval.
   Implementation: The ShortenService caches frequently accessed URLs in Redis. Before querying the database for a URL, it first checks if the URL is cached in Redis. If found, the cached URL is returned, reducing the database load and improving response times.

#### Benefits:

    Improved Performance: Redis caching reduces database load and improves response times by serving frequently accessed URLs from memory.
    Optimized Database: Scheduled deletion of expired URLs ensures the database remains optimized and prevents it from growing indefinitely.
    Scalability: The system can handle high volumes of requests efficiently, making it scalable for growing traffic.

#### Future Considerations:

    Horizontal Scaling: Implement load balancing and clustering to distribute traffic across multiple instances of the application for horizontal scalability.
    Advanced Analytics: Enhance analytics capabilities by implementing advanced metrics and visualization tools for deeper insights into user behavior.

By implementing these analytics and scalability solutions, the Nest.js application ensures efficient tracking of URL clicks and can handle growing traffic with minimal latency.
