import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  FileSpreadsheet, 
  Key, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  HelpCircle,
  Copy,
  Download,
  Database
} from 'lucide-react';
import { SheetConnectionConfig } from '../types';

interface ConnectionSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConnectionConfig;
  onSave: (config: SheetConnectionConfig) => void;
  onTestConnection: (testConfig: SheetConnectionConfig) => Promise<{ success: boolean; message: string; rowCount?: number }>;
}

export const ConnectionSettingsModal: React.FC<ConnectionSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  onTestConnection
}) => {
  const [formData, setFormData] = useState<SheetConnectionConfig>({ ...config });
  const [rawSheetUrl, setRawSheetUrl] = useState<string>(config.spreadsheetId || '');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testResult, setTestResult] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'settings' | 'guide' | 'gas'>('settings');
  const [copiedGas, setCopiedGas] = useState<boolean>(false);

  if (!isOpen) return null;

  // Extract Google Spreadsheet ID from URL if pasted
  const handleUrlChange = (value: string) => {
    setRawSheetUrl(value);
    const trimmed = value.trim();
    // Check if it's a full Google Sheets URL
    const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      setFormData(prev => ({ ...prev, spreadsheetId: match[1], isCustomConfigured: true }));
    } else {
      setFormData(prev => ({ ...prev, spreadsheetId: trimmed, isCustomConfigured: trimmed !== '' }));
    }
  };

  const handleRunTest = async () => {
    setTestStatus('testing');
    setTestResult('Connecting to Google Sheets...');
    try {
      const res = await onTestConnection(formData);
      if (res.success) {
        setTestStatus('success');
        setTestResult(res.message);
      } else {
        setTestStatus('error');
        setTestResult(res.message);
      }
    } catch (err: any) {
      setTestStatus('error');
      setTestResult(err.message || 'Connection test failed');
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleResetToVerified = () => {
    const resetConfig: SheetConnectionConfig = {
      spreadsheetId: '',
      participationTabName: 'Participation',
      winnersTabName: 'Winners',
      connectionMode: 'gviz',
      autoRefreshInterval: 30,
      isCustomConfigured: false
    };
    setFormData(resetConfig);
    setRawSheetUrl('');
    setTestStatus('idle');
    setTestResult('');
    onSave(resetConfig);
  };

  const sampleGasCode = `// Google Apps Script - PEC Hackathon Dashboard Sync
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var partSheet = ss.getSheetByName("Participation") || ss.getSheets()[0];
  var winSheet = ss.getSheetByName("Winners") || (ss.getSheets().length > 1 ? ss.getSheets()[1] : null);
  
  function getSheetData(sheet) {
    if (!sheet) return [];
    var data = sheet.getDataRange().getValues();
    if (data.length < 2) return [];
    var headers = data[0];
    var rows = [];
    for (var i = 1; i < data.length; i++) {
      var rowObj = {};
      for (var j = 0; j < headers.length; j++) {
        rowObj[headers[j]] = data[i][j];
      }
      rows.push(rowObj);
    }
    return rows;
  }
  
  var payload = {
    status: "success",
    timestamp: new Date().toISOString(),
    participation: getSheetData(partSheet),
    winners: getSheetData(winSheet)
  };
  
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}`;

  const copyGasCode = () => {
    navigator.clipboard.writeText(sampleGasCode);
    setCopiedGas(true);
    setTimeout(() => setCopiedGas(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-elevated border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-navy-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-navy-800 rounded-lg border border-navy-700">
              <FileSpreadsheet className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Google Sheets Data Connection Manager
              </h3>
              <p className="text-xs text-navy-200">
                Configure your live spreadsheet as the single source of truth
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-navy-300 hover:text-white rounded-lg hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'settings' 
                ? 'border-pec-blue text-navy-950 bg-white' 
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            Spreadsheet Settings
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'guide' 
                ? 'border-pec-blue text-navy-950 bg-white' 
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            Sharing & Permission Guide
          </button>
          <button
            onClick={() => setActiveTab('gas')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'gas' 
                ? 'border-pec-blue text-navy-950 bg-white' 
                : 'border-transparent text-slate-500 hover:text-navy-900'
            }`}
          >
            Google Apps Script (Private API)
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          
          {activeTab === 'settings' && (
            <div className="space-y-4">
              
              {/* Spreadsheet URL / ID Input */}
              <div>
                <label className="block text-xs font-bold text-navy-950 mb-1">
                  Google Sheet URL or Spreadsheet ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="https://docs.google.com/spreadsheets/d/1abc.../edit or 1abc..."
                    value={rawSheetUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs text-slate-900"
                  />
                </div>
                {formData.spreadsheetId && (
                  <p className="mt-1 text-[11px] text-slate-500 font-mono">
                    Extracted ID: <b className="text-navy-900">{formData.spreadsheetId}</b>
                  </p>
                )}
                <p className="mt-1 text-[11px] text-slate-500">
                  Tip: Copy the link directly from your browser when viewing your Google Sheet.
                </p>
              </div>

              {/* Sheet Tab Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Participation Tab Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Participation or Sheet1"
                    value={formData.participationTabName}
                    onChange={(e) => setFormData({ ...formData, participationTabName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Default: "Participation"</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Winners Tab Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Winners or Achievers or Sheet2"
                    value={formData.winnersTabName}
                    onChange={(e) => setFormData({ ...formData, winnersTabName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Default: "Winners"</span>
                </div>
              </div>

              {/* Protocol and Auto-Refresh */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Synchronization Protocol
                  </label>
                  <select
                    value={formData.connectionMode}
                    onChange={(e) => setFormData({ ...formData, connectionMode: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="gviz">Google Visualization API (Recommended, No Key)</option>
                    <option value="csv">Google Sheets Published CSV</option>
                    <option value="gas">Google Apps Script Web App Endpoint</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Auto-Refresh Interval
                  </label>
                  <select
                    value={formData.autoRefreshInterval}
                    onChange={(e) => setFormData({ ...formData, autoRefreshInterval: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value={15}>Every 15 Seconds (Rapid Testing)</option>
                    <option value={30}>Every 30 Seconds (Default)</option>
                    <option value={60}>Every 60 Seconds (Standard)</option>
                    <option value={120}>Every 2 Minutes</option>
                    <option value={0}>Disabled (Manual Refresh Only)</option>
                  </select>
                </div>
              </div>

              {/* Optional GAS URL */}
              {formData.connectionMode === 'gas' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Google Apps Script Web App URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={formData.gasWebAppUrl || ''}
                    onChange={(e) => setFormData({ ...formData, gasWebAppUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                </div>
              )}

              {/* Live Test Action and Diagnostic Feedback */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleRunTest}
                    disabled={testStatus === 'testing' || !formData.spreadsheetId}
                    className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-pec-blue border border-blue-200 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
                    <span>Test Live Connection</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetToVerified}
                    className="px-3 py-2 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs transition-colors"
                  >
                    Reset to Verified PEC Records
                  </button>
                </div>

                {testResult && (
                  <div className={`mt-3 p-3 rounded-lg text-xs flex items-start gap-2 ${
                    testStatus === 'success' 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {testStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{testStatus === 'success' ? 'Connection Successful!' : 'Connection Check Failed'}</p>
                      <p className="mt-0.5">{testResult}</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-3 text-slate-700">
              <h4 className="font-bold text-navy-950 text-sm">
                How to make your Google Sheet readable by the Dashboard:
              </h4>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1">
                <p className="font-semibold">Option A (Easiest - Public Link with Google Visualization API):</p>
                <ol className="list-decimal pl-5 space-y-1 mt-1 text-slate-700">
                  <li>Open your Google Sheet in your web browser.</li>
                  <li>Click the green <b>Share</b> button in the top right.</li>
                  <li>Under <b>General access</b>, change from "Restricted" to <b>"Anyone with the link"</b>.</li>
                  <li>Set role to <b>"Viewer"</b>.</li>
                  <li>Click <b>Copy link</b> and paste it into the Spreadsheet URL box above.</li>
                  <li>That's it! No API keys, credentials, or billing required.</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-semibold text-slate-900">Required Column Names in Your Google Sheet:</p>
                <p className="text-[11px] text-slate-500">
                  The dashboard automatically parses the following columns (case-insensitive):
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <b className="font-sans block text-navy-950 mb-1">Participation Sheet:</b>
                    • S.No<br/>
                    • Title of the Hackathon<br/>
                    • Expected Teams<br/>
                    • Expected No. of Students<br/>
                    • Teams Registered/Participated<br/>
                    • No. of Students Participated<br/>
                    • Status/Won<br/>
                    • Follow-Up/Completed
                  </div>
                  <div className="bg-white p-2 rounded border border-slate-200">
                    <b className="font-sans block text-navy-950 mb-1">Winners Sheet:</b>
                    • S.No<br/>
                    • Student Name<br/>
                    • Department and Year<br/>
                    • Hackathon Name<br/>
                    • Event Date<br/>
                    • Award / Prize Position<br/>
                    • Prize Money
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gas' && (
            <div className="space-y-3 text-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-navy-950 text-sm">
                    Private Spreadsheet Google Apps Script Endpoint
                  </h4>
                  <p className="text-xs text-slate-500">
                    If your spreadsheet contains internal data and cannot be public, deploy this script:
                  </p>
                </div>
                <button
                  onClick={copyGasCode}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs flex items-center gap-1 border border-slate-300"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedGas ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3 rounded-lg font-mono text-[11px] overflow-x-auto max-h-48">
                <pre>{sampleGasCode}</pre>
              </div>

              <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
                <li>In your Google Sheet, click <b>Extensions &gt; Apps Script</b>.</li>
                <li>Paste the code above into the script editor.</li>
                <li>Click <b>Deploy &gt; New deployment</b>.</li>
                <li>Select type: <b>Web app</b>.</li>
                <li>Set Execute as: <b>Me</b>, and Who has access: <b>Anyone</b>.</li>
                <li>Copy the resulting Web app URL and paste it into the settings.</li>
              </ol>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Stored locally in browser and `.env` · Zero credentials exposed
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-navy-950 text-white font-semibold rounded-lg text-xs hover:bg-navy-900 transition-colors shadow-sm"
            >
              Save & Apply Settings
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
