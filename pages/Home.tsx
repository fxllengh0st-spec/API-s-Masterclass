import React from 'react';
import { Link } from 'react-router-dom';
import { APIS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, Lock, Unlock, Zap, Book } from 'lucide-react';

const Home: React.FC = () => {
  // Calculate Stats
  const categoryCount = APIS.reduce((acc, api) => {
    acc[api.category] = (acc[api.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(categoryCount).map(key => ({
    name: key,
    count: categoryCount[key]
  }));

  const authCount = APIS.filter(a => a.authRequired).length;
  const noAuthCount = APIS.length - authCount;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Master APIs by Doing</h1>
        <p className="text-blue-100 text-lg max-w-2xl mb-8">
          A hands-on interactive guide to 20 free public APIs. Learn endpoints, authentication, and integration patterns with live sandboxes and code snippets.
        </p>
        <div className="flex gap-4">
          <Link to="/tutorial" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center">
            Start Tutorial <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link to="/api/rest-countries" className="bg-blue-800 bg-opacity-40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-60 transition-colors">
            Browse APIs
          </Link>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Unlock className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">No Auth Required</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{noAuthCount}</p>
          <p className="text-sm text-gray-400">Great for beginners</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Lock className="w-5 h-5 text-amber-500" />
            <h3 className="font-medium">API Key Needed</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{authCount}</p>
          <p className="text-sm text-gray-400">Real-world practice</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2 text-gray-500">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">Total APIs</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800">{APIS.length}</p>
          <p className="text-sm text-gray-400">Across {chartData.length} categories</p>
        </div>
      </div>

      {/* Categories Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold mb-6 text-gray-800">API Categories</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 12}} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4f46e5' : '#6366f1'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Featured APIs */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Featured Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APIS.slice(0, 6).map(api => (
            <Link key={api.id} to={`/api/${api.id}`} className="block group">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded font-medium uppercase">
                    {api.category}
                  </span>
                  {api.authRequired ? (
                    <Lock className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {api.name}
                </h3>
                <p className="text-sm text-gray-500 flex-1 line-clamp-2">
                  {api.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600">
                  Try it out <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;