import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { APIS } from '../constants';
import { runApiRequest } from '../services/apiRunner';
import { Play, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Key, Shield, Code, FileJson } from 'lucide-react';

const ApiGuide: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const api = APIS.find(a => a.id === id);

  const [activeTab, setActiveTab] = useState<'guide' | 'sandbox' | 'quiz'>('guide');
  const [apiKey, setApiKey] = useState('');
  
  // Sandbox State
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseSource, setResponseSource] = useState<'Live' | 'Mock' | null>(null);
  
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    // Reset state when API changes
    setActiveTab('guide');
    setResponse(null);
    setApiKey('');
    setResponseStatus(null);
    setResponseSource(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  }, [id]);

  if (!api) {
    return <div className="p-8 text-center text-gray-500">API not found. <Link to="/" className="text-blue-600">Go Home</Link></div>;
  }

  const handleRun = async () => {
    setLoading(true);
    setResponse(null);
    
    const result = await runApiRequest(api, apiKey);
    
    setResponse(result.data);
    setResponseStatus(result.status);
    setResponseSource(result.source);
    setLoading(false);
  };

  const handleAnswerOptionClick = (optionIndex: number) => {
    if (optionIndex === api.quiz[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < api.quiz.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 border-b pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded uppercase tracking-wide">
                {api.category}
              </span>
              {api.authRequired ? (
                 <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                   <Key size={12} /> Auth Required
                 </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  <CheckCircle size={12} /> No Auth
                </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{api.name}</h1>
            <p className="text-gray-500 mt-2 text-lg">{api.description}</p>
          </div>
          <a 
            href={api.docsUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Official Docs <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'guide' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Guide & Info
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'sandbox' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Interactive Sandbox
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'quiz' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Quiz
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[500px]">
        
        {/* GUIDE TAB */}
        {activeTab === 'guide' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Code className="text-blue-500" /> Implementation
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto text-sm text-slate-300 font-mono shadow-inner">
                  <pre>{api.codeSnippet}</pre>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Endpoint: <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-800">{api.endpoint}</code></p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileJson className="text-purple-500" /> Understanding Response
                </h3>
                <div className="space-y-3">
                  {Object.entries(api.jsonExplanation).map(([key, desc]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm border-b border-gray-100 pb-2">
                      <code className="font-mono text-blue-600 font-semibold">{key}</code>
                      <span className="text-gray-600">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                <h3 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                  <Shield size={18} /> Security Checklist
                </h3>
                <ul className="space-y-2">
                  {api.securityChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                      <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                <h3 className="font-bold text-indigo-800 mb-3">Try this Exercise</h3>
                <p className="text-indigo-900 text-sm italic">"{api.exercise}"</p>
                <button 
                  onClick={() => setActiveTab('sandbox')}
                  className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide"
                >
                  Go to Sandbox &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SANDBOX TAB */}
        {activeTab === 'sandbox' && (
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex-1">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Method & Endpoint</label>
                   <div className="flex rounded-md shadow-sm">
                     <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-mono">
                       GET
                     </span>
                     <input 
                        type="text" 
                        readOnly 
                        value={api.endpoint} 
                        className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 bg-gray-50 text-gray-500 sm:text-sm p-2 border"
                      />
                   </div>
                </div>
                {api.authRequired && (
                  <div className="w-full sm:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">API Key (Optional)</label>
                    <input 
                      type="password" 
                      placeholder="Paste real key to test live" 
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleRun}
                disabled={loading}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
                Run Request
              </button>
              
              {api.authRequired && !apiKey && (
                <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
                  <AlertTriangle size={12} /> No key provided. Sandbox will return a static <strong>Mock Response</strong>.
                </p>
              )}
            </div>

            <div className="flex-1 bg-slate-900 rounded-lg p-4 font-mono text-sm relative min-h-[300px]">
              <div className="absolute top-2 right-2 flex gap-2">
                 {responseStatus && (
                   <span className={`px-2 py-1 rounded text-xs font-bold ${responseStatus >= 200 && responseStatus < 300 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                     Status: {responseStatus}
                   </span>
                 )}
                 {responseSource && (
                   <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500 text-white">
                     Source: {responseSource}
                   </span>
                 )}
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center h-full text-slate-500">
                  <span>Sending Request...</span>
                </div>
              ) : response ? (
                <pre className="text-green-400 overflow-auto max-h-[400px]">
                  {JSON.stringify(response, null, 2)}
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-600">
                  <span>Waiting for request...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto py-8">
            {showScore ? (
              <div className="text-center">
                <div className="text-5xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h3>
                <p className="text-gray-600 mb-6">You scored {score} out of {api.quiz.length}</p>
                <button 
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setShowScore(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Restart Quiz
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-sm text-gray-500 mb-4">
                  <span>Question {currentQuestion + 1} of {api.quiz.length}</span>
                  <span>Score: {score}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  {api.quiz[currentQuestion].question}
                </h3>
                <div className="space-y-3">
                  {api.quiz[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerOptionClick(idx)}
                      className="w-full text-left p-4 rounded border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ApiGuide;