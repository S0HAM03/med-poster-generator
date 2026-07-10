import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function usePosterExport() {
  const exportPoster = async (elementRef, filename = 'medication-schedule.pdf') => {
    if (!elementRef.current) return;
    
    try {
      // Create high-density rasterized image
      // Target A4 at 300DPI equivalent roughly is achieved by scaling up
      const canvas = await html2canvas(elementRef.current, {
        scale: 4, // Multiplier for 300 DPI
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 dimensions in mm: 210 x 297
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(filename);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return { exportPoster };
}
