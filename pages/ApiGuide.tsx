import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLocalizedApis } from '../constants';
import { runApiRequest } from '../services/apiRunner';
import { Play, CheckCircle, AlertTriangle, ExternalLink, RefreshCw, Key, Shield, Code, FileJson, XCircle, Info, ToggleLeft, ToggleRight, History, RotateCcw, ArrowRight, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ApiPreview } from '../components/ApiPreview';

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
  };
}

const ApiGuide: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, t } = useLanguage();
  const api = getLocalizedApis(language).find(a => a.id === id);

  const [activeTab, setActiveTab] = useState<'guide' | 'sandbox' | 'quiz'>('guide');
  const [apiKey, setApiKey] = useState('');
  
  // Sandbox State
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseSource, setResponseSource] = useState<'Live' | 'Mock' | 'Custom Mock' | null>(null);
  const [isError, setIsError] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Mock Mode State
  const [isMockMode, setIsMockMode] = useState(false);
  const [editableMockData, setEditableMockData] = useState('');
  
  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);

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
    setIsError(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setHistory([]);
    setShowPreviewModal(false);
    
    // Reset Mock Mode
    setIsMockMode(false);
    if (api) {
        setEditableMockData(JSON.stringify(api.mockResponse, null, 2));
    }
  }, [id, api]); 

  if (!api) {
    return <div className="p-8 text-center text-gray-500 dark:text-slate-400">API not found. <Link to="/" className="text-blue-600">Go Home</Link></div>;
  }

  const handleRun = async () => {
    setLoading(true);
    setResponse(null);
    setIsError(false);
    setShowPreviewModal(false);
    
    const startTime = performance.now();
    let resultStatus: number | null = null;
    let resultSource: 'Live' | 'Mock' | 'Custom Mock' | null = null;
    // Capture config at start of run
    const runConfig = {
        isMockMode,
        apiKey,
        editableMockData
    };

    // Handle Mock Mode
    if (isMockMode) {
        // Simulate network delay
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
        // Handle Live Request
        const result = await runApiRequest(api, apiKey);
        
        setResponse(result.data);
        setResponseStatus(result.status);
        setResponseSource(result.source);
        setIsError(!result.success);
        
        resultStatus = result.status;
        resultSource = result.source;
    }

    const duration = Math.round(performance.now() - startTime);

    // Add to History
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

  const restoreRequest = (item: HistoryItem) => {
    setIsMockMode(item.config.isMockMode);
    setApiKey(item.config.apiKey);
    setEditableMockData(item.config.editableMockData);
    // Clear current results to indicate state change and readiness to re-run
    setResponse(null);
    setResponseStatus(null);
    setResponseSource(null);
    setIsError(false);
    setShowPreviewModal(false);
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

  const getErrorSuggestion = (status: number | null) => {
    if (status === 0) return language === 'pt' 
        ? "Verifique sua conexão ou configurações de CORS. Muitas APIs públicas bloqueiam requisições diretas do navegador."
        : "Check your internet connection or CORS settings. Many public APIs block direct browser requests. Try using a local proxy or backend if developing locally.";
    if (status === 401) return language === 'pt' 
        ? "A Chave da API provavelmente é inválida ou está ausente."
        : "The API Key provided is likely invalid or missing. Check the 'Authentication' section.";
    if (status === 403) return language === 'pt' 
        ? "Acesso Proibido. Você pode estar limitado ou restrito."
        : "Access Forbidden. You may be rate limited or restricted from this resource.";
    if (status === 404) return language === 'pt' 
        ? "Endpoint incorreto ou recurso não existe mais."
        : "The endpoint URL is incorrect or the resource no longer exists.";
    if (status === 429) return language === 'pt' 
        ? "Limite de taxa excedido. Vá com calma."
        : "Rate limit exceeded. Slow down your requests.";
    if (status && status >= 500) return language === 'pt' 
        ? "O servidor externo da API está com problemas."
        : "The external API server is having issues. Try again later.";
    return language === 'pt' 
        ? "Verifique o corpo da resposta abaixo para mensagens de erro específicas."
        : "Check the response body below for specific error messages from the API.";
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
            <p className="text-gray-500 dark:text-slate-400 mt-2 text-lg">{api.description}</p>
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
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'guide' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          {t('tab_guide')}
        </button>
        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'sandbox' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          {t('tab_sandbox')}
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
            activeTab === 'quiz' ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400' : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          {t('tab_quiz')}
        </button>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 md:p-8 min-h-[500px]">
        
        {/* GUIDE TAB */}
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
                  <p>Endpoint: <code className="bg-gray-100 dark:bg-slate-800 px-1 py-0.5 rounded text-gray-800 dark:text-slate-200">{api.endpoint}</code></p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-lg border border-orange-100 dark:border-orange-900/30">
                <h3 className="font-bold text-orange-800 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <Shield size={18} /> {t('security_checklist')}
                </h3>
                <ul className="space-y-2">
                  {api.securityChecklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-orange-800 dark:text-orange-300/80">
                      <span className="mt-1 block w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-lg border border-indigo-100 dark:border-indigo-900/30">
                <h3 className="font-bold text-indigo-800 dark:text-indigo-400 mb-3">{t('try_exercise')}</h3>
                <p className="text-indigo-900 dark:text-indigo-300 text-sm italic">"{api.exercise}"</p>
                <button 
                  onClick={() => setActiveTab('sandbox')}
                  className="mt-4 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase tracking-wide"
                >
                  {t('go_sandbox')} &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SANDBOX TAB */}
        {activeTab === 'sandbox' && (
          <div className="flex flex-col h-full">
            <div className="mb-6">
              {/* Method & Endpoint Row */}
              <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('method_endpoint')}</label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 text-sm font-mono">
                      GET
                    </span>
                    <input 
                      type="text" 
                      readOnly 
                      value={api.endpoint} 
                      className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-gray-500 dark:text-slate-400 sm:text-sm p-2 border focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
              </div>

              {/* Controls Row: Auth & Toggle */}
              <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-4">
                  <div className="flex-1 w-full">
                      {!isMockMode && api.authRequired && (
                        <div className="animate-in fade-in zoom-in-95 duration-200">
                           <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">{t('api_key_optional')}</label>
                           <input 
                             type="password" 
                             placeholder={t('paste_key')} 
                             value={apiKey}
                             onChange={(e) => setApiKey(e.target.value)}
                             className="block w-full rounded-md border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                           />
                        </div>
                      )}
                      {!isMockMode && !api.authRequired && (
                          <div className="h-10 hidden sm:block"></div> 
                      )}
                  </div>

                  <div>
                     <button
                        onClick={() => setIsMockMode(!isMockMode)}
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md border transition-colors ${
                            isMockMode 
                            ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300' 
                            : 'bg-white border-gray-300 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                        }`}
                     >
                        {isMockMode ? <ToggleRight className="text-purple-600 dark:text-purple-400" /> : <ToggleLeft className="text-gray-400" />}
                        <span>{t('mock_mode')}</span>
                     </button>
                  </div>
              </div>

              {/* Editable Mock Area */}
              {isMockMode && (
                  <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1 flex justify-between">
                        <span>{t('mock_response_body')}</span>
                        <span className="text-xs font-normal text-purple-600 dark:text-purple-400">{t('editable_json')}</span>
                    </label>
                    <textarea
                        value={editableMockData}
                        onChange={(e) => setEditableMockData(e.target.value)}
                        className="w-full h-48 font-mono text-sm p-3 rounded-md border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-slate-800/50 text-gray-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500 outline-none resize-y"
                        spellCheck={false}
                    />
                  </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                      loading 
                      ? 'bg-gray-400 dark:bg-slate-700' 
                      : isMockMode 
                        ? 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-600 dark:hover:bg-purple-700'
                        : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
                >
                  {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isMockMode ? t('simulate_response') : t('run_request')}
                </button>
                
                {!isMockMode && api.authRequired && !apiKey && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
                    <AlertTriangle size={12} /> {t('live_requires_key')}
                  </p>
                )}
              </div>
            </div>

            {/* Split Layout: Response (Left) & History (Right) */}
            <div className="flex flex-col lg:flex-row gap-6 items-stretch flex-1 min-h-0">
               <div className="flex-1 flex flex-col min-w-0">
                  {/* Error Banner */}
                  {isError && (
                    <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                      <XCircle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" size={20} />
                      <div className="flex-1">
                        <h4 className="font-bold text-red-800 dark:text-red-300 text-sm">{t('request_failed')} {responseStatus ? `(${t('status')}: ${responseStatus})` : ''}</h4>
                        <p className="text-sm text-red-700 dark:text-red-400 mt-1">{getErrorSuggestion(responseStatus)}</p>
                      </div>
                    </div>
                  )}

                  <div className={`flex-1 bg-slate-900 dark:bg-slate-950 rounded-lg p-4 font-mono text-sm relative min-h-[300px] border transition-colors ${isError ? 'border-red-400 dark:border-red-800' : 'border-transparent dark:border-slate-800'}`}>
                    <div className="absolute top-2 right-2 flex gap-2">
                       {responseStatus !== null && (
                         <span className={`px-2 py-1 rounded text-xs font-bold ${responseStatus >= 200 && responseStatus < 300 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                           {t('status')}: {responseStatus}
                         </span>
                       )}
                       {responseSource && (
                         <span className={`px-2 py-1 rounded text-xs font-bold ${responseSource.includes('Mock') ? 'bg-purple-500 text-white' : 'bg-blue-500 text-white'}`}>
                           {t('source')}: {responseSource}
                         </span>
                       )}
                       {response && !isError && (
                          <button 
                            onClick={() => setShowPreviewModal(true)}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-bold bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 transition-colors"
                          >
                            <Eye size={12} /> {t('view_preview')}
                          </button>
                        )}
                    </div>
                    
                    {loading ? (
                      <div className="flex items-center justify-center h-full text-slate-500">
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCw className="animate-spin text-blue-500" size={32} />
                          <span>{isMockMode ? t('simulating') : t('sending')}</span>
                        </div>
                      </div>
                    ) : response ? (
                      <pre className={`${isError ? 'text-red-300' : 'text-green-400'} overflow-auto max-h-[500px] pr-2 custom-scrollbar`}>
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
                         <div className={`p-3 rounded-full ${isMockMode ? 'bg-purple-900/20 text-purple-500' : 'bg-slate-800'}`}>
                           {isMockMode ? <FileJson size={24} /> : <Code size={24} />}
                         </div>
                         <span>{isMockMode ? t('ready_simulate') : t('ready_run')}</span>
                      </div>
                    )}
                  </div>
               </div>
               
               {/* History Panel (Right) */}
               {history.length > 0 && (
                  <div className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-slate-800 lg:pl-6 pt-6 lg:pt-0 flex flex-col">
                     <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-700 dark:text-slate-300 text-sm flex items-center gap-2">
                            <History size={16} /> {t('request_history')}
                        </h3>
                        <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-600 transition-colors">{t('clear')}</button>
                     </div>
                     <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                        {history.map(item => (
                            <div 
                                key={item.id} 
                                onClick={() => restoreRequest(item)} 
                                className="group p-3 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer transition-all shadow-sm"
                            >
                               <div className="flex justify-between items-start mb-2">
                                  <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${item.status && item.status >= 200 && item.status < 300 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                     {item.status || 'ERR'}
                                  </span>
                                  <span className="text-[10px] text-gray-400">
                                     {item.timestamp.toLocaleTimeString()}
                                  </span>
                               </div>
                               <div className="flex items-center justify-between text-xs text-gray-600 dark:text-slate-400">
                                   <span className="truncate pr-2">{item.source}</span>
                                   <span className="font-mono whitespace-nowrap">{item.duration}ms</span>
                               </div>
                               <div className="mt-2 text-[10px] text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-medium">
                                  <RotateCcw size={10} /> {t('click_restore')}
                               </div>
                            </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </div>
        )}

        {/* QUIZ TAB */}
        {activeTab === 'quiz' && (
          <div className="max-w-xl mx-auto py-8">
            {showScore ? (
              <div className="text-center animate-in zoom-in duration-300">
                <div className="text-6xl mb-4">🏆</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('quiz_completed')}</h3>
                <p className="text-gray-600 dark:text-slate-400 mb-6">{t('scored')} <span className="font-bold text-blue-600 dark:text-blue-400">{score}</span> / {api.quiz.length}</p>
                <button 
                  onClick={() => {
                    setCurrentQuestion(0);
                    setScore(0);
                    setShowScore(false);
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {t('restart_quiz')}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-sm text-gray-500 dark:text-slate-400 mb-4">
                  <span>{t('question')} {currentQuestion + 1} / {api.quiz.length}</span>
                  <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs">Score: {score}</span>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-100 dark:border-slate-800 mb-6">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {api.quiz[currentQuestion].question}
                   </h3>
                </div>

                <div className="space-y-3">
                  {api.quiz[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswerOptionClick(idx)}
                      className="w-full text-left p-4 rounded-lg border border-gray-200 dark:border-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between group"
                    >
                      <span>{option}</span>
                      <ArrowRight className="opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all text-blue-500" size={16} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rendered Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowPreviewModal(false)}>
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6 relative animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800" onClick={e => e.stopPropagation()}>
                <button onClick={() => setShowPreviewModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white transition-colors">
                    <XCircle size={24} />
                </button>
                <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white border-b dark:border-slate-800 pb-3">{t('rendered_preview')}</h3>
                <div className="flex justify-center p-8 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-800">
                    <ApiPreview id={api.id} data={response} />
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default ApiGuide;
