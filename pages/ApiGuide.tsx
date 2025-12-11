
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from '../App';
import { getLocalizedApis } from '../constants';
import { runApiRequest } from '../services/apiRunner';
import { Play, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Key, Shield, Code, FileJson, XCircle, Info, ToggleLeft, ToggleRight, History, RotateCcw, ArrowRight, Eye, Wrench, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiPreview } from '../components/ApiPreview';
import { AiTutor } from '../components/AiTutor';
import { GlossaryTerm } from '../components/GlossaryTerm';

interface HistoryItem {
  id: number;
  timestamp: Date;
  status: number | null;
  source: string | null;
  duration: number;
  config: {
    isMockMode: boolean;
    apiKey: string;
    editableMockData: string;
    useProxy: boolean;
  };
}

const ApiGuide: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  
  const api = useMemo(() => {
    return getLocalizedApis(language).find(a => a.id === id);
  }, [language, id]);

  const [activeTab, setActiveTab] = useState<'guide' | 'sandbox' | 'quiz'>('guide');
  const [apiKey, setApiKey] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseSource, setResponseSource] = useState<'Live' | 'Mock' | 'Proxy' | 'Custom Mock' | null>(null);
  const [isError, setIsError] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const [isMockMode, setIsMockMode] = useState(false);
  const [editableMockData, setEditableMockData] = useState('');
  
  const [useProxy, setUseProxy] = useState(false);
  const [showCorsInfo, setShowCorsInfo] = useState(false);
  
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    setActiveTab('guide');
    setResponse(null);
    setApiKey('');
    setResponseStatus(null);
    setResponseSource(null);
    setIsError(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setHistory([]);
    setShowPreviewModal(false);
    setUseProxy(false);
    setShowCorsInfo(false);
    
    setIsMockMode(false);
    if (api) {
        setEditableMockData(JSON.stringify(api.mockResponse, null, 2));
    }
  }, [id]);

  if (!api) {
    return <div className="p-8 text-center text-gray-500 dark:text-slate-400">API not found. <Link to="/" className="text-blue-600">Go Home</Link></div>;
  }

  const handleRun = async (overrideProxyState?: boolean) => {
    setLoading(true);
    setResponse(null);
    setIsError(false);
    setShowPreviewModal(false);
    
    const runWithProxy = overrideProxyState !== undefined ? overrideProxyState : useProxy;
    
    const startTime = performance.now();
    let resultStatus: number | null = null;
    let resultSource: 'Live' | 'Mock' | 'Proxy' | 'Custom Mock' | null = null;
    
    const runConfig = {
        isMockMode,
        apiKey,
        editableMockData,
        useProxy: runWithProxy
    };

    if (isMockMode) {
        await new Promise(resolve => setTimeout(resolve, 600));
        try {
            const parsedData = JSON.parse(editableMockData);
            setResponse(parsedData);
            resultStatus = 200;
            resultSource = 'Custom Mock';
            setResponseStatus(200);
            setResponseSource('Custom Mock');
            setIsError(false);
        } catch (e) {
            const err = { error: "Invalid JSON format. Please correct the JSON syntax." };
            setResponse(err);
            resultStatus = 400;
            resultSource = 'Custom Mock';
            setResponseStatus(400);
            setResponseSource('Custom Mock');
            setIsError(true);
        }
    } else {
        const result = await runApiRequest(api, apiKey, runWithProxy);
        setResponse(result.data);
        setResponseStatus(result.status);
        setResponseSource(result.source);
        setIsError(!result.success);
        resultStatus = result.status;
        resultSource = result.source;
    }

    const duration = Math.round(performance.now() - startTime);

    const newHistoryItem: HistoryItem = {
        id: Date.now(),
        timestamp: new Date(),
        status: resultStatus,
        source: resultSource,
        duration,
        config: runConfig
    };
    
    setHistory(prev => [newHistoryItem, ...prev]);
    setLoading(false);
  };

  const handleFixCors = () => {
      setUseProxy(true);
      setShowCorsInfo(true);
      handleRun(true);
  };

  const restoreRequest = (item: HistoryItem) => {
    setIsMockMode(item.config.isMockMode);
    setApiKey(item.config.apiKey);
    setEditableMockData(item.config.editableMockData);
    setUseProxy(item.config.useProxy || false);
    setResponse(null);
    setResponseStatus(null);
    setResponseSource(null);
    setIsError(false);
    setShowPreviewModal(false);
    setShowCorsInfo(false);
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

  const isCorsError = isError && response?.error && (
      response.error.includes('Network Error') || 
      response.error.includes('CORS') || 
      response.error.includes('Failed to fetch')
  );

  const getErrorSuggestion = (status: number | null) => {
    if (status === 0) return language === 'pt' 
        ? "Verifique sua conexão ou configurações de CORS. Muitas APIs públicas bloqueiam requisições diretas do navegador."
        : "Check your internet connection or CORS settings. Many public APIs block direct browser requests.";
    if (status === 401) return "The API Key provided is likely invalid or missing.";
    if (status === 403) return "Access Forbidden. You may be rate limited or restricted.";
    if (status === 404) return "The endpoint URL is incorrect or the resource no longer exists.";
    return "Check the response body below for specific error messages.";
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8 border-b dark:border-slate-800 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded uppercase tracking-wide">
                {api.category}
              </span>
              {api.authRequired ? (
                 <span className="flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded">
                   <Key size={12} /> {t('auth_required_tag')}
                 </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded">
                  <CheckCircle size={12} /> {t('no_auth_tag')}
                 </span>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{api.name}</h1>
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg">
               Explore this <GlossaryTerm term="restful">RESTful</GlossaryTerm> <GlossaryTerm term="api">API</GlossaryTerm>. {api.description}
            </p>
          </div>
          <a 
            href={api.docsUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
          >
            {t('official_docs')} <ExternalLink size={16} />
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-slate-800 mb-6 overflow-x-auto">
        <button onClick={() => setActiveTab('guide')} className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'guide' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400'}`}>
          {t('tab_guide')}
        </button>
        <button onClick={() => setActiveTab('sandbox')} className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'sandbox' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400'}`}>
          {t('tab_sandbox')}
        </button>
        <button onClick={() => setActiveTab('quiz')} className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${activeTab === 'quiz' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400'}`}>
          {t('tab_quiz')}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 min-h-[500px]">
        {activeTab === 'guide' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Code className="text-blue-500" /> {t('implementation')}
                </h3>
                <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 overflow-x-auto text-sm text-slate-300 font-mono shadow-inner border border-slate-800">
                  <pre>{api.codeSnippet}</pre>
                </div>
                <div className="mt-4 text-sm text-gray-600 dark:text-slate-400 break-all">
                  <p><GlossaryTerm term="endpoint">Endpoint</GlossaryTerm>: <code className="bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-gray-800 dark:text-slate-200">{api.endpoint}</code></p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileJson className="text-purple-500" /> {t('understanding_response')}
                </h3>
                <div className="space-y-3">
                  {Object.entries(api.jsonExplanation).map(([key, desc]) => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-baseline gap-2 text-sm border-b border-gray-100 dark:border-slate-800 pb-2">
                      <code className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{key}</code>
                      <span className="text-gray-600 dark:text-slate-400">{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="flex flex-col h-full relative">
            <div className="mb-6">
              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('method_endpoint')}</label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-sm font-mono">
                      <GlossaryTerm term="http">GET</GlossaryTerm>
                    </span>
                    <input type="text" readOnly value={api.endpoint} className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 sm:text-sm p-2 border" />
                  </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-4">
                  <div className="flex-1 w-full">
                      {!isMockMode && api.authRequired && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                           <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('api_key_optional')}</label>
                           <input type="password" placeholder={t('paste_key')} value={apiKey} onChange={(e) => setApiKey(e.target.value)} className="block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 shadow-sm sm:text-sm p-2 border" />
                        </div>
                      )}
                  </div>

                  <div>
                     <button onClick={() => setIsMockMode(!isMockMode)} className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border transition-colors ${isMockMode ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20' : 'bg-white border-gray-300 text-gray-700 dark:bg-slate-800'}`}>
                        {isMockMode ? <ToggleRight className="text-purple-600" /> : <ToggleLeft className="text-gray-400" />}
                        <span><GlossaryTerm term="mock">{t('mock_mode')}</GlossaryTerm></span>
                     </button>
                  </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button onClick={() => handleRun()} disabled={loading} className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${loading ? 'bg-gray-400' : isMockMode ? 'bg-purple-600' : 'bg-blue-600'}`}>
                  {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isMockMode ? t('simulate_response') : t('run_request')}
                </button>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                  {showCorsInfo && (
                     <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 animate-in fade-in slide-in-from-top-2">
                         <div className="flex items-start gap-3">
                             <Globe className="text-blue-600 shrink-0 mt-1" size={20} />
                             <div>
                                 <h4 className="font-bold text-blue-800 dark:text-blue-300 text-sm">
                                   Fixed via <GlossaryTerm term="proxy">Proxy</GlossaryTerm>
                                 </h4>
                                 <p className="text-sm text-blue-700 dark:text-blue-200/80 mt-1">{t('cors_fixed_desc')}</p>
                             </div>
                         </div>
                     </div>
                  )}

                  <div className={`flex-1 bg-slate-900 dark:bg-slate-950 rounded-lg overflow-hidden font-mono text-sm flex flex-col min-h-[300px] border ${isError ? 'border-red-400' : 'border-transparent'}`}>
                    <div className="bg-slate-800/50 dark:bg-slate-900/50 px-4 py-2 border-b border-slate-700/50 flex flex-wrap gap-2 items-center justify-end">
                       {responseStatus !== null && <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${responseStatus >= 200 && responseStatus < 300 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{t('status')}: {responseStatus}</span>}
                       {responseSource && <span className={`px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500 text-white`}>{t('source')}: {responseSource}</span>}
                       {useProxy && !isError && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-900/50 text-orange-400 border border-orange-800"><GlossaryTerm term="proxy">{t('proxy_active')}</GlossaryTerm></span>}
                    </div>
                    
                    <div className="flex-1 p-4 overflow-auto custom-scrollbar relative">
                      {loading ? (
                        <div className="flex items-center justify-center h-full text-slate-500"><RefreshCw className="animate-spin text-blue-500 mr-2" /> {t('sending')}</div>
                      ) : response ? (
                        <pre className={`${isError ? 'text-red-300' : 'text-green-400'} whitespace-pre-wrap break-all`}>{JSON.stringify(response, null, 2)}</pre>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                           <Code size={24} /> <span>{t('ready_run')}</span>
                        </div>
                      )}
                    </div>
                  </div>
            </div>
            <AiTutor apiDefinition={api} lastResponse={response} lastStatus={responseStatus} isError={isError} />
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto py-8">
            {showScore ? (
              <div className="text-center"><h3 className="text-2xl font-bold mb-2">{t('quiz_completed')}</h3></div>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-6">{api.quiz[currentQuestion].question}</h3>
                <div className="space-y-3">
                  {api.quiz[currentQuestion].options.map((option, idx) => (
                    <button key={idx} onClick={() => handleAnswerOptionClick(idx)} className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-blue-500 transition-all">
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
