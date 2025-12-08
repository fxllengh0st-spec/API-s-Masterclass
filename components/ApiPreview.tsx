import React from 'react';
import { Cloud, Wind, MapPin, User, DollarSign, ExternalLink, Calendar, BookOpen, Film, Radio, Smile, Globe, FileText, GraduationCap, TrendingUp } from 'lucide-react';

const WeatherPreview = ({ data }: { data: any }) => {
   if (!data || !data.main) return <div className="text-red-500">Incomplete Weather Data</div>;
   const tempC = Math.round(data.main.temp > 200 ? data.main.temp - 273.15 : data.main.temp); // Handle Kelvin or Celsius
   return (
     <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg text-center w-full max-w-sm mx-auto">
        <h3 className="text-2xl font-bold">{data.name}</h3>
        <div className="text-6xl font-bold my-4">{tempC}°</div>
        <p className="capitalize text-lg flex items-center justify-center gap-2">
            <Cloud /> {data.weather?.[0]?.description}
        </p>
        <div className="mt-4 flex justify-center gap-4 text-blue-100">
           <span>Humidity: {data.main.humidity}%</span>
           <span className="flex items-center gap-1"><Wind size={16}/> {data.wind?.speed}m/s</span>
        </div>
     </div>
   )
};

const UserPreview = ({ data }: { data: any }) => {
    const user = data.results ? data.results[0] : data;
    if (!user || !user.name) return <div className="text-red-500">Incomplete User Data</div>;
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg flex items-center gap-4 max-w-md mx-auto border border-gray-100 dark:border-slate-700">
            <img src={user.picture?.large || user.picture?.medium} alt="User" className="w-20 h-20 rounded-full border-4 border-blue-500" />
            <div className="text-left">
                <h3 className="text-xl font-bold dark:text-white text-gray-900">{user.name.first} {user.name.last}</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm break-all">{user.email}</p>
                <p className="text-gray-400 text-xs mt-1 capitalize flex items-center gap-1">
                    <MapPin size={10} /> {user.location?.city}, {user.location?.country}
                </p>
            </div>
        </div>
    )
}

const CountryPreview = ({ data }: { data: any }) => {
    const country = Array.isArray(data) ? data[0] : data;
    if (!country || !country.name) return <div className="text-red-500">Incomplete Country Data</div>;
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto border border-gray-100 dark:border-slate-700">
            {(country.flags?.png || country.flags?.svg) && (
                <img src={country.flags?.png || country.flags?.svg} alt="Flag" className="w-full h-40 object-cover" />
            )}
            <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 dark:text-white text-gray-900">{country.name.common}</h3>
                <div className="space-y-2 text-gray-600 dark:text-slate-300 text-sm">
                    <p className="flex justify-between border-b dark:border-slate-700 pb-1"><strong>Capital:</strong> <span>{country.capital?.[0] || 'N/A'}</span></p>
                    <p className="flex justify-between border-b dark:border-slate-700 pb-1"><strong>Region:</strong> <span>{country.region}</span></p>
                    <p className="flex justify-between border-b dark:border-slate-700 pb-1"><strong>Population:</strong> <span>{country.population?.toLocaleString()}</span></p>
                </div>
            </div>
        </div>
    )
}

const ImagePreview = ({ url, label }: { url: string, label?: string }) => (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700">
        <img src={url} alt="Preview" className="w-full h-64 object-cover rounded-lg bg-gray-100 dark:bg-slate-900" />
        {label && <p className="mt-4 text-center font-bold text-lg dark:text-white capitalize text-gray-800">{label}</p>}
    </div>
);

const CoinPreview = ({ data }: { data: any }) => {
    // Basic heuristics to find price in a { bitcoin: { usd: 50000 } } structure
    const keys = Object.keys(data);
    if (keys.length === 0) return null;
    const coin = keys[0];
    const currencies = data[coin] ? Object.keys(data[coin]) : [];
    const currency = currencies[0];
    const price = currency ? data[coin][currency] : 0;
    
    return (
        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg text-center max-w-sm mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <DollarSign size={100} />
            </div>
            <h3 className="text-gray-400 uppercase text-sm tracking-wider mb-2">{coin} Price</h3>
            <div className="text-4xl font-mono font-bold flex items-center justify-center gap-1">
                 {price?.toLocaleString()} <span className="text-lg text-gray-500 self-end mb-1 uppercase">{currency}</span>
            </div>
        </div>
    );
}

const NewsPreview = ({ data }: { data: any }) => {
    const article = data.articles ? data.articles[0] : null;
    if (!article) return <div className="text-red-500">No articles found</div>;
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg max-w-sm mx-auto border border-gray-100 dark:border-slate-700">
            {article.urlToImage && (
                <img src={article.urlToImage} alt="News" className="w-full h-40 object-cover" />
            )}
            <div className="p-5">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">{article.source?.name}</span>
                <h3 className="text-lg font-bold my-2 dark:text-white text-gray-900 leading-tight line-clamp-2">{article.title}</h3>
                <p className="text-gray-600 dark:text-slate-400 text-sm line-clamp-3 mb-4">{article.description}</p>
                <a href={article.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-sm font-semibold flex items-center gap-1 hover:underline">
                    Read more <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}

const PostPreview = ({ data }: { data: any }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-md mx-auto border-l-4 border-blue-500 relative">
        <FileText className="absolute top-6 right-6 text-gray-200 dark:text-slate-700 w-12 h-12" />
        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 pr-8">{data.title}</h3>
        <p className="text-gray-600 dark:text-slate-400 leading-relaxed text-sm mb-4">{data.body}</p>
        <div className="flex gap-2 text-xs font-mono text-gray-400">
            <span>UserID: {data.userId}</span>
            <span>ID: {data.id}</span>
        </div>
    </div>
);

const BookPreview = ({ data }: { data: any }) => {
    const book = data.docs ? data.docs[0] : data;
    if (!book) return <div>No book data</div>;
    return (
        <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl shadow-lg max-w-md mx-auto flex gap-4 border border-amber-100 dark:border-amber-900/30">
            <div className="w-20 h-28 bg-amber-200 dark:bg-amber-800 rounded shadow-inner flex items-center justify-center shrink-0">
                <BookOpen className="text-amber-700 dark:text-amber-200 opacity-50" />
            </div>
            <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight mb-1">{book.title}</h3>
                <p className="text-sm text-gray-700 dark:text-slate-300 mb-2">by {book.author_name?.[0]}</p>
                <span className="inline-block px-2 py-1 bg-white dark:bg-slate-900 rounded text-xs font-mono text-gray-500 dark:text-slate-400 border border-amber-200 dark:border-amber-800">
                    {book.first_publish_year}
                </span>
            </div>
        </div>
    )
};

const UniPreview = ({ data }: { data: any }) => {
    const uni = Array.isArray(data) ? data[0] : data;
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-md mx-auto text-center border-t-4 border-blue-800">
            <GraduationCap className="w-12 h-12 text-blue-800 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{uni.name}</h3>
            <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">{uni.country}</p>
            {uni.web_pages?.[0] && (
                <a href={uni.web_pages[0]} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    {uni.web_pages[0]}
                </a>
            )}
        </div>
    );
};

const ExchangePreview = ({ data }: { data: any }) => {
    const rates = data.conversion_rates || {};
    const firstRate = Object.keys(rates)[0];
    return (
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg max-w-xs mx-auto text-center border border-slate-700">
            <div className="flex items-center justify-center gap-2 mb-4 text-green-400">
                <TrendingUp /> <span className="font-bold">FOREX</span>
            </div>
            <div className="text-3xl font-bold mb-1">{data.base_code}</div>
            <div className="text-sm text-slate-500 mb-4">Base Currency</div>
            <div className="bg-slate-800 rounded p-3">
                 <div className="text-xs text-slate-400 uppercase mb-1">Exchange Rate ({firstRate})</div>
                 <div className="text-xl font-mono">{rates[firstRate]}</div>
            </div>
        </div>
    );
};

// Main Component
export const ApiPreview: React.FC<{ id: string, data: any }> = ({ id, data }) => {
  if (!data) return <div className="text-center p-4 text-gray-500">No data to display</div>;

  // Error handling for responses that are error objects
  if (data.error || (data.success === false && !data.data)) {
      return (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-center">
              Cannot render preview: API returned an error.
          </div>
      )
  }

  try {
    switch(id) {
        case 'openweathermap': return <WeatherPreview data={data} />;
        case 'randomuser': return <UserPreview data={data} />;
        case 'rest-countries': return <CountryPreview data={data} />;
        case 'dog-ceo': return <ImagePreview url={data.message} label={data.status === 'success' ? 'Good Dog!' : 'Dog'} />;
        case 'cat-facts': return (
            <div className="bg-orange-100 dark:bg-orange-900/30 p-8 rounded-xl shadow-lg text-center relative max-w-md mx-auto">
                <Smile className="w-12 h-12 text-orange-400 mx-auto mb-4" />
                <p className="text-lg font-serif text-orange-900 dark:text-orange-100 relative z-10 italic">"{data.fact}"</p>
            </div>
        );
        case 'pokeapi': return (
            <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg text-center max-w-xs mx-auto border-4 border-red-600">
                <div className="bg-white rounded-full p-4 w-32 h-32 mx-auto mb-4 flex items-center justify-center shadow-inner border-4 border-gray-200">
                    <img src={data.sprites?.front_default || data.sprites?.other?.['official-artwork']?.front_default} alt={data.name} className="w-full h-full object-contain" />
                </div>
                <h3 className="text-2xl font-bold capitalize mb-2 tracking-wide">{data.name}</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                    {data.types?.map((t: any) => (
                        <span key={t.type.name} className="bg-white/20 px-3 py-1 rounded-full text-sm capitalize font-medium shadow-sm">{t.type.name}</span>
                    ))}
                </div>
            </div>
        );
        case 'coingecko': return <CoinPreview data={data} />;
        case 'spacex': return (
             <div className="bg-black text-white p-6 rounded-xl shadow-lg max-w-md mx-auto border border-slate-800">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">{data.name}</h3>
                    {data.success ? <span className="bg-green-500 text-xs px-2 py-1 rounded font-bold uppercase text-black">Success</span> : <span className="bg-red-500 text-xs px-2 py-1 rounded">Fail</span>}
                 </div>
                 <div className="text-slate-400 text-sm mb-4 flex items-center gap-2">
                     <Calendar size={14} /> {new Date(data.date_utc).toLocaleDateString()}
                 </div>
                 <p className="text-slate-300 text-sm line-clamp-4">{data.details || 'No mission details available.'}</p>
             </div>
        );
        case 'news-api': return <NewsPreview data={data} />;
        case 'joke-api': return (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-xl shadow-lg text-center max-w-md mx-auto border border-emerald-100 dark:border-emerald-900/50">
                {data.type === 'single' ? (
                    <p className="text-xl font-medium text-emerald-900 dark:text-emerald-100">{data.joke}</p>
                ) : (
                    <>
                        <p className="text-lg text-emerald-800 dark:text-emerald-200 mb-4 font-medium">{data.setup}</p>
                        <div className="inline-block bg-emerald-200 dark:bg-emerald-800 px-4 py-2 rounded-lg text-emerald-900 dark:text-white font-bold animate-pulse">
                            {data.delivery}
                        </div>
                    </>
                )}
            </div>
        );
        case 'bored-api': return (
            <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl shadow-lg text-center max-w-md mx-auto border-2 border-dashed border-pink-200 dark:border-pink-800">
                <h4 className="uppercase text-xs font-bold text-pink-500 mb-2">Activity Idea</h4>
                <p className="text-xl font-bold text-gray-800 dark:text-white mb-2">{data.activity}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-500 dark:text-slate-400 mt-4">
                    <span className="capitalize bg-white dark:bg-slate-800 px-3 py-1 rounded shadow-sm">{data.type}</span>
                    <span className="bg-white dark:bg-slate-800 px-3 py-1 rounded shadow-sm flex items-center gap-1"><User size={12}/> {data.participants}</span>
                </div>
            </div>
        );
        case 'agify': return (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-xl shadow-lg text-center max-w-xs mx-auto">
                 <div className="text-5xl mb-2">🎂</div>
                 <h3 className="text-2xl font-bold capitalize text-indigo-900 dark:text-indigo-100">{data.name}</h3>
                 <p className="text-indigo-600 dark:text-indigo-300 mt-2">Predicted Age</p>
                 <div className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 my-2">{data.age}</div>
                 <p className="text-xs text-indigo-400 dark:text-indigo-500/70">Based on {data.count?.toLocaleString()} records</p>
            </div>
        );
        case 'ipify': return (
            <div className="bg-slate-800 text-white p-8 rounded-xl shadow-lg text-center max-w-md mx-auto font-mono border-2 border-green-500">
                <p className="text-green-400 text-sm mb-2">&gt; WHOAMI</p>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{data.ip}</h2>
            </div>
        );
        case 'nationalize':
            if (!data.country || data.country.length === 0) return <div>No nationality data</div>;
            return (
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg max-w-sm mx-auto border border-gray-100 dark:border-slate-700">
                     <h3 className="text-center text-xl font-bold capitalize mb-4 dark:text-white">{data.name} is likely from:</h3>
                     <div className="space-y-3">
                         {data.country.slice(0, 3).map((c: any) => (
                             <div key={c.country_id} className="flex items-center gap-3">
                                 <span className="font-mono font-bold text-blue-600 dark:text-blue-400 w-8">{c.country_id}</span>
                                 <div className="flex-1 h-3 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                     <div className="h-full bg-blue-500" style={{ width: `${Math.round(c.probability * 100)}%` }}></div>
                                 </div>
                                 <span className="text-xs text-gray-500 w-10 text-right">{Math.round(c.probability * 100)}%</span>
                             </div>
                         ))}
                     </div>
                </div>
            );
        case 'zippopotamus':
             const place = data.places?.[0];
             return (
                 <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-xl shadow-lg max-w-sm mx-auto border border-amber-100 dark:border-amber-800/50">
                     <div className="flex items-center justify-center w-12 h-12 bg-amber-100 dark:bg-amber-900/50 rounded-full mx-auto mb-3 text-amber-600 dark:text-amber-400">
                         <MapPin />
                     </div>
                     <h3 className="text-center text-2xl font-bold text-gray-800 dark:text-white">{data['post code']}</h3>
                     <p className="text-center text-gray-500 dark:text-slate-400 mb-4">{data.country}</p>
                     {place && (
                         <div className="bg-white dark:bg-slate-800 p-3 rounded-lg text-center text-sm font-medium text-gray-700 dark:text-slate-300 shadow-sm">
                             {place['place name']}, {place['state']}
                         </div>
                     )}
                 </div>
             );
        case 'tvmaze':
             const show = Array.isArray(data) ? data[0]?.show : data; // Search returns array
             if (!show) return <div className="text-red-500">No show found</div>;
             return (
                 <div className="flex gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg max-w-md mx-auto border border-gray-100 dark:border-slate-700">
                     <img src={show.image?.medium} alt={show.name} className="w-24 h-36 object-cover rounded shadow-sm" />
                     <div>
                         <h3 className="font-bold text-lg dark:text-white">{show.name}</h3>
                         <div className="text-xs text-gray-500 dark:text-slate-400 mb-2 flex flex-wrap gap-1">
                            {show.genres?.map((g:string) => <span key={g} className="bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{g}</span>)}
                         </div>
                         <div className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3" dangerouslySetInnerHTML={{ __html: show.summary }}></div>
                     </div>
                 </div>
             );
        // New Added Cases
        case 'jsonplaceholder': return <PostPreview data={data} />;
        case 'open-library': return <BookPreview data={data} />;
        case 'universities': return <UniPreview data={data} />;
        case 'exchange-rate': return <ExchangePreview data={data} />;
        
        // Default generic visualization
        default: return (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow border border-gray-100 dark:border-slate-700 max-w-md mx-auto text-center">
                <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4 opacity-50" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Data Received</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm">
                   We don't have a specific stylized preview for this API yet, but the raw data is valid and was received successfully!
                </p>
            </div>
        );
    }
  } catch (err) {
      console.error("Preview render error", err);
      return <div className="text-red-500 text-center">Error rendering preview</div>;
  }
}