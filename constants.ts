import { ApiDefinition } from './types';

export const APIS: ApiDefinition[] = [
  {
    id: 'openweathermap',
    name: 'OpenWeatherMap',
    category: 'Weather',
    authRequired: true,
    authType: 'API Key',
    description: 'Access current weather data for any location including over 200,000 cities.',
    endpoint: 'https://api.openweathermap.org/data/2.5/weather?q=London',
    docsUrl: 'https://openweathermap.org/api',
    codeSnippet: `fetch('https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY')
  .then(response => response.json())
  .then(data => console.log(data));`,
    jsonExplanation: {
      'main.temp': 'Temperature in Kelvin (default)',
      'weather[0].description': 'Text description (e.g., cloudy)',
      'wind.speed': 'Wind speed in meter/sec'
    },
    securityChecklist: ['Never expose API key in frontend code.', 'Use environment variables.', 'Set budget limits in dashboard.'],
    exercise: 'Modify the request to get the weather for "Tokyo" and display the temperature in Celsius.',
    mockResponse: { main: { temp: 280.32, humidity: 81 }, weather: [{ main: 'Clouds', description: 'scattered clouds' }], name: 'London' },
    quiz: [
      { question: 'Which HTTP method is used to get data?', options: ['GET', 'POST', 'DELETE'], correctAnswer: 0 },
      { question: 'Where should you store your API Key?', options: ['In the HTML', 'Environment Variables', 'Public GitHub Repo'], correctAnswer: 1 }
    ]
  },
  {
    id: 'rest-countries',
    name: 'REST Countries',
    category: 'Geographic',
    authRequired: false,
    authType: 'None',
    description: 'Get information about countries via a RESTful API.',
    endpoint: 'https://restcountries.com/v3.1/name/brazil',
    docsUrl: 'https://restcountries.com/',
    codeSnippet: `fetch('https://restcountries.com/v3.1/name/brazil')
  .then(res => res.json())
  .then(data => console.log(data[0].capital));`,
    jsonExplanation: {
      'name.common': 'Common name of the country',
      'capital': 'Array of capital cities',
      'population': 'Total population count'
    },
    securityChecklist: ['Validate user input for country names.', 'Cache results to save bandwidth.'],
    exercise: 'Fetch data for "France" and display its flag URL.',
    mockResponse: [{ name: { common: 'Brazil' }, capital: ['Brasília'], region: 'Americas', population: 212559409 }],
    quiz: [
      { question: 'Does this API require an API Key?', options: ['Yes', 'No', 'Only for commercial use'], correctAnswer: 1 },
      { question: 'What is the data type of "capital"?', options: ['String', 'Number', 'Array'], correctAnswer: 2 }
    ]
  },
  {
    id: 'jsonplaceholder',
    name: 'JSONPlaceholder',
    category: 'Mock',
    authRequired: false,
    authType: 'None',
    description: 'Free fake API for testing and prototyping.',
    endpoint: 'https://jsonplaceholder.typicode.com/posts/1',
    docsUrl: 'https://jsonplaceholder.typicode.com/',
    codeSnippet: `fetch('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => response.json())
  .then(json => console.log(json));`,
    jsonExplanation: {
      'userId': 'ID of the user who posted',
      'title': 'The title of the post',
      'body': 'The main content text'
    },
    securityChecklist: ['Safe for testing, do not use for real auth.', 'No rate limits but be reasonable.'],
    exercise: 'Fetch post ID #5 and display its title.',
    mockResponse: { userId: 1, id: 1, title: 'sunt aut facere repellat', body: 'quia et suscipit suscipit recusandae' },
    quiz: [
      { question: 'What is this API primarily used for?', options: ['Production Data', 'Testing & Prototyping', 'Weather'], correctAnswer: 1 },
      { question: 'Can you send POST requests to it?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'cat-facts',
    name: 'Cat Facts',
    category: 'Curiosity',
    authRequired: false,
    authType: 'None',
    description: 'Daily cat facts. Simple and fun.',
    endpoint: 'https://catfact.ninja/fact',
    docsUrl: 'https://catfact.ninja/',
    codeSnippet: `fetch('https://catfact.ninja/fact')
  .then(res => res.json())
  .then(data => console.log(data.fact));`,
    jsonExplanation: { 'fact': 'The string containing the fact', 'length': 'Length of the string' },
    securityChecklist: ['None required. Public API.'],
    exercise: 'Create a button that fetches a new fact when clicked.',
    mockResponse: { fact: "Cats can jump up to 6 times their height.", length: 42 },
    quiz: [
      { question: 'What is the format of the response?', options: ['XML', 'JSON', 'HTML'], correctAnswer: 1 },
      { question: 'Is authentication needed?', options: ['Yes', 'No'], correctAnswer: 1 }
    ]
  },
  {
    id: 'dog-ceo',
    name: 'Dog CEO',
    category: 'Animals',
    authRequired: false,
    authType: 'None',
    description: 'Internet\'s biggest collection of open source dog pictures.',
    endpoint: 'https://dog.ceo/api/breeds/image/random',
    docsUrl: 'https://dog.ceo/dog-api/',
    codeSnippet: `fetch('https://dog.ceo/api/breeds/image/random')
  .then(res => res.json())
  .then(data => console.log(data.message));`,
    jsonExplanation: { 'message': 'URL of the image', 'status': 'Response status (success)' },
    securityChecklist: ['Verify image URLs before displaying if necessary.'],
    exercise: 'Fetch a random image of a specific breed (e.g., hound).',
    mockResponse: { message: "https://images.dog.ceo/breeds/retriever-golden/n02099601_100.jpg", status: "success" },
    quiz: [
      { question: 'What does the "message" field contain?', options: ['A text greeting', 'The image URL', 'The breed name'], correctAnswer: 1 },
      { question: 'Is this API free?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'spacex',
    name: 'SpaceX API',
    category: 'Space',
    authRequired: false,
    authType: 'None',
    description: 'Open Source REST API for SpaceX launch, rocket, core, capsule, starlink, and launchpad data.',
    endpoint: 'https://api.spacexdata.com/v4/launches/latest',
    docsUrl: 'https://github.com/r-spacex/SpaceX-API',
    codeSnippet: `fetch('https://api.spacexdata.com/v4/launches/latest')
  .then(res => res.json())
  .then(data => console.log(data.name));`,
    jsonExplanation: { 'name': 'Mission name', 'date_utc': 'Launch date', 'success': 'Boolean indicating success' },
    securityChecklist: ['High volume requests might be rate limited.'],
    exercise: 'Find out the name of the rocket used in the latest launch.',
    mockResponse: { name: "Starlink 4-1", date_utc: "2022-01-01T00:00:00.000Z", success: true },
    quiz: [
      { question: 'Does it support V4 of the API?', options: ['Yes', 'No'], correctAnswer: 0 },
      { question: 'Who maintains this API?', options: ['NASA', 'Open Source Community', 'Amazon'], correctAnswer: 1 }
    ]
  },
  {
    id: 'coingecko',
    name: 'CoinGecko',
    category: 'Finance',
    authRequired: false,
    authType: 'None',
    description: 'Cryptocurrency prices and market data.',
    endpoint: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
    docsUrl: 'https://www.coingecko.com/en/api',
    codeSnippet: `fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
  .then(res => res.json())
  .then(data => console.log(data.bitcoin.usd));`,
    jsonExplanation: { 'bitcoin.usd': 'Current price of Bitcoin in USD' },
    securityChecklist: ['Cache data to avoid rate limits (approx 10-30 req/min free).'],
    exercise: 'Fetch the price of Ethereum (ethereum) in EUR.',
    mockResponse: { bitcoin: { usd: 64230.50 } },
    quiz: [
      { question: 'What is the rate limit for the free tier?', options: ['Unlimited', '10-30 req/min', '1 req/day'], correctAnswer: 1 },
      { question: 'What parameter sets the currency?', options: ['vs_currencies', 'money', 'cash'], correctAnswer: 0 }
    ]
  },
  {
    id: 'agify',
    name: 'Agify.io',
    category: 'Data',
    authRequired: false,
    authType: 'None',
    description: 'Predicts the age of a person based on their name.',
    endpoint: 'https://api.agify.io?name=michael',
    docsUrl: 'https://agify.io/',
    codeSnippet: `fetch('https://api.agify.io?name=michael')
  .then(res => res.json())
  .then(data => console.log(data.age));`,
    jsonExplanation: { 'name': 'Input name', 'age': 'Predicted age', 'count': 'Sample size' },
    securityChecklist: ['Validate input name length.'],
    exercise: 'Create a form where users type a name and see their predicted age.',
    mockResponse: { name: "michael", age: 52, count: 231902 },
    quiz: [
      { question: 'What does "count" represent?', options: ['The age', 'The number of people with that name analyzed', 'Error code'], correctAnswer: 1 },
      { question: 'Can you batch names?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'bored-api',
    name: 'Bored API',
    category: 'Entertainment',
    authRequired: false,
    authType: 'None',
    description: 'Let\'s you find things to do when you\'re bored.',
    endpoint: 'https://www.boredapi.com/api/activity',
    docsUrl: 'https://www.boredapi.com/',
    codeSnippet: `fetch('https://www.boredapi.com/api/activity')
  .then(res => res.json())
  .then(data => console.log(data.activity));`,
    jsonExplanation: { 'activity': 'Suggested activity', 'type': 'Category (e.g. recreational)', 'participants': 'Number of people needed' },
    securityChecklist: ['No specific security concerns.'],
    exercise: 'Filter activities by type="education".',
    mockResponse: { activity: "Learn how to fold a paper crane", type: "education", participants: 1 },
    quiz: [
      { question: 'Can you filter by price?', options: ['Yes', 'No'], correctAnswer: 0 },
      { question: 'What is the default return format?', options: ['JSON', 'XML'], correctAnswer: 0 }
    ]
  },
  {
    id: 'news-api',
    name: 'News API',
    category: 'News',
    authRequired: true,
    authType: 'API Key',
    description: 'Locate articles and breaking news headlines from news sources and blogs across the web.',
    endpoint: 'https://newsapi.org/v2/top-headlines?country=us',
    docsUrl: 'https://newsapi.org/',
    codeSnippet: `fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=YOUR_KEY')
  .then(res => res.json())
  .then(data => console.log(data.articles));`,
    jsonExplanation: { 'articles': 'Array of article objects', 'title': 'Headline', 'url': 'Link to full story' },
    securityChecklist: ['Do NOT use on client-side in production (Proxy required).', 'Key is restricted to localhost for free tier.'],
    exercise: 'Fetch sports news from a specific category.',
    mockResponse: { status: "ok", totalResults: 34, articles: [{ title: "Major Event Happens", source: { name: "CNN" } }] },
    quiz: [
      { question: 'Can you use this directly in a production frontend?', options: ['Yes', 'No, use a proxy'], correctAnswer: 1 },
      { question: 'What tier is required for commercial use?', options: ['Developer', 'Business'], correctAnswer: 1 }
    ]
  },
   {
    id: 'pokeapi',
    name: 'PokéAPI',
    category: 'Games',
    authRequired: false,
    authType: 'None',
    description: 'All the Pokémon data you\'ll ever need in one place.',
    endpoint: 'https://pokeapi.co/api/v2/pokemon/ditto',
    docsUrl: 'https://pokeapi.co/',
    codeSnippet: `fetch('https://pokeapi.co/api/v2/pokemon/ditto')
  .then(res => res.json())
  .then(data => console.log(data.sprites.front_default));`,
    jsonExplanation: { 'name': 'Pokemon name', 'weight': 'Weight in hectograms', 'sprites': 'Object containing image URLs' },
    securityChecklist: ['Cache aggressively, data rarely changes.'],
    exercise: 'Display the "front_default" sprite for Pikachu.',
    mockResponse: { name: "ditto", weight: 40, sprites: { front_default: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png" } },
    quiz: [
      { question: 'Is this API rate limited?', options: ['Yes, reasonably', 'No, never'], correctAnswer: 0 },
      { question: 'Does it include audio cries?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'joke-api',
    name: 'JokeAPI',
    category: 'Entertainment',
    authRequired: false,
    authType: 'None',
    description: 'Uniform interface to fetch jokes from many sources.',
    endpoint: 'https://v2.jokeapi.dev/joke/Any',
    docsUrl: 'https://sv443.net/jokeapi/v2/',
    codeSnippet: `fetch('https://v2.jokeapi.dev/joke/Any')
  .then(res => res.json())
  .then(data => console.log(data.setup, data.delivery));`,
    jsonExplanation: { 'setup': 'The setup of the joke', 'delivery': 'The punchline', 'safe': 'Boolean if safe for work' },
    securityChecklist: ['Check the "safe" flag before displaying to general audiences.'],
    exercise: 'Fetch only "Programming" jokes.',
    mockResponse: { setup: "Why do Java programmers wear glasses?", delivery: "Because they don't C#", type: "twopart" },
    quiz: [
      { question: 'Can you filter out NSFW jokes?', options: ['Yes', 'No'], correctAnswer: 0 },
      { question: 'What are the two types of jokes?', options: ['single & twopart', 'funny & sad'], correctAnswer: 0 }
    ]
  },
  {
    id: 'randomuser',
    name: 'Random User',
    category: 'Mock',
    authRequired: false,
    authType: 'None',
    description: 'Like Lorem Ipsum, but for people.',
    endpoint: 'https://randomuser.me/api/',
    docsUrl: 'https://randomuser.me/',
    codeSnippet: `fetch('https://randomuser.me/api/')
  .then(res => res.json())
  .then(data => console.log(data.results[0].name));`,
    jsonExplanation: { 'results[0].name.first': 'First name', 'results[0].email': 'Fake email', 'results[0].picture.medium': 'Profile photo' },
    securityChecklist: ['Data is randomly generated, do not treat as real people.'],
    exercise: 'Generate 5 users in one request.',
    mockResponse: { results: [{ name: { first: "Brad", last: "Gibson" }, email: "brad.gibson@example.com" }] },
    quiz: [
      { question: 'Is the data real?', options: ['Yes', 'No'], correctAnswer: 1 },
      { question: 'Can you request a specific gender?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'ipify',
    name: 'ipify',
    category: 'Tools',
    authRequired: false,
    authType: 'None',
    description: 'A simple public IP address API.',
    endpoint: 'https://api.ipify.org?format=json',
    docsUrl: 'https://www.ipify.org/',
    codeSnippet: `fetch('https://api.ipify.org?format=json')
  .then(res => res.json())
  .then(data => console.log(data.ip));`,
    jsonExplanation: { 'ip': 'Your public IP address' },
    securityChecklist: ['Consider privacy implications when storing user IPs.'],
    exercise: 'Display the user\'s current IP address on load.',
    mockResponse: { ip: "192.168.1.1" },
    quiz: [
      { question: 'What is the default format?', options: ['Text', 'JSON'], correctAnswer: 0 },
      { question: 'Does it scale to millions of requests?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'nationalize',
    name: 'Nationalize.io',
    category: 'Data',
    authRequired: false,
    authType: 'None',
    description: 'Predict the nationality of a name.',
    endpoint: 'https://api.nationalize.io?name=nathaniel',
    docsUrl: 'https://nationalize.io/',
    codeSnippet: `fetch('https://api.nationalize.io?name=nathaniel')
  .then(res => res.json())
  .then(data => console.log(data.country));`,
    jsonExplanation: { 'country': 'Array of probable countries', 'country_id': 'ISO code', 'probability': '0 to 1 confidence' },
    securityChecklist: ['Handle empty results gracefully.'],
    exercise: 'Show the flag of the most probable country using the result.',
    mockResponse: { country: [{ country_id: "GH", probability: 0.224 }, { country_id: "US", probability: 0.11 }] },
    quiz: [
      { question: 'What does probability represent?', options: ['Certainty', 'Population'], correctAnswer: 0 },
      { question: 'What is the limit for free requests?', options: ['1000/day', 'Unlimited'], correctAnswer: 0 }
    ]
  },
  {
    id: 'zippopotamus',
    name: 'Zippopotamus',
    category: 'Geographic',
    authRequired: false,
    authType: 'None',
    description: 'Postal codes and zip code information.',
    endpoint: 'https://api.zippopotam.us/us/90210',
    docsUrl: 'https://www.zippopotam.us/',
    codeSnippet: `fetch('https://api.zippopotam.us/us/90210')
  .then(res => res.json())
  .then(data => console.log(data.places[0]['place name']));`,
    jsonExplanation: { 'country': 'Country Name', 'places': 'Array of places for that zip', 'state': 'State/Province' },
    securityChecklist: ['Verify zip format before sending.'],
    exercise: 'Create a form that auto-fills City/State when Zip is entered.',
    mockResponse: { "post code": "90210", country: "United States", places: [{ "place name": "Beverly Hills", state: "California" }] },
    quiz: [
      { question: 'Does it support only US?', options: ['Yes', 'No, over 60 countries'], correctAnswer: 1 },
      { question: 'Is auth required?', options: ['Yes', 'No'], correctAnswer: 1 }
    ]
  },
  {
    id: 'open-library',
    name: 'Open Library',
    category: 'Books',
    authRequired: false,
    authType: 'None',
    description: 'Search for books and get bibliographic data.',
    endpoint: 'https://openlibrary.org/search.json?q=the+lord+of+the+rings',
    docsUrl: 'https://openlibrary.org/developers/api',
    codeSnippet: `fetch('https://openlibrary.org/search.json?q=the+lord+of+the+rings')
  .then(res => res.json())
  .then(data => console.log(data.docs[0].title));`,
    jsonExplanation: { 'docs': 'Array of book results', 'author_name': 'Array of authors', 'publish_year': 'Array of years' },
    securityChecklist: ['Responses can be large, use pagination.'],
    exercise: 'Display the cover image of the first result.',
    mockResponse: { docs: [{ title: "The Lord of the Rings", author_name: ["J.R.R. Tolkien"], first_publish_year: 1954 }] },
    quiz: [
      { question: 'Who runs Open Library?', options: ['Google', 'Internet Archive'], correctAnswer: 1 },
      { question: 'Is it free?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'tvmaze',
    name: 'TVMaze',
    category: 'Entertainment',
    authRequired: false,
    authType: 'None',
    description: 'TV Show information.',
    endpoint: 'https://api.tvmaze.com/search/shows?q=girls',
    docsUrl: 'https://www.tvmaze.com/api',
    codeSnippet: `fetch('https://api.tvmaze.com/search/shows?q=girls')
  .then(res => res.json())
  .then(data => console.log(data[0].show.name));`,
    jsonExplanation: { 'show.name': 'Title', 'show.summary': 'HTML summary', 'show.image.medium': 'Poster URL' },
    securityChecklist: ['Sanitize the "summary" HTML before rendering.'],
    exercise: 'Search for "Breaking Bad" and show the premier date.',
    mockResponse: [{ show: { name: "Girls", premiered: "2012-04-15", rating: { average: 6.6 } } }],
    quiz: [
      { question: 'How do you search for a single show?', options: ['/singlesearch/shows', '/one/show'], correctAnswer: 0 },
      { question: 'Is auth needed?', options: ['Yes', 'No'], correctAnswer: 1 }
    ]
  },
  {
    id: 'universities',
    name: 'Universities List',
    category: 'Education',
    authRequired: false,
    authType: 'None',
    description: 'Search for universities worldwide.',
    endpoint: 'http://universities.hipolabs.com/search?country=United+States',
    docsUrl: 'https://github.com/Hipo/university-domains-list',
    codeSnippet: `fetch('http://universities.hipolabs.com/search?country=United+States')
  .then(res => res.json())
  .then(data => console.log(data[0].name));`,
    jsonExplanation: { 'name': 'University Name', 'web_pages': 'Array of website URLs', 'alpha_two_code': 'Country code' },
    securityChecklist: ['Note: uses HTTP, may need upgrade to HTTPS in some contexts.'],
    exercise: 'List first 5 universities in "Canada".',
    mockResponse: [{ name: "Marywood University", country: "United States", web_pages: ["http://www.marywood.edu"] }],
    quiz: [
      { question: 'Who maintains the data?', options: ['Hipo', 'Harvard'], correctAnswer: 0 },
      { question: 'Can you search by name?', options: ['Yes', 'No'], correctAnswer: 0 }
    ]
  },
  {
    id: 'exchange-rate',
    name: 'ExchangeRate-API',
    category: 'Finance',
    authRequired: true,
    authType: 'API Key',
    description: 'Free & reliable currency exchange rates.',
    endpoint: 'https://v6.exchangerate-api.com/v6/YOUR-API-KEY/latest/USD',
    docsUrl: 'https://www.exchangerate-api.com/',
    codeSnippet: `fetch('https://v6.exchangerate-api.com/v6/YOUR-KEY/latest/USD')
  .then(res => res.json())
  .then(data => console.log(data.conversion_rates.EUR));`,
    jsonExplanation: { 'conversion_rates': 'Object with currency codes as keys', 'base_code': 'The base currency' },
    securityChecklist: ['Cache rates! Prices usually change slowly.', 'Secure your key via backend proxy.'],
    exercise: 'Convert 100 USD to JPY using the rate.',
    mockResponse: { result: "success", base_code: "USD", conversion_rates: { EUR: 0.85, JPY: 110.5 } },
    quiz: [
      { question: 'What is the base currency in the example?', options: ['USD', 'EUR'], correctAnswer: 0 },
      { question: 'Is the API key part of the path or query?', options: ['Path', 'Query'], correctAnswer: 0 }
    ]
  }
];