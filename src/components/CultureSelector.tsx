import { Culture } from '../types';

interface CultureSelectorProps {
  label: string;
  value: Culture;
  onChange: (value: Culture) => void;
  disabled?: boolean;
}

const cultures: Culture[] = ['US Tech', 'Japanese Corporate', 'German Business'];

export function CultureSelector({ label, value, onChange, disabled }: CultureSelectorProps) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Culture)}
        disabled={disabled}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0E71EB] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
      >
        {cultures.map((culture) => (
          <option key={culture} value={culture}>
            {culture}
          </option>
        ))}
      </select>
    </div>
  );
}
