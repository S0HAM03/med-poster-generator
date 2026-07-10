import MedicationRowItem from './MedicationRowItem';

export default function VerificationForm({ data, setData, imageSrc, onGenerate }) {
  
  const updateItem = (id, changes) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.map(item => 
        item.id === id ? { ...item, ...changes } : item
      )
    }));
  };

  const deleteItem = (id) => {
    setData(prev => ({
      ...prev,
      medications: prev.medications.filter(item => item.id !== id)
    }));
  };

  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      medicineName: "",
      dosage: "",
      schedule: { morning: false, afternoon: false, night: false },
      mealInstruction: "Independent",
      specialNotes: ""
    };
    setData(prev => ({
      ...prev,
      medications: [...prev.medications, newItem]
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-4 sm:p-8">
      {/* Left Pane - Image Preview */}
      <div className="lg:w-1/3">
        <div className="sticky top-8 bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200" style={{ maxHeight: '80vh' }}>
          <div className="p-4 bg-gray-800 text-white font-bold">Original Prescription</div>
          <div className="overflow-auto p-2 h-full cursor-zoom-in">
            {imageSrc && <img src={imageSrc} alt="Prescription" className="w-full h-auto object-contain" />}
          </div>
        </div>
      </div>
      
      {/* Right Pane - Editor */}
      <div className="lg:w-2/3">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Medicines</h2>
          <p className="text-xl text-gray-600">Please check the details below. You can edit any mistakes made by the AI.</p>
        </div>

        {data?.medications?.map(item => (
          <MedicationRowItem 
            key={item.id} 
            item={item} 
            updateItem={updateItem} 
            deleteItem={deleteItem} 
          />
        ))}

        <button 
          onClick={addItem}
          className="w-full py-6 border-4 border-dashed border-gray-300 rounded-xl text-2xl font-bold text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors mb-8"
        >
          + Add Another Medicine Manually
        </button>

        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0">
            <h3 className="text-xl font-bold text-indigo-950">Ready to create your poster?</h3>
            <p className="text-indigo-800">Make sure all details match the prescription.</p>
          </div>
          <button 
            onClick={onGenerate}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xl font-bold py-4 px-8 rounded-lg shadow-lg"
          >
            Confirm & Generate
          </button>
        </div>
      </div>
    </div>
  );
}
