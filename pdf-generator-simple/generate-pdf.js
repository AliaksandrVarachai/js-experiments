import { jsPDF } from "jspdf";

const date = new Date();
const pdfFilename = `file-${date.toISOString().split('.')[0]}.pdf`;

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();

doc.text("The quick brown fox jumps over the カスタム期間 !", 10, 50);


doc.save(pdfFilename);