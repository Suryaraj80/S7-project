import React, { useState } from 'react';
import { 
  CloudSun, 
  CloudRain, 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  MapPin, 
  Thermometer, 
  Calendar,
  Compass,
  ArrowRight,
  Printer,
  Download
} from 'lucide-react';
import { TN_DISTRICT_WEATHER } from '../data/tamilNaduData';
import { Language } from '../types';
import { printHtmlSafely, downloadHtmlFile } from '../utils/printAndDownloadService';

interface WeatherWidgetProps {
  language: Language;
  currentDistrict?: string;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  language,
  currentDistrict = 'Thanjavur'
}) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string>(
    TN_DISTRICT_WEATHER.some(d => d.district.toLowerCase() === currentDistrict.toLowerCase())
      ? currentDistrict
      : 'Thanjavur'
  );

  const activeWeather = TN_DISTRICT_WEATHER.find(
    d => d.district.toLowerCase() === selectedDistrictName.toLowerCase()
  ) || TN_DISTRICT_WEATHER[0];

  const districtLabel = language === 'ta' ? activeWeather.district_ta : activeWeather.district;
  const conditionLabel = language === 'ta' ? activeWeather.condition_ta : activeWeather.condition;
  const advisoryText = language === 'ta' ? activeWeather.agroAdvisory_ta : activeWeather.agroAdvisory;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-6">
      
      {/* Header & District Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
              Tamil Nadu Agro-Met
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-1.5">
              <CloudSun className="w-5 h-5 text-emerald-700" />
              <span>{language === 'ta' ? 'தமிழ்நாடு வேளாண் வானிலை அறிக்கை' : 'Tamil Nadu Agro-Weather Report'}</span>
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time district weather metrics and localized agricultural advisories for Tamil Nadu farmers.
          </p>
        </div>

        {/* District Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-700" />
            <select
              value={selectedDistrictName}
              onChange={e => setSelectedDistrictName(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold border border-stone-300 rounded-lg bg-stone-50 focus:outline-none focus:ring-1 focus:ring-emerald-600 text-stone-900"
            >
              {TN_DISTRICT_WEATHER.map(d => (
                <option key={d.district} value={d.district}>
                  {language === 'ta' ? `${d.district_ta} (${d.district})` : d.district}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              const html = `<!DOCTYPE html><html><head><title>Agro-Weather Advisory - ${activeWeather.district}</title><style>body{font-family:sans-serif;padding:24px;color:#1c1917;} h1{color:#065f46;margin-bottom:4px;} .box{border:1px solid #d6d3d1;padding:14px;border-radius:8px;margin:16px 0;background:#fafaf9;} .print-btn{background:#065f46;color:#fff;border:none;padding:8px 16px;border-radius:6px;float:right;cursor:pointer;} @media print{.print-btn{display:none;}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save PDF</button><h1>TAMIL NADU AGRO-WEATHER ADVISORY</h1><p><strong>District:</strong> ${activeWeather.district} (${activeWeather.district_ta}) · <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p><div class="box"><h3>Current Metrics</h3><p><strong>Temperature:</strong> ${activeWeather.tempCurrent}°C | <strong>Condition:</strong> ${activeWeather.condition} | <strong>Rain Probability:</strong> ${activeWeather.rainProbability}% | <strong>Humidity:</strong> ${activeWeather.humidity}%</p></div><div class="box" style="background:#ecfdf5;border-color:#a7f3d0;"><h3>Farmer Advisory</h3><p>${language === 'ta' ? activeWeather.agroAdvisory_ta : activeWeather.agroAdvisory}</p></div></body></html>`;
              downloadHtmlFile(`Agro-Weather-Report-${activeWeather.district}.html`, html);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-lg flex items-center gap-1 transition-colors"
            title="Download Weather Advisory HTML report"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span>Download</span>
          </button>

          <button
            onClick={() => {
              const html = `<!DOCTYPE html><html><head><title>Agro-Weather Advisory - ${activeWeather.district}</title><style>body{font-family:sans-serif;padding:24px;color:#1c1917;} h1{color:#065f46;margin-bottom:4px;} .box{border:1px solid #d6d3d1;padding:14px;border-radius:8px;margin:16px 0;background:#fafaf9;} .print-btn{background:#065f46;color:#fff;border:none;padding:8px 16px;border-radius:6px;float:right;cursor:pointer;} @media print{.print-btn{display:none;}}</style></head><body><button class="print-btn" onclick="window.print()">Print / Save PDF</button><h1>TAMIL NADU AGRO-WEATHER ADVISORY</h1><p><strong>District:</strong> ${activeWeather.district} (${activeWeather.district_ta}) · <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p><div class="box"><h3>Current Metrics</h3><p><strong>Temperature:</strong> ${activeWeather.tempCurrent}°C | <strong>Condition:</strong> ${activeWeather.condition} | <strong>Rain Probability:</strong> ${activeWeather.rainProbability}% | <strong>Humidity:</strong> ${activeWeather.humidity}%</p></div><div class="box" style="background:#ecfdf5;border-color:#a7f3d0;"><h3>Farmer Advisory</h3><p>${language === 'ta' ? activeWeather.agroAdvisory_ta : activeWeather.agroAdvisory}</p></div></body></html>`;
              printHtmlSafely(html, `Agro-Weather-Report-${activeWeather.district}.html`);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg flex items-center gap-1 transition-colors"
            title="Print Weather Advisory"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-700" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Weather Hero Card */}
      <div className="p-6 rounded-2xl bg-radial from-emerald-900 via-emerald-950 to-stone-950 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Temperature & Condition */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{districtLabel}, Tamil Nadu</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight">
                {activeWeather.tempCurrent}°
              </span>
              <span className="text-xl text-stone-300 font-sans">C</span>
            </div>
            <div className="text-sm font-semibold text-emerald-200">
              {conditionLabel}
            </div>
            <div className="text-xs text-stone-400 font-mono">
              Min: {activeWeather.tempMin}°C · Max: {activeWeather.tempMax}°C
            </div>
          </div>

          {/* Environmental Gauges */}
          <div className="grid grid-cols-3 gap-2 bg-stone-900/60 p-3.5 rounded-xl border border-stone-800 text-center text-xs">
            <div className="space-y-1">
              <Droplets className="w-4 h-4 mx-auto text-blue-400" />
              <span className="text-[10px] text-stone-400 block font-medium">Humidity</span>
              <span className="font-mono font-bold text-white text-sm">{activeWeather.humidity}%</span>
            </div>

            <div className="space-y-1 border-x border-stone-800">
              <CloudRain className="w-4 h-4 mx-auto text-cyan-400" />
              <span className="text-[10px] text-stone-400 block font-medium">Rain Prob</span>
              <span className="font-mono font-bold text-white text-sm">{activeWeather.rainProbability}%</span>
            </div>

            <div className="space-y-1">
              <Wind className="w-4 h-4 mx-auto text-amber-300" />
              <span className="text-[10px] text-stone-400 block font-medium">Wind Speed</span>
              <span className="font-mono font-bold text-white text-sm">{activeWeather.windSpeed} km/h</span>
            </div>
          </div>

          {/* Localized Agro-Advisory */}
          <div className="p-3.5 rounded-xl bg-emerald-900/40 border border-emerald-700/60 space-y-1.5">
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">
              🌾 {language === 'ta' ? 'உழவர் வேளாண் வழிகாட்டுதல்' : 'Field Agro-Advisory'}
            </span>
            <p className="text-xs text-stone-200 leading-relaxed font-medium">
              "{advisoryText}"
            </p>
          </div>

        </div>
      </div>

      {/* 5-Day Forecast Strip */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-500" />
          <span>{language === 'ta' ? '5 நாட்கள் வானிலை முன்னறிவிப்பு' : '5-Day Weather Outlook'}</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {activeWeather.forecast.map((f, i) => (
            <div 
              key={i}
              className={`p-3 rounded-xl border text-center text-xs transition-all ${
                i === 0 
                  ? 'bg-emerald-50 border-emerald-300 shadow-2xs font-semibold' 
                  : 'bg-stone-50 border-stone-200'
              }`}
            >
              <span className="text-[11px] text-stone-600 block mb-1">
                {language === 'ta' ? f.day_ta : f.day}
              </span>
              <div className="my-1.5 flex justify-center">
                {f.rainProb > 50 ? (
                  <CloudRain className="w-5 h-5 text-blue-600" />
                ) : f.rainProb > 25 ? (
                  <CloudSun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-600" />
                )}
              </div>
              <span className="font-mono font-bold text-stone-900 block text-sm">
                {f.temp}°C
              </span>
              <span className="text-[10px] text-blue-700 block font-mono mt-0.5">
                {f.rainProb}% rain
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
