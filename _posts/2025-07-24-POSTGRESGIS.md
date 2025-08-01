---
title: Unlocking In-Store Analytics with PostGIS and PostgreSQL! 
date: 2025-07-24 01:01:0 01:01:01 +/-TTTT
categories: [postgres, gis]
tags: [postgres, gis]
---

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-Q2P5CM1K51"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-Q2P5CM1K51');
</script>

<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>


<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>


### Unlocking In-Store Analytics with PostGIS and PostgreSQL 📊

In the digital age, understanding customer behavior online is commonplace. But what about the physical world? This post explores how we can use the powerful PostGIS extension for PostgreSQL to analyze customer movements and product interactions within a physical space, like a retail store.

Using geometric data types and functions, we can turn raw location data (from sources like Wi-Fi pings or Bluetooth beacons) into actionable business intelligence. We'll simulate a simple retail store environment, track customer paths, and answer crucial questions about traffic flow, dwell time, and product visibility.

### 🚀 Getting Started: Setting up PostGIS

First, we need a PostgreSQL database with the PostGIS extension installed. The easiest way to get started is with a Docker container.

```
docker run --rm -it --name postgres_gis \
  -e POSTGRESQL_PASSWORD=postgres \
  -e POSTGRESQL_DATABASE=postgres \
  -p 5434:5432 \
  bitnami/postgresql:latest
```

Once the container is running, connect to the database and enable the PostGIS extensions:

```
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```


### 🗺️ Defining Our Store's Geometry

Our analysis starts by defining the store's physical layout. We'll create a store_zones table to store the boundaries of different departments (e.g., Produce, Bakery, Electronics). We use a GEOMETRY(POLYGON, 4326) column to represent these areas. The 4326 is the SRID (Spatial Reference System Identifier), which in our case represents a simple coordinate grid, but in a real-world scenario, it would be a standard like WGS 84 (used by GPS).

```
CREATE TABLE store_zones (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    boundary GEOMETRY(POLYGON, 4326) NOT NULL
);
```

-- Insert example zones using ST_GeomFromText to create polygons

````
INSERT INTO store_zones (name, description, boundary) VALUES
('Entrance', 'Main entrance and greeting area', ST_GeomFromText('POLYGON((0 0, 20 0, 20 20, 0 20, 0 0))', 4326)),
('Produce', 'Fresh fruits and vegetables', ST_GeomFromText('POLYGON((0 20, 30 20, 30 50, 0 50, 0 20))', 4326)),
('Dairy', 'Milk, cheese, and yogurt products', ST_GeomFromText('POLYGON((30 20, 60 20, 60 50, 30 50, 30 20))', 4326));
```
-- ... and so on for other zones

Next, we define the locations of key products on the sales floor. We'll use a GEOMETRY(POINT, 4326) column for this, which represents a single point in space.

```
CREATE TABLE product_locations (
    id SERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT,
    location GEOMETRY(POINT, 4326) NOT NULL
);
```

-- Insert example product locations

```
INSERT INTO product_locations (product_name, category, location) VALUES
('Apples', 'Produce', ST_GeomFromText('POINT(15 35)', 4326)),
('Milk (Whole)', 'Dairy', ST_GeomFromText('POINT(45 30)', 4326)),
('Artisan Bread', 'Bakery', ST_GeomFromText('POINT(75 40)', 4326));
```

-- ... more products
🚶 Tracking User Movements
To understand customer behavior, we need to capture their movements. We'll use two tables for this: user_visits for individual location pings and user_paths to aggregate these pings into a continuous line.

The user_visits table stores a timestamped point for each location ping.

```
CREATE TABLE user_visits (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    visit_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    location GEOMETRY(POINT, 4326) NOT NULL
);
```

-- Simulate a user moving through the store

```
INSERT INTO user_visits (user_id, location) VALUES
('user_101', ST_GeomFromText('POINT(10 10)', 4326)), -- Entrance
('user_101', ST_GeomFromText('POINT(10 25)', 4326)), -- Produce
('user_101', ST_GeomFromText('POINT(15 30)', 4326)); -- Produce
```

The user_paths table aggregates these points into a LINESTRING, representing a user's full journey. In a real application, you'd use a function like ST_MakeLine to automatically create these paths from the user_visits data.

```
CREATE TABLE user_paths (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    path_start_time TIMESTAMP WITH TIME ZONE,
    path_end_time TIMESTAMP WITH TIME ZONE,
    path GEOMETRY(LINESTRING, 4326) NOT NULL
);
```


-- Manually creating a user's path for demonstration

```
INSERT INTO user_paths (user_id, path_start_time, path_end_time, path) VALUES
('user_101', '2025-06-27 08:00:00+00', '2025-06-27 08:05:00+00',
    ST_GeomFromText('LINESTRING(10 10, 10 25, 15 30, 35 30, 40 40, 65 45, 85 15, 90 10)', 4326));
```

### 🔍 Answering Business Questions with PostGIS

Now for the fun part! With our data structured, we can use PostGIS functions to perform powerful spatial analysis.

1. Traffic and Dwell Time Analysis
We can count how many individual user pings fall within each zone (ST_Contains), giving us a proxy for dwell time.

```
SELECT sz.name AS zone_name, COUNT(uv.id) AS total_visits_in_zone
FROM store_zones sz JOIN user_visits uv ON ST_Contains(sz.boundary, uv.location)
GROUP BY sz.name;
```

We can also identify which zones users simply pass through by checking if their path intersects with a zone boundary (ST_Intersects).

```
SELECT sz.name AS zone_name, COUNT(DISTINCT up.user_id) AS unique_users_passing_through
FROM store_zones sz JOIN user_paths up ON ST_Intersects(sz.boundary, up.path)
GROUP BY sz.name;
```

2. Understanding Customer Flow

By joining user_visits with store_zones and ordering by time, we can reconstruct the exact path a user took through the store's departments.

```
SELECT uv.user_id, sz.name AS zone_visited, uv.visit_time
FROM user_visits uv JOIN store_zones sz ON ST_Contains(sz.boundary, uv.location)
WHERE uv.user_id = 'user_101'
ORDER BY uv.visit_time;
```

3. Product-Path Interaction

Did a user pass by a product? We can use ST_DWithin to find products that are within a certain distance of a user's path. This is a powerful way to identify products that are getting visibility but might not be converting to a "dwell event."

```
SELECT up.user_id, pl.product_name, pl.category
FROM user_paths up, product_locations pl
WHERE ST_DWithin(up.path, pl.location, 5); -- Within 5 units of the path
```

4. Basket Analysis (Physical World Edition)

We can even find product pairings! By identifying products that are "close" to each other on a user's path, we can infer which items might be viewed together. This is the physical-world equivalent of a "frequently bought together" recommendation.

```
SELECT p1.product_name AS product1, p2.product_name AS product2, COUNT(DISTINCT up.user_id) AS users_viewed_both
FROM user_paths up
JOIN product_locations p1 ON ST_DWithin(up.path, p1.location, 5)
JOIN product_locations p2 ON ST_DWithin(up.path, p2.location, 5)
WHERE p1.id != p2.id
GROUP BY p1.product_name, p2.product_name
ORDER BY users_viewed_both DESC
LIMIT 10;
```

### 💡 Conclusion

This post only scratches the surface of what's possible with PostGIS. By treating our physical environment as a geographic space, we can leverage powerful spatial functions to gain insights that were previously unavailable. The same principles can be applied to logistics, urban planning, and environmental analysis. This simple example demonstrates how a robust, open-source database like PostgreSQL, combined with the power of PostGIS, can be a game-changer for businesses looking to understand and optimize their physical operations.
