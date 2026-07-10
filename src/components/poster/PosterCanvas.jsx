import { forwardRef } from 'react';
import { translations } from '../../utils/translations';

// Icons using solid SVG paths
const SunMorning = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.758a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
  </svg>
);

const SunAfternoon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM21 16.5a2.25 2.25 0 01-2.25 2.25h-13.5a2.25 2.25 0 01-2.25-2.25v-.32a3.75 3.75 0 013.75-3.75h12A3.75 3.75 0 0121 16.18v.32z" />
  </svg>
);

const MoonNight = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
  </svg>
);

const PlateEmpty = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8">
    <circle cx="12" cy="12" r="9" />
    <path d="M7 12h10" strokeDasharray="2 2" />
  </svg>
);

const PlateFull = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <circle cx="12" cy="12" r="9" />
    <path d="M7 12h10M9 9h6M9 15h6" stroke="white" strokeWidth="2" />
  </svg>
);

const MedicineCard = ({ med, t }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 mb-4 flex items-center justify-between shadow-sm">
      <div className="flex flex-col w-2/3">
        <h3 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">{med.medicineName}</h3>
        <p className="text-2xl font-bold text-gray-600">{med.dosage}</p>
        {med.specialNotes && (
          <p className="text-xl font-medium text-rose-700 mt-2">*{med.specialNotes}</p>
        )}
      </div>
      
      <div className="flex flex-col items-center justify-center w-1/3 border-l-2 border-gray-100 pl-4">
        {med.mealInstruction === 'Before Food' && (
          <>
            <PlateEmpty />
            <span className="text-xl font-bold mt-1 text-gray-700">{t.beforeFood}</span>
          </>
        )}
        {med.mealInstruction === 'After Food' && (
          <>
            <PlateFull />
            <span className="text-xl font-bold mt-1 text-gray-700">{t.afterFood}</span>
          </>
        )}
        {med.mealInstruction === 'Independent' && (
          <span className="text-xl font-bold text-gray-500">{t.independent}</span>
        )}
      </div>
    </div>
  );
};

const TimeBlockSection = ({ title, icon, colorClass, medicines, t }) => {
  if (!medicines || medicines.length === 0) return null;

  return (
    <div className={`mb-8 border-l-8 rounded-r-2xl p-6 ${colorClass}`}>
      <div className="flex items-center mb-6">
        <div className="mr-4">{icon}</div>
        <h2 className="text-4xl font-black uppercase">{title}</h2>
      </div>
      <div>
        {medicines.map((med, idx) => (
          <MedicineCard key={idx} med={med} t={t} />
        ))}
      </div>
    </div>
  );
};

const PosterCanvas = forwardRef(({ data, lang = 'en' }, ref) => {
  const patientName = data.patientName || "Patient";
  const t = translations[lang] || translations.en;
  
  // Grouping
  const morningMeds = data.medications.filter(m => m.schedule.morning && m.mealInstruction !== 'SOS');
  const afternoonMeds = data.medications.filter(m => m.schedule.afternoon && m.mealInstruction !== 'SOS');
  const nightMeds = data.medications.filter(m => m.schedule.night && m.mealInstruction !== 'SOS');
  const sosMeds = data.medications.filter(m => m.schedule.sos || m.specialNotes?.toLowerCase().includes('sos') || m.mealInstruction === 'SOS');

  return (
    <div className="bg-gray-100 flex justify-center py-8">
      {/* 
        A4 aspect ratio wrapper: 
        Width is fixed at 1200px (to simulate high density before html2canvas scaling)
        Height is 1200 * 1.414 = ~1697px
      */}
      <div 
        ref={ref}
        className="bg-white shadow-2xl relative"
        style={{ width: '1200px', minHeight: '1697px', padding: '60px', letterSpacing: 'normal' }}
      >
        <div className="border-b-4 border-gray-900 pb-6 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-gray-900">{patientName}'s Medicine Schedule</h1>
            <p className="text-2xl text-gray-500 mt-2 font-bold">Daily Routine Poster</p>
          </div>
          <div className="text-2xl font-bold text-gray-400">
            {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="space-y-6">
          <TimeBlockSection 
            title={t.morning} 
            icon={<SunMorning />} 
            colorClass="bg-amber-50 border-amber-400 text-amber-950" 
            medicines={morningMeds} 
            t={t}
          />
          <TimeBlockSection 
            title={t.afternoon} 
            icon={<SunAfternoon />} 
            colorClass="bg-orange-50 border-orange-400 text-orange-950" 
            medicines={afternoonMeds} 
            t={t}
          />
          <TimeBlockSection 
            title={t.night} 
            icon={<MoonNight />} 
            colorClass="bg-indigo-50 border-indigo-400 text-indigo-950" 
            medicines={nightMeds} 
            t={t}
          />
          <TimeBlockSection 
            title={t.sos} 
            icon={<div className="text-4xl font-black">!</div>} 
            colorClass="bg-rose-50 border-rose-400 text-rose-950" 
            medicines={sosMeds} 
            t={t}
          />
        </div>

        <div className="absolute bottom-6 left-12 right-12 text-center pt-4 border-t-2 border-gray-200">
          <p className="text-lg font-bold text-gray-400">
            Disclaimer: This application is an AI-powered visual assistance utility designed exclusively for organization and readability reinforcement. It does not provide medical validation, clinical diagnostic reviews, or treatment evaluations. The user assumes absolute responsibility to carefully cross-reference and verify the generated layout accuracy against the original official physician prescription prior to finalizing physical printing procedures.
          </p>
        </div>
      </div>
    </div>
  );
});

export default PosterCanvas;
