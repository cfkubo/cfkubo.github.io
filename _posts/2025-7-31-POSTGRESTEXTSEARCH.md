---
title: Supercharging Your Search with PostgreSQL Full-Text Search 🔍 
date: 2025-07-31 01:01:0 01:01:01 +/-TTTT
categories: [postgres, textsearch]
tags: [postgres, textsearch]
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



### Supercharging Your Search with PostgreSQL Full-Text Search 🔍

Building a fast and effective search feature is a core requirement for many applications, from e-commerce sites to content platforms. While LIKE queries are simple, they're slow and don't handle common language nuances like synonyms or word stemming (e.g., searching for "running" should also find "run").

This blog post will walk you through leveraging PostgreSQL's powerful Full-Text Search features to build a highly efficient and scalable search solution. We'll use a practical example of a product catalog.

The Power of Full-Text Search in PostgreSQL
PostgreSQL's full-text search is not just a simple string match. It's a sophisticated system that allows you to:

Tokenize Text: Break down a document (in our case, a product title) into individual words or "lexemes."

Normalize Words: Use dictionaries to reduce words to their base form (e.g., "running," "runs," and "ran" all become "run"). This is called stemming.

Rank Results: Order search results by relevance, so the most relevant items appear first.

Perform Fast Queries: Utilize specialized indexes, like GIN (Generalized Inverted Index), to make search queries incredibly fast, even on large datasets.

### 🛠️ Step-by-Step Implementation

We'll use a sample product catalog table and add the necessary components for full-text search.

1. The Products Table
First, let's set up our product table. We'll add a new column, title_tsv, of type tsvector. This column will store the preprocessed text data for our search index.

```
CREATE TABLE IF NOT EXISTS public.products_search
(
    prod_id serial NOT NULL,
    category integer NOT NULL,
    title character varying(255) COLLATE pg_catalog."default" NOT NULL,
    actor character varying(255) COLLATE pg_catalog."default" NOT NULL,
    price numeric(38,2) NOT NULL,
    special smallint,
    common_prod_id integer NOT NULL,
    title_tsv tsvector  -- This is our new column for the search index
);
```


1. Automating the tsvector with a Trigger
   
Manually updating the title_tsv column for every new or updated product would be a hassle. PostgreSQL's triggers are the perfect solution.

First, we create a function that takes the title and converts it into a tsvector using the to_tsvector function with the english dictionary.

```
CREATE OR REPLACE FUNCTION public.products_title_tsvector_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- The `to_tsvector` function processes the title text
    NEW.title_tsv := to_tsvector('pg_catalog.english', NEW.title);
    RETURN NEW;
END;
```

Next, we create the trigger that automatically calls this function before every INSERT or UPDATE on our products_search table. This ensures the title_tsv column is always up-to-date.

```
CREATE OR REPLACE TRIGGER tsvector_update_title
    BEFORE INSERT OR UPDATE
    ON public.products_search
    FOR EACH ROW
    EXECUTE FUNCTION public.products_title_tsvector_trigger();
```

1. Creating the GIN Index
   
To make our search queries lightning-fast, we need an index on the title_tsv column. A GIN (Generalized Inverted Index) is the most suitable type for tsvector columns, as it is highly optimized for full-text search operations.

```
CREATE INDEX IF NOT EXISTS products_title_tsv_idx
    ON public.products_search USING gin
    (title_tsv);
```

With this index in place, PostgreSQL can efficiently find documents that contain specific lexemes without scanning the entire table.

### 🧪 Populating and Querying the Data

To test our setup, we'll insert a large amount of sample data using generate_series. This will create 100,000 product entries with random titles, prices, and categories. The trigger we created will automatically populate the title_tsv column for each row.


-- This INSERT statement will generate and insert 100,000 rows

```
INSERT INTO public.products_search (
    prod_id,
    category,
    title,
    actor,
    price,
    special,
    common_prod_id
)
SELECT
    -- Dynamically calculate a unique ID for each row.
    -- COALESCE handles the case where the table might be empty (MAX(prod_id) would be NULL).
    -- gs.i provides a sequential number for each generated row.
    COALESCE((SELECT MAX(prod_id) FROM public.products_search), 0) + gs.i,

    -- category: Random integer between 1 and 10
    FLOOR(RANDOM() * 10 + 1)::INTEGER,

    -- title: Combines a prefix, an adjective, and a specific product noun
    CASE FLOOR(RANDOM() * 7) -- More prefixes for variety
        WHEN 0 THEN 'Premium '
        WHEN 1 THEN 'High-Quality '
        WHEN 2 THEN 'Eco-Friendly '
        WHEN 3 THEN 'Designer '
        WHEN 4 THEN 'Comfortable '
        WHEN 5 THEN 'Durable '
        ELSE 'Stylish '
    END ||
    CASE FLOOR(RANDOM() * 10) -- More adjectives
        WHEN 0 THEN 'Cotton '
        WHEN 1 THEN 'Soft '
        WHEN 2 THEN 'Natural '
        WHEN 3 THEN 'Organic '
        WHEN 4 THEN 'Smart '
        WHEN 5 THEN 'Handcrafted '
        WHEN 6 THEN 'Luxurious '
        WHEN 7 THEN 'Compact '
        WHEN 8 THEN 'Wireless '
        ELSE 'Vintage '
    END ||
    (ARRAY[

        -- Clothing & Apparel (Expanded)
        'T-Shirt', 'Jeans', 'Dress Shirt', 'Sweater', 'Hoodie', 'Polo Shirt', 'Blouse', 'Skirt', 'Dress',
        'Leggings', 'Shorts', 'Pants', 'Jacket', 'Coat', 'Vest', 'Socks', 'Underwear', 'Pajamas',
        'Scarf', 'Hat', 'Beanie', 'Gloves', 'Swimsuit', 'Workout Top', 'Running Shorts', 'Yoga Pants',


        -- Footwear
		'Sneakers', 'Running Shoes', 'Walking Shoes', 'Boots', 'Dress Shoes', 'Sandals', 'Slippers',
		'Flats', 'Heels', 'Athletic Cleats', 'Hiking Boots',


        -- Accessories (Personal)
		'Backpack', 'Handbag', 'Crossbody Bag', 'Wallet', 'Belt', 'Sunglasses', 'Reading Glasses',
		'Watch', 'Necklace', 'Bracelet', 'Earrings', 'Ring', 'Hair Clip', 'Hair Tie', 'Scarf',
		'Umbrella', 'Keychain', 'Travel Pillow',


        -- Home Goods & Decor (Expanded)
		'Coffee Maker', 'Toaster', 'Blender', 'Mixer', 'Food Processor', 'Air Fryer', 'Rice Cooker',
		'Electric Kettle', 'Vacuum Cleaner', 'Robot Vacuum', 'Mop', 'Broom', 'Dustpan', 'Cleaning Wipes',
		'Dish Soap', 'Laundry Detergent', 'Fabric Softener', 'Trash Bags', 'Paper Towels', 'Toilet Paper',
		'Pillow', 'Blanket', 'Duvet Cover Set', 'Sheet Set', 'Towel Set', 'Bath Mat', 'Shower Curtain',
		'Candle', 'Diffuser', 'Vase', 'Picture Frame', 'Mirror', 'Wall Art', 'Decorative Tray',
		'Mug Set', 'Plate Set', 'Bowl Set', 'Cutlery Set', 'Wine Glasses', 'Water Glasses',
		'Frying Pan', 'Saucepan', 'Stock Pot', 'Baking Sheet', 'Mixing Bowl', 'Cutting Board',
		'Storage Container Set', 'Food Storage Bags', 'Comforter', 'Area Rug', 'Curtains', 'Blinds',
		'Desk Lamp', 'Floor Lamp', 'Table Lamp', 'Bookshelf', 'Desk Chair', 'Dining Table', 'Coffee Table',
		'Side Table', 'Sofa', 'Armchair', 'Pouf', 'Ottoman', 'Clock', 'Alarm Clock', 'Smart Speaker',
		'Smart Light Bulb', 'Thermostat', 'Door Mat', 'Welcome Mat', 'Plant Pot', 'Artificial Plant',


        -- Kitchen & Dining (Specific)
		'Espresso Machine', 'French Press', 'Tea Kettle', 'Waffle Maker', 'Toaster Oven', 'Slow Cooker',
		'Pressure Cooker', 'Measuring Cups', 'Measuring Spoons', 'Kitchen Scale', 'Oven Mitts',
		'Apron', 'Spice Rack', 'Salt and Pepper Shakers', 'Corkscrew', 'Can Opener', 'Bottle Opener',
		'Grater', 'Peeler', 'Whisk', 'Spatula', 'Ladle', 'Serving Spoon',


        -- Electronics & Gadgets
		'Smartphone', 'Tablet', 'Laptop', 'Smartwatch', 'Headphones', 'Earbuds', 'Bluetooth Speaker',
		'Portable Charger', 'USB Drive', 'External Hard Drive', 'Webcam', 'Microphone', 'Router',
		'Smart TV', 'Streaming Device', 'Gaming Console', 'Drone', 'Digital Camera', 'Action Camera',
		'E-Reader', 'GPS Device', 'Fitness Tracker', 'Smart Plug', 'Video Doorbell', 'Security Camera',


        -- Office & School Supplies
		'Notebook', 'Journal', 'Planner', 'Pen Set', 'Pencil Set', 'Highlighters', 'Markers',
		'Stapler', 'Staples', 'Paper Clips', 'Binder Clips', 'Sticky Notes', 'Printer Paper',
		'Envelopes', 'Folders', 'Binders', 'Calculator', 'Desk Organizer', 'Scissors', 'Tape Dispenser',
		'Whiteboard', 'Dry Erase Markers', 'Erasers', 'Pencil Sharpener', 'Correction Tape',


        -- Pet Supplies
		'Dog Food', 'Cat Food', 'Pet Treats', 'Dog Collar', 'Cat Collar', 'Dog Leash', 'Cat Harness',
		'Pet Bed', 'Dog Toy', 'Cat Toy', 'Litter Box', 'Cat Litter', 'Litter Scoop', 'Grooming Brush',
		'Pet Shampoo', 'Nail Clippers', 'Pet Carrier', 'Water Bowl', 'Food Bowl', 'Automatic Feeder',
		'Pet Fountain', 'Puppy Pads', 'Waste Bags', 'Flea & Tick Treatment',


        -- Sports & Outdoor
		'Yoga Mat', 'Dumbbell Set', 'Resistance Bands', 'Jump Rope', 'Water Bottle', 'Gym Bag',
		'Running Shoes', 'Hiking Boots', 'Camping Tent', 'Sleeping Bag', 'Backpacking Pack', 'Cooler',
		'Fishing Rod', 'Fishing Reel', 'Lure Set', 'Bicycle', 'Bicycle Helmet', 'Bike Lock',
		'Basketball', 'Football', 'Soccer Ball', 'Tennis Racket', 'Golf Clubs', 'Baseball Glove',
		'Ski Goggles', 'Snowboard', 'Skateboard', 'Roller Skates', 'Swim Goggles', 'Swim Cap',


        -- Baby & Kids Items
		'Baby Onesie', 'Baby Blanket', 'Diapers', 'Wipes', 'Baby Bottle Set', 'Pacifier', 'Teething Toy',
		'Stroller', 'Car Seat', 'High Chair', 'Crib Mattress', 'Baby Monitor', 'Baby Bath Tub',
		'Baby Carrier', 'Toy Blocks', 'Stuffed Animal', 'Kids Backpack', 'Lunchbox', 'Crayon Set',
		'Childrens Book', 'Puzzle', 'Board Game', 'Action Figure', 'Doll',


        -- Health & Personal Care
		'Toothbrush', 'Toothpaste', 'Mouthwash', 'Floss', 'Shampoo', 'Conditioner', 'Body Wash', 'Soap Bar',
		'Lotion', 'Sunscreen', 'Deodorant', 'Perfume', 'Cologne', 'Hair Dryer', 'Straightener',
		'Electric Razor', 'Shaving Cream', 'Band-Aids', 'First Aid Kit', 'Pain Reliever', 'Vitamins',
		'Hand Sanitizer', 'Facial Cleanser', 'Moisturizer', 'Serum', 'Makeup Kit', 'Nail Polish',


        -- Tools & Hardware
		'Hammer', 'Screwdriver Set', 'Pliers', 'Wrench Set', 'Tape Measure', 'Level', 'Drill',
		'Drill Bit Set', 'Utility Knife', 'Toolbox', 'Flashlight', 'Batteries', 'Extension Cord',
		'Power Strip', 'Work Gloves', 'Safety Goggles', 'Nail Assortment', 'Screw Assortment',

    	
        -- Clothing & Accessories
        'T-Shirt', 'Jeans', 'Dress Shirt', 'Sweater', 'Jacket', 'Socks', 'Scarf', 'Hat', 'Gloves',
        'Backpack', 'Handbag', 'Wallet', 'Belt', 'Sneakers', 'Boots', 'Sandals',

        -- Home Goods
        'Coffee Maker', 'Toaster', 'Blender', 'Vacuum Cleaner', 'Dish Soap', 'Laundry Detergent',
        'Pillow', 'Blanket', 'Sheet Set', 'Towel Set', 'Candle', 'Diffuser', 'Vase', 'Picture Frame',
        'Mug', 'Plate Set', 'Frying Pan', 'Mixing Bowl', 'Storage Container', 'Garden Hose', 'Shovel',
        'Desk Lamp', 'Bookshelf', 'Chair', 'Table', 'Rug', 'Curtains', 'Clock', 'Mirror', 'Plant Pot',

        -- Personal Care & Gifts
        'Soap Bar', 'Shampoo', 'Conditioner', 'Body Lotion', 'Perfume', 'Cologne', 'Lip Balm', 'Toothbrush Set',
        'Bath Bomb', 'Jewelry Box', 'Watch', 'Pen Set', 'Gift Card', 'Puzzle', 'Board Game',
        'Notebook', 'Sketchbook', 'Colored Pencils', 'Water Bottle', 'Travel Mug', 'Headphones',
        'Charger Cable', 'Phone Case', 'External Hard Drive', 'Webcam', 'Microphone',

	
        -- Clothing & Accessories
        'T-Shirt', 'Jeans', 'Dress Shirt', 'Sweater', 'Jacket', 'Socks', 'Scarf', 'Hat', 'Gloves',
        'Backpack', 'Handbag', 'Wallet', 'Belt', 'Sneakers', 'Boots', 'Sandals',

        -- Home Goods
        'Coffee Maker', 'Toaster', 'Blender', 'Vacuum Cleaner', 'Dish Soap', 'Laundry Detergent',
        'Pillow', 'Blanket', 'Sheet Set', 'Towel Set', 'Candle', 'Diffuser', 'Vase', 'Picture Frame',
        'Mug', 'Plate Set', 'Frying Pan', 'Mixing Bowl', 'Storage Container', 'Garden Hose', 'Shovel',
        'Desk Lamp', 'Bookshelf', 'Chair', 'Table', 'Rug', 'Curtains', 'Clock', 'Mirror', 'Plant Pot',

        -- Personal Care & Gifts
        'Soap Bar', 'Shampoo', 'Conditioner', 'Body Lotion', 'Perfume', 'Cologne', 'Lip Balm', 'Toothbrush Set',
        'Bath Bomb', 'Jewelry Box', 'Watch', 'Pen Set', 'Gift Card', 'Puzzle', 'Board Game',
        'Notebook', 'Sketchbook', 'Colored Pencils', 'Water Bottle', 'Travel Mug', 'Headphones',
        'Charger Cable', 'Phone Case', 'External Hard Drive', 'Webcam', 'Microphone',

        -- Plants & Outdoor
        'Fiddle Leaf Fig Plant', 'Snake Plant', 'Succulent Collection', 'Herb Garden Kit', 'Tomato Seeds',
        'Rose Bush', 'Garden Gnome', 'Bird Feeder', 'Outdoor Lantern', 'Camping Tent', 'Sleeping Bag',
        'Yoga Mat', 'Resistance Bands', 'Dumbbell Set'
    ])[FLOOR(RANDOM() * 480) + 1], -- Adjust the 80 based on the total number of items in your ARRAY

    -- actor: Generates a random "Actor Name"
    (ARRAY['Tom', 'Alice', 'Bob', 'Catherine', 'David', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy'])[FLOOR(RANDOM() * 10) + 1] || ' ' ||
    (ARRAY['Hanks', 'Smith', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor'])[FLOOR(RANDOM() * 10) + 1],

    -- price: Random numeric value between 10.00 and 1000.00, formatted to 2 decimal places
    ROUND((RANDOM() * 990 + 10)::NUMERIC, 2),

    -- special: Randomly assigns 0, 1, or NULL (approximately 20% NULL, 40% 0, 40% 1)
    CASE FLOOR(RANDOM() * 5)
        WHEN 0 THEN NULL
        WHEN 1 THEN 0
        WHEN 2 THEN 1
        WHEN 3 THEN 0
        ELSE 1
    END::SMALLINT,

    -- common_prod_id: Random integer between 1000 and 9999
    FLOOR(RANDOM() * 9000 + 1000)::INTEGER
FROM generate_series(1, 100000) as gs(i); -- Use generate_series to create 1000 rows
```


### Running a Search Query

To perform a full-text search, we use the @@ operator with to_tsquery. The to_tsquery function also uses the english dictionary to parse our search term.

For example, to find all products related to "plants," we simply run:

```
SELECT
    prod_id,
    category,
    title,
    actor,
    price
FROM
    public.products_search
WHERE
    title_tsv @@ to_tsquery('english', 'plant');
```

This query will find titles containing "plant," "plants," or any stemmed version of the word, and because of the GIN index, it will do so in a fraction of the time a traditional LIKE '%plant%' query would take.

### 📈 Why PostgreSQL is a Great Choice

This example highlights why PostgreSQL is often a top choice for developers. Instead of relying on a separate search service like ElasticSearch, we can leverage PostgreSQL's robust, built-in features to:

Reduce Complexity: No need to manage a separate service, synchronize data, or deal with different query languages.

Improve Performance: The GIN index provides excellent query speed, making it suitable for many use cases.

Ensure Data Consistency: The trigger-based approach guarantees that our search index (title_tsv) is always in sync with the source data (title).

Save Costs: It's a free, open-source solution that provides enterprise-grade functionality out of the box.

By using these features, you can build a highly performant and scalable search engine directly within your existing database, simplifying your architecture and development workflow.
