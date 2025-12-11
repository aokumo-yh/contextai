import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Language } from '../types';
import { languageData, commonLanguages, languagesByRegion, searchLanguages, getLanguageInfo } from '../languageData';

interface LanguageSelectorProps {
  value: Language;
  onChange: (value: Language) => void;
  label: string;
  disabled?: boolean;
}

export function LanguageSelector({ value, onChange, label, disabled }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedLang = getLanguageInfo(value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: Language) => {
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredLanguages = searchQuery ? searchLanguages(searchQuery) : languageData;
  const showSections = !searchQuery;

  return (
    <div className="mb-4 relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-white border-2 rounded-lg text-left flex items-center justify-between transition-all ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : isOpen
            ? 'border-[#0E71EB] ring-2 ring-blue-100'
            : 'border-gray-300 hover:border-[#0E71EB]'
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="text-xl">{selectedLang?.flag}</span>
          <span className="font-medium text-gray-800">{selectedLang?.nativeName}</span>
        </span>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-[#0E71EB] rounded-lg shadow-2xl max-h-[480px] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0E71EB] focus:border-transparent"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {showSections ? (
              <>
                <div className="px-2 py-1.5 bg-gray-100 border-b border-gray-200">
                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide px-2">
                    Common
                  </h4>
                </div>
                {commonLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                      value === lang.code ? 'bg-blue-50 border-l-4 border-[#0E71EB]' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium text-gray-800">{lang.nativeName}</span>
                  </button>
                ))}

                {Object.entries(languagesByRegion).map(([region, languages]) => (
                  <div key={region}>
                    <div className="px-2 py-1.5 bg-gray-100 border-y border-gray-200 mt-1">
                      <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wide px-2">
                        {region}
                      </h4>
                    </div>
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleSelect(lang.code)}
                        className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                          value === lang.code ? 'bg-blue-50 border-l-4 border-[#0E71EB]' : ''
                        }`}
                      >
                        <span className="text-xl">{lang.flag}</span>
                        <span className="font-medium text-gray-800">{lang.nativeName}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </>
            ) : filteredLanguages.length > 0 ? (
              filteredLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-3 ${
                    value === lang.code ? 'bg-blue-50 border-l-4 border-[#0E71EB]' : ''
                  }`}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">{lang.nativeName}</span>
                    <span className="text-xs text-gray-500">{lang.name}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <p className="text-sm">No languages found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
