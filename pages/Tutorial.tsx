
import React from 'react';
import { ArrowRight, CheckCircle, Terminal, FileCode, Server } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { GlossaryTerm } from '../components/GlossaryTerm';

const Tutorial: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-12">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{t('tutorial_title')}</h1>
        <p className="text-xl text-gray-500 dark:text-slate-400">{t('tutorial_subtitle')}</p>
      </div>

      {/* Step 1 */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm font-bold mr-3">1</span>
          {t('step_1_title')}
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mb-4">
          We want to get a fake user's profile (Name, Email, Photo) to display on our website. We will use the RandomUser <GlossaryTerm term="api">API</GlossaryTerm> because it requires no key (Authentication).
        </p>
        <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-slate-700 text-sm text-gray-800 dark:text-slate-300">
          <strong>{t('target_endpoint')}</strong> <code className="text-blue-600 dark:text-blue-400">https://randomuser.me/api/</code>
        </div>
      </section>

      {/* Step 2 */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm font-bold mr-3">2</span>
          {t('step_2_title')}
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mb-4">
          Modern JavaScript uses the <GlossaryTerm term="fetch">fetch</GlossaryTerm> method. It returns a "Promise" – meaning the browser says "I'll get this data, wait a moment."
        </p>
        <div className="bg-slate-900 dark:bg-slate-950 text-slate-300 p-4 rounded-lg font-mono text-sm overflow-x-auto border border-transparent dark:border-slate-800">
          <pre>{`// 1. Call the URL
fetch('https://randomuser.me/api/')
  // 2. Convert the raw response to JSON
  .then(response => {
     if(!response.ok) throw new Error("Failed");
     return response.json();
  })
  // 3. Use the data
  .then(data => {
     console.log(data); 
  })
  // 4. Handle errors
  .catch(error => console.error(error));`}</pre>
        </div>
      </section>

      {/* Step 3 */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm font-bold mr-3">3</span>
          {t('step_3_title')}
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mb-4">
          APIs return data in nested <GlossaryTerm term="json">JSON</GlossaryTerm> objects. You need to look at the structure to find what you want.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded border border-gray-200 dark:border-slate-700 text-xs font-mono dark:text-slate-300">
                <p className="text-slate-500 dark:text-slate-400 mb-2">// Response Structure</p>
                {`{
  "results": [
    {
      "gender": "male",
      "name": {
        "first": "Brad",
        "last": "Gibson"
      },
      "email": "brad.gibson@example.com"
    }
  ]
}`}
            </div>
            <div className="flex flex-col justify-center space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>User is inside an array called results</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>Name is an object inside that user</span>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-sm font-mono mt-2">
                    const user = data.results[0];<br/>
                    console.log(user.name.first);
                </div>
            </div>
        </div>
      </section>

       {/* Step 4 */}
       <section className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 bg-blue-500 h-full"></div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm font-bold mr-3">4</span>
          {t('step_4_title')}
        </h2>
        <p className="text-gray-600 dark:text-slate-300 mb-4">
          Network requests fail. The internet goes down, APIs change, keys expire. Always wrap calls in try/catch or use .catch().
        </p>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded border border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-300 text-sm">
          <strong>Common Errors:</strong>
          <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>404 Not Found: Wrong <GlossaryTerm term="endpoint">endpoint</GlossaryTerm> URL.</li>
              <li>401 Unauthorized: Missing or wrong API Key.</li>
              <li>500 Server Error: The <GlossaryTerm term="backend">backend</GlossaryTerm> itself is broken.</li>
              <li><GlossaryTerm term="cors">CORS</GlossaryTerm> Error: Browser blocked the request for security.</li>
          </ul>
        </div>
      </section>

      <div className="flex justify-center pt-8">
        <a href="#/api/randomuser" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-transform transform hover:-translate-y-1 flex items-center gap-2">
            {t('try_sandbox_btn')} <ArrowRight size={20} />
        </a>
      </div>

    </div>
  );
};

export default Tutorial;
