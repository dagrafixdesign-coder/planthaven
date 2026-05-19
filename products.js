const products = [
    {
        id: 1,
        name: 'Fiddle Leaf Fig',
        scientificName: 'Ficus Lyrata',
        price: 125.00,
        image: 'assets/fiddle-leaf.png',
        category: 'Indoor Trees',
        type: 'Indoor',
        sales: 45,
        stock: 12,
        description: 'The Fiddle Leaf Fig is a popular indoor tree with large, violin-shaped leaves. It thrives in bright, indirect light and adds a bold statement to any room.',
        care: {
            light: 'Bright indirect sunlight. Avoid direct rays which can burn leaves.',
            water: 'Water when top 2 inches of soil feel dry. Typically once a week.',
            humidity: 'High humidity preferred. Mist leaves or use a pebble tray.',
            temp: '65°F - 75°F. Keep away from drafts.'
        },
        origin: 'Native to Western Africa'
    },
    {
        id: 2,
        name: 'Monstera Deliciosa',
        scientificName: 'Swiss Cheese Plant',
        price: 78.00,
        image: 'assets/monstera.png',
        category: 'Vines',
        type: 'Indoor',
        sales: 112,
        stock: 5,
        description: 'Known for its iconic split leaves, the Monstera Deliciosa is a hardy climber that brings a tropical feel to your home.',
        care: {
            light: 'Medium to bright indirect light. Can adapt to lower light.',
            water: 'Water every 1-2 weeks, allowing soil to dry out half way.',
            humidity: 'Normal room humidity is fine, but loves higher levels.',
            temp: '65°F - 85°F. Tropical temperatures are best.'
        },
        origin: 'Native to Central & South America'
    },
    {
        id: 3,
        name: 'Snake Plant',
        scientificName: 'Sansevieria Trifasciata',
        price: 45.00,
        image: 'assets/snake-plant.png',
        category: 'Succulents',
        type: 'Indoor',
        sales: 230,
        stock: 50,
        description: 'One of the most resilient indoor plants, the Snake Plant is excellent at purifying air and can tolerate low light levels.',
        care: {
            light: 'Thrives in any light, from low to bright direct.',
            water: 'Water only when soil is completely dry (every 3-4 weeks).',
            humidity: 'Average dry air is perfectly fine.',
            temp: '60°F - 85°F. Very tolerant of temperature swings.'
        },
        origin: 'Native to Tropical West Africa'
    },
    {
        id: 4,
        name: 'Calathea Orbifolia',
        scientificName: 'Round-Leaf Calathea',
        price: 52.00,
        image: 'assets/calathea.png',
        category: 'Prayer Plants',
        type: 'Indoor',
        sales: 88,
        stock: 8,
        description: 'The Calathea Orbifolia features stunning wide, silver-green striped leaves. It is a showstopper that loves humidity.',
        care: {
            light: 'Medium indirect light. Too much sun fades the leaf patterns.',
            water: 'Keep soil consistently moist but not soggy.',
            humidity: 'High humidity is crucial. Use a humidifier if possible.',
            temp: '65°F - 75°F. Sensitive to cold air.'
        },
        origin: 'Native to Bolivia'
    },
    {
        id: 5,
        name: 'Pothos',
        scientificName: 'Epipremnum aureum',
        price: 35.00,
        image: 'assets/pothos.png',
        category: 'Vines',
        type: 'Indoor',
        sales: 340,
        stock: 40,
        description: 'Pothos is one of the easiest houseplants to grow. Its heart-shaped leaves trail beautifully from baskets or shelves.',
        care: {
            light: 'Low to bright indirect light. Variegated types need more light.',
            water: 'Water when the top 1-2 inches of soil are dry.',
            humidity: 'Average room humidity. Very adaptable.',
            temp: '60°F - 80°F.'
        },
        origin: 'Native to French Polynesia'
    },
    {
        id: 6,
        name: 'ZZ Plant',
        scientificName: 'Zamioculcas zamiifolia',
        price: 48.00,
        image: 'assets/zz-plant.png',
        category: 'Succulents',
        type: 'Indoor',
        sales: 156,
        stock: 20,
        description: 'The ZZ Plant is practically indestructible. It has waxy, deep green leaves and can survive in very low light.',
        care: {
            light: 'Low to bright indirect light. Avoid direct sun.',
            water: 'Water only when soil is completely dry. Drought-tolerant.',
            humidity: 'Low to average humidity.',
            temp: '65°F - 75°F.'
        },
        origin: 'Native to Eastern Africa'
    },
    {
        id: 7,
        name: 'Spider Plant',
        scientificName: 'Chlorophytum comosum',
        price: 28.00,
        image: 'assets/spider-plant.png',
        category: 'Foliage',
        type: 'Indoor',
        sales: 210,
        stock: 25,
        description: 'Famous for its "babies" that hang from the parent plant, the Spider Plant is a classic air purifier.',
        care: {
            light: 'Bright indirect light is best, but tolerates lower light.',
            water: 'Keep soil slightly moist, but not soggy. Water when top inch is dry.',
            humidity: 'Average room humidity. Appreciates occasional misting.',
            temp: '55°F - 80°F.'
        },
        origin: 'Native to Southern Africa'
    },
    {
        id: 8,
        name: 'Peace Lily',
        scientificName: 'Spathiphyllum',
        price: 42.00,
        image: 'assets/peace-lily.png',
        category: 'Flowering',
        type: 'Indoor',
        sales: 175,
        stock: 15,
        description: 'The Peace Lily is known for its elegant white spathes and its ability to signal when it needs water by drooping.',
        care: {
            light: 'Low to medium indirect light. Direct sun will scorch leaves.',
            water: 'Water when leaves start to droop or top inch is dry.',
            humidity: 'High humidity. Mist leaves or use a pebble tray.',
            temp: '65°F - 80°F. Sensitive to cold drafts.'
        },
        origin: 'Native to Tropical Americas'
    },
    {
        id: 9,
        name: 'Chinese Evergreen',
        scientificName: 'Aglaonema',
        price: 55.00,
        image: 'assets/chinese-evergreen.png',
        category: 'Foliage',
        type: 'Indoor',
        sales: 92,
        stock: 10,
        description: 'Chinese Evergreens are incredibly versatile and come in many beautiful patterns. They are very slow-growing.',
        care: {
            light: 'Low to bright indirect light. Darker varieties need less light.',
            water: 'Water when the top 1-2 inches of soil are dry.',
            humidity: 'Average room humidity.',
            temp: '65°F - 75°F.'
        },
        origin: 'Native to Southeast Asia'
    },
    {
        id: 10,
        name: 'Rubber Plant',
        scientificName: 'Ficus elastica',
        price: 65.00,
        image: 'assets/rubber-plant.png',
        category: 'Indoor Trees',
        type: 'Indoor',
        sales: 130,
        stock: 12,
        description: 'With its large, shiny burgundy or green leaves, the Rubber Plant makes a striking statement in any space.',
        care: {
            light: 'Bright indirect light. Can tolerate some morning sun.',
            water: 'Water when the top 1-2 inches of soil are dry.',
            humidity: 'Average to high humidity.',
            temp: '60°F - 80°F.'
        },
        origin: 'Native to Southeast Asia'
    },
    {
        id: 11,
        name: 'Aloe Vera',
        scientificName: 'Aloe barbadensis miller',
        price: 24.00,
        image: 'assets/aloe-vera.png',
        category: 'Succulents',
        type: 'Indoor',
        sales: 290,
        stock: 45,
        description: 'Aloe Vera is both beautiful and functional. Its gel is famous for soothing burns and skin irritations.',
        care: {
            light: 'Bright direct or indirect light.',
            water: 'Water deeply but infrequently. Let soil dry completely.',
            humidity: 'Low humidity. Prefers dry air.',
            temp: '55°F - 80°F.'
        },
        origin: 'Native to the Arabian Peninsula'
    },
    {
        id: 12,
        name: 'Philodendron',
        scientificName: 'Philodendron hederaceum',
        price: 32.00,
        image: 'assets/philodendron.png',
        category: 'Vines',
        type: 'Indoor',
        sales: 180,
        stock: 30,
        description: 'The Heartleaf Philodendron is a fast-growing climber with lovely deep green leaves.',
        care: {
            light: 'Low to bright indirect light. Prefers medium light.',
            water: 'Water when the top 1-2 inches of soil are dry.',
            humidity: 'Average to high humidity.',
            temp: '65°F - 80°F.'
        },
        origin: 'Native to Central America & Caribbean'
    },
    {
        id: 13,
        name: 'Parlor Palm',
        scientificName: 'Chamaedorea elegans',
        price: 38.00,
        image: 'assets/parlor-palm.png',
        category: 'Palms',
        type: 'Indoor',
        sales: 145,
        stock: 18,
        description: 'This elegant, airy palm has been a popular houseplant since the Victorian era.',
        care: {
            light: 'Low to medium indirect light.',
            water: 'Water when the top 1 inch of soil is dry.',
            humidity: 'Average room humidity.',
            temp: '65°F - 80°F.'
        },
        origin: 'Native to Mexico & Guatemala'
    },
    {
        id: 14,
        name: 'Cast Iron Plant',
        scientificName: 'Aspidistra elatior',
        price: 45.00,
        image: 'assets/cast-iron-plant.png',
        category: 'Foliage',
        type: 'Indoor',
        sales: 65,
        stock: 15,
        description: 'The Cast Iron Plant earned its name by being able to survive in near-total neglect and low light.',
        care: {
            light: 'Low to medium indirect light. Avoid direct sun.',
            water: 'Water when the top 1-2 inches of soil are dry.',
            humidity: 'Average room humidity.',
            temp: '50°F - 85°F.'
        },
        origin: 'Native to Japan & Taiwan'
    },
    {
        id: 15,
        name: 'Chinese Money Plant',
        scientificName: 'Pilea peperomioides',
        price: 34.00,
        image: 'assets/chinese-money-plant.png',
        category: 'Foliage',
        type: 'Indoor',
        sales: 110,
        stock: 22,
        description: 'Also known as the Pancake Plant, this quirky specimen is famous for its round, flat leaves on long stems.',
        care: {
            light: 'Bright indirect light. Rotate frequently for even growth.',
            water: 'Water when the top 1 inch of soil is dry.',
            humidity: 'Average room humidity.',
            temp: '60°F - 75°F.'
        },
        origin: 'Native to Southern China'
    },
    {
        id: 16,
        name: 'English Ivy',
        scientificName: 'Hedera helix',
        price: 26.00,
        image: 'assets/english-ivy.png',
        category: 'Vines',
        type: 'Indoor',
        sales: 98,
        stock: 20,
        description: 'English Ivy is a classic climber that can be grown in hanging baskets or trained up a trellis.',
        care: {
            light: 'Medium to bright indirect light.',
            water: 'Keep soil consistently moist but not soggy.',
            humidity: 'Average to high humidity. Loves cool air.',
            temp: '50°F - 70°F.'
        },
        origin: 'Native to Europe & Western Asia'
    },
    {
        id: 19,
        name: 'Star Jasmine',
        scientificName: 'Trachelospermum jasminoides',
        price: 85.00,
        image: 'assets/jasmine.png',
        category: 'Flowering',
        type: 'Outdoor',
        sales: 55,
        stock: 12,
        description: 'Star Jasmine is a fast-growing evergreen climber with highly fragrant, star-shaped white flowers.',
        care: {
            light: 'Full sun to partial shade.',
            water: 'Regular watering, especially during blooming season.',
            humidity: 'Moderate humidity.',
            temp: 'Hardy down to 10°F.'
        },
        origin: 'Native to East Asia'
    },
    {
        id: 17,
        name: 'English Lavender',
        scientificName: 'Lavandula angustifolia',
        price: 45.00,
        image: 'https://images.unsplash.com/photo-1591017403286-fd8ba1303056?auto=format&fit=crop&q=80&w=800',
        category: 'Herbs',
        type: 'Outdoor',
        sales: 120,
        stock: 25,
        description: 'English Lavender is prized for its fragrant purple blooms and silvery-green foliage. Perfect for sunny gardens.',
        care: {
            light: 'Full sun (6+ hours per day).',
            water: 'Water when soil is dry. Drought-tolerant once established.',
            humidity: 'Prefers low humidity and good air circulation.',
            temp: 'Hardy in most climates.'
        },
        origin: 'Native to the Mediterranean'
    },
    {
        id: 18,
        name: 'Silver Birch',
        scientificName: 'Betula pendula',
        price: 245.00,
        image: 'https://images.unsplash.com/photo-1518132508075-036bb3bf5e83?auto=format&fit=crop&q=80&w=800',
        category: 'Trees',
        type: 'Outdoor',
        sales: 15,
        stock: 5,
        description: 'An elegant tree with distinctive white bark and delicate, drooping branches. A striking addition to larger gardens.',
        care: {
            light: 'Full sun to partial shade.',
            water: 'Requires consistent moisture, especially in hot weather.',
            humidity: 'Moderate humidity.',
            temp: 'Hardy in temperate climates.'
        },
        origin: 'Native to Europe and parts of Asia'
    },
    {
        id: 20,
        name: 'Japanese Maple',
        scientificName: 'Acer palmatum',
        price: 185.00,
        image: 'https://images.unsplash.com/photo-1579169411993-e408ec976f7f?auto=format&fit=crop&q=80&w=800',
        category: 'Trees',
        type: 'Outdoor',
        sales: 28,
        stock: 8,
        description: 'A stunning ornamental tree known for its delicate, feathery leaves that turn brilliant shades of red and orange in autumn.',
        care: {
            light: 'Partial shade. Avoid scorching afternoon sun.',
            water: 'Regular watering to keep soil moist but well-drained.',
            humidity: 'Moderate humidity.',
            temp: 'Hardy in temperate zones.'
        },
        origin: 'Native to Japan and Korea'
    },
    {
        id: 21,
        name: 'Blue Hydrangea',
        scientificName: 'Hydrangea macrophylla',
        price: 68.00,
        image: 'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&q=80&w=800',
        category: 'Flowering',
        type: 'Outdoor',
        sales: 42,
        stock: 15,
        description: 'Large, lush clusters of vibrant blue blooms that bring a classic, romantic feel to any garden or patio.',
        care: {
            light: 'Morning sun and afternoon shade.',
            water: 'Needs plenty of water; do not let the soil dry out.',
            humidity: 'High humidity preferred.',
            temp: 'Thrives in mild temperatures.'
        },
        origin: 'Native to Japan'
    },
    {
        id: 22,
        name: 'Bougainvillea',
        scientificName: 'Bougainvillea spectabilis',
        price: 52.00,
        image: 'https://images.unsplash.com/photo-1596706912389-9e8c4547900b?auto=format&fit=crop&q=80&w=800',
        category: 'Vines',
        type: 'Outdoor',
        sales: 64,
        stock: 20,
        description: 'A vigorous, sun-loving climber that produces spectacular masses of vibrant pink and purple papery bracts.',
        care: {
            light: 'Full, intense sun (6+ hours).',
            water: 'Drought-tolerant once established. Water when soil is dry.',
            humidity: 'Tolerates low to moderate humidity.',
            temp: 'Loves heat; protect from frost.'
        },
        origin: 'Native to South America'
    },
    {
        id: 23,
        name: 'Century Plant',
        scientificName: 'Agave americana',
        price: 95.00,
        image: 'https://images.unsplash.com/photo-1613919109184-0fce574421ff?auto=format&fit=crop&q=80&w=800',
        category: 'Succulents',
        type: 'Outdoor',
        sales: 18,
        stock: 10,
        description: 'A dramatic, architectural succulent with giant, blue-green leaves that form a striking structural rosette.',
        care: {
            light: 'Full, direct sun.',
            water: 'Very low water needs. Excellent for xeriscaping.',
            humidity: 'Low humidity / Arid conditions.',
            temp: 'Extremely heat tolerant and hardy.'
        },
        origin: 'Native to Mexico and Texas'
    },
    {
        id: 24,
        name: 'Luxury Gold Mist Spray',
        scientificName: 'Botanical Mister',
        price: 45.00,
        image: 'assets/spray-gold.png',
        category: 'Accessories',
        type: 'Accessory',
        sales: 15,
        stock: 20,
        description: 'A premium champagne gold and midnight teal glass mister. Designed for the perfect fine mist to keep your tropical plants hydrated in style.',
        care: {
            light: 'Keep out of direct sunlight to preserve finish.',
            water: 'Fill with distilled water for best results.',
            humidity: 'Wipe clean with a soft cloth.',
            temp: 'Room temperature storage.'
        },
        origin: 'Curated Accessory'
    },
    {
        id: 25,
        name: 'Botanical Growth Serum',
        scientificName: 'Organic Medicine',
        price: 32.00,
        image: 'assets/medicine.png',
        category: 'Accessories',
        type: 'Accessory',
        sales: 85,
        stock: 50,
        description: 'A concentrated organic serum designed to boost leaf vitality and promote healthy root systems. The ultimate medicine for your botanical collection.',
        care: {
            light: 'Store in a cool, dark place.',
            water: 'Dilute 5 drops per liter of water.',
            humidity: 'Keep cap tightly sealed.',
            temp: 'Stable at room temperature.'
        },
        origin: 'Botanical Lab'
    },
    {
        id: 26,
        name: 'Botanical Vitality Spray',
        scientificName: 'Health Spray',
        price: 28.00,
        image: 'assets/spray-vitality.png',
        category: 'Accessories',
        type: 'Accessory',
        sales: 42,
        stock: 30,
        description: 'A ready-to-use health spray that provides essential micronutrients directly to the foliage for an instant glow and pest resistance.',
        care: {
            light: 'Indirect light during storage.',
            water: 'Spray once every two weeks.',
            humidity: 'No specific requirements.',
            temp: 'Keep from freezing.'
        },
        origin: 'Botanical Lab'
    },
    {
        id: 27,
        name: 'The Signature Gift Box',
        scientificName: 'Gift Collection',
        price: 150.00,
        image: 'assets/gift-box.png',
        category: 'Gifts',
        type: 'Gift',
        sales: 12,
        stock: 5,
        description: 'A curated luxury gift box featuring a hand-selected plant, premium wrapping, and a personalized botanical card. The perfect "Gift a Plant" experience.',
        care: {
            light: 'Depends on the plant inside.',
            water: 'Instruction card included.',
            humidity: 'Gift-wrapped for immediate presentation.',
            temp: 'Best delivered at room temperature.'
        },
        origin: 'Bespoke Collection'
    },
    {
        id: 28,
        name: 'Midnight Teal Ceramic Pot',
        scientificName: 'Artisan Decor',
        price: 85.00,
        image: 'assets/teal-pot.png',
        category: 'Gifts',
        type: 'Gift',
        sales: 24,
        stock: 10,
        description: 'A handcrafted ceramic pot with gold leaf detailing. Designed to elevate any plant into a piece of living art.',
        care: {
            light: 'Color-safe glaze.',
            water: 'Waterproof interior.',
            humidity: 'Easy to clean.',
            temp: 'Kiln-fired durability.'
        },
        origin: 'Artisan Workshop'
    }
];
