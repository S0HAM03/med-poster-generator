import { useState, useRef } from 'react';

export default function MedicationRowItem({ item, updateItem, deleteItem }) {
  const [deleteStep, setDeleteStep] = useState(0); // 0: safe, 1: unlocked, 2: deleting
  const holdTimeoutRef = useRef(null);

  const toggleSchedule = (time) => {
    updateItem(item.id, {
      schedule: {
        ...item.schedule,
        [time]: !item.schedule[time]
      }
    });
  };

  const handleHoldStart = () => {
    holdTimeoutRef.current = setTimeout(() => {
      deleteItem(item.id);
    }, 1500);
  };

  const handleHoldEnd = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
    }
  };

  const handleDeleteTap = () => {
    if (deleteStep === 0) {
      setDeleteStep(1);
      setTimeout(() => setDeleteStep(0), 3000); // lock again after 3s
    } else if (deleteStep === 1) {
      deleteItem(item.id);
    }
  };

  const timeBlocks = [
    { key: 'morning', label: 'Morning', color: 'amber' },
    { key: 'afternoon', label: 'Afternoon', color: 'orange' },
    { key: 'night', label: 'Night', color: 'indigo' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-2">Medicine Name</label>
          <input 
            type="text" 
            value={item.medicineName}
            onChange={(e) => updateItem(item.id, { medicineName: e.target.value })}
            className="w-full text-xl p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-2">Dosage</label>
          <input 
            type="text" 
            value={item.dosage}
            onChange={(e) => updateItem(item.id, { dosage: e.target.value })}
            className="w-full text-xl p-4 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-xl font-bold text-gray-900 mb-3">Schedule</label>
        <div className="grid grid-cols-3 gap-4">
          {timeBlocks.map(({ key, label, color }) => {
            const isActive = item.schedule[key];
            return (
              <button
                key={key}
                onClick={() => toggleSchedule(key)}
                className={`py-4 px-2 rounded-lg border-4 text-lg font-bold transition-all
                  ${isActive 
                    ? `bg-${color}-50 border-${color}-400 text-${color}-950` 
                    : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-300'}`}
              >
                {isActive && <span className="mr-2">✓</span>}
                {label}
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-2">Food Instruction</label>
          <select
            value={item.mealInstruction}
            onChange={(e) => updateItem(item.id, { mealInstruction: e.target.value })}
            className="w-full text-xl p-4 border-2 border-gray-300 rounded-lg bg-white"
          >
            <option value="Before Food">Before Food</option>
            <option value="After Food">After Food</option>
            <option value="Independent">Independent</option>
          </select>
        </div>
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-2">Special Notes</label>
          <input 
            type="text" 
            value={item.specialNotes || ''}
            onChange={(e) => updateItem(item.id, { specialNotes: e.target.value })}
            placeholder="e.g., Take with water"
            className="w-full text-xl p-4 border-2 border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-100">
        <button
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
          onClick={handleDeleteTap}
          className={`py-3 px-6 rounded-lg font-bold text-lg border-2 transition-colors
            ${deleteStep === 0 ? 'border-gray-200 text-gray-500 hover:bg-gray-50' : 'border-rose-400 bg-rose-50 text-rose-700'}`}
        >
          {deleteStep === 0 ? 'Tap to Unlock Delete' : 'Tap again to Delete (or Hold)'}
        </button>
      </div>
    </div>
  );
}
