export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 pt-12 pb-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to Correctly Read Complex Doctor Prescription Abbreviations</h2>
            <p className="text-gray-700 text-base">
              Doctors often use Latin abbreviations like OD (Morning), BD (Twice a day), and TDS (Three times a day). MedPoster AI automatically translates these complex codes into simple, visual time blocks to ensure safe medication routines.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Best Practices for Organizing Senior Citizen Healthcare Cards at Home</h2>
            <p className="text-gray-700 text-base">
              Physical ambient reminders placed in high-traffic areas, like the refrigerator door, drastically improve medication adherence. Use high-contrast colors and large text to make checking the daily schedule effortless.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">The Importance of Physical Ambient Reminders in Geriatric Care</h2>
            <p className="text-gray-700 text-base">
              Digital apps often fail due to notification fatigue and small screens. A physical A4 poster creates zero-friction visibility. Our system requires no login, no data storage, and generates a print-ready PDF instantly.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center text-base text-gray-500">
          <p>© {new Date().getFullYear()} MedPoster AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0 flex-wrap justify-center">
            <a href="#" className="hover:text-indigo-950 underline decoration-gray-300 underline-offset-4">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-950 underline decoration-gray-300 underline-offset-4">Terms of Service</a>
            <a href="#" className="hover:text-indigo-950 underline decoration-gray-300 underline-offset-4">Cookie Policy</a>
            <a href="#" className="hover:text-indigo-950 underline decoration-gray-300 underline-offset-4">Contact Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
