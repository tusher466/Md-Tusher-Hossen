import React from 'react';
import { Language, translations } from '../locales/translations';
import { Globe, Upload, Download } from 'lucide-react';
import { Logo } from './Logo';

interface HeaderProps {
  currentLang: Language;
  onToggleLang: () => void;
  activeTab: 'overview' | 'files' | 'matching' | 'generate';
  onSelectTab: (tab: 'overview' | 'files' | 'matching' | 'generate') => void;
  onOpenCustomJson: () => void;
  onExportProject: () => void;
  onImportProject: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onToggleLang,
  activeTab,
  onSelectTab,
  onOpenCustomJson,
  onExportProject,
  onImportProject
}) => {
  const t = translations[currentLang];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-emerald-100 text-slate-900 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Upgraded Brand Logo & Title */}
          <div className="flex items-center gap-3">
            {/* Custom Modern Leaf Document Vector Logo */}
            <Logo size={38} className="w-[38px] h-[38px]" />

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 block leading-tight">
                  {t.appTitle}
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  v2.0
                </span>
              </div>
              <span className="text-[11px] text-emerald-800/70 block leading-none font-medium mt-0.5">
                {t.appSubtitle}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => onSelectTab('overview')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              {t.navOverview}
            </button>
            <button
              onClick={() => onSelectTab('files')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'files'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              {t.navFiles}
            </button>
            <button
              onClick={() => onSelectTab('matching')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                activeTab === 'matching'
                  ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/50'
              }`}
            >
              {t.navRequirements}
            </button>
            <button
              onClick={() => onSelectTab('generate')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'generate'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100/70 border border-emerald-200/80'
              }`}
            >
              {t.navGenerate}
            </button>
          </nav>

          {/* Zone 3: Actions & Language Switch */}
          <div className="flex items-center gap-2">
            {/* Hidden File Input for Project Import */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={onImportProject}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              title={t.loadProjectJson}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100/80 rounded-lg border border-emerald-200/80 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.loadProjectJson}</span>
            </button>

            <button
              onClick={onExportProject}
              title={t.saveProjectJson}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-emerald-800 hover:text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100/80 rounded-lg border border-emerald-200/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t.saveProjectJson}</span>
            </button>

            {/* Language Toggle Button */}
            <button
              onClick={onToggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200 rounded-lg transition-colors shadow-2xs"
              title="Toggle Language / ভাষা পরিবর্তন"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currentLang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
