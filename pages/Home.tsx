import React from 'react';
import { Link } from '../App';
import { getLocalizedApis } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowRight, Lock, Unlock, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { GlossaryTerm } from '../components/GlossaryTerm';

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const apis = getLocalizedApis(language);

  // Calculate Stats
  const categoryCount = apis.reduce((acc, api) => {
    acc[api.category] = (acc[api.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.keys(categoryCount).map(key => ({
    name: key,
    count: categoryCount[key]
  }));

  const authCount = apis.filter(a => a.authRequired).length;
  const noAuthCount = apis.length - authCount;

  // Chart styling based on theme
  const chartAxisColor = theme === 'dark' ? '#94a3b8' : '#6b7280';
  const chartTooltipStyle = theme === 'dark' ? { backgroundColor: '#1e293b', border: '1px solid #334155', color: '#f8fafc' } : {};

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{t('hero_title')}</h1>
        <p className="text-blue-100 text-lg max-w-2xl mb-8">
          A hands-on interactive guide to 20 free public <GlossaryTerm term="api">APIs</GlossaryTerm>. 
          Learn <GlossaryTerm term="endpoint">endpoints</GlossaryTerm>, authentication, and integration patterns with live <GlossaryTerm term="sandbox">sandboxes</GlossaryTerm> and code snippets.
        </p>
        <div className="flex gap-4">
          <Link to="/tutorial" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center">
            {t('start_tutorial')} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
          <Link to="/api/rest-countries" className="bg-blue-800 bg-opacity-40 text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-60 transition-colors">
            {t('browse_apis')}
          </Link>
        </div>
      </section>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-slate-400">
            <Unlock className="w-5 h-5 text-green-500" />
            <h3 className="font-medium">{t('no_auth')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{noAuthCount}</p>
          <p className="text-sm text-gray-400 dark:text-slate-500">{t('no_auth_desc')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-slate-400">
            <Lock className="w-5 h-5 text-amber-500" />
            <h3 className="font-medium">{t('api_key')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{authCount}</p>
          <p className="text-sm text-gray-400 dark:text-slate-500">{t('api_key_desc')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center gap-3 mb-2 text-gray-500 dark:text-slate-400">
            <Zap className="w-5 h-5 text-blue-500" />
            <h3 className="font-medium">{t('total_apis')}</h3>
          </div>
          <p className="text-3xl font-bold text-gray-800 dark:text-white">{apis.length}</p>
          <p className="text-sm text-gray-400 dark:text-slate-500">{t('across_categories').replace('{{count}}', String(chartData.length))}</p>
        </div>
      </div>

      {/* Categories Chart */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">{t('categories_title')}</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{fontSize: 12, fill: chartAxisColor}} interval={0} angle={-25} textAnchor="end" height={60} stroke={chartAxisColor} />
              <YAxis allowDecimals={false} tick={{fill: chartAxisColor}} stroke={chartAxisColor} />
              <Tooltip contentStyle={chartTooltipStyle} cursor={{fill: 'transparent'}} />
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
        <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('featured_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apis.slice(0, 6).map(api => (
            <Link key={api.id} to={`/api/${api.id}`} className="block group">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md dark:hover:border-slate-700 transition-all h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-2 py-1 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-30 text-blue-600 dark:text-blue-400 text-xs rounded font-medium uppercase">
                    {api.category}
                  </span>
                  {api.authRequired ? (
                    <Lock className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                  {api.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 flex-1 line-clamp-2">
                  {api.description}
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400">
                  {t('try_it')} <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
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