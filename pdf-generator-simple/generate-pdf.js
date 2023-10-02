import { jsPDF } from "jspdf";
// import {
//   base64EncodedPdfFont,
//   pdfFontName,
// } from "./base64-encoded-pdf-font.js";

const date = new Date();
const pdfFilename = `file-${date.toISOString().split('.')[0]}.pdf`;

// Default export is a4 paper, portrait, using millimeters for units
const doc = new jsPDF();
console.log('1st font: ', doc.getFont().fontName)
const binaryTtfData = await fetch('http://localhost:9080/VLGothic-regular.ttf').then(response => response.text());
// console.log('********** binaryTtfData=', binaryTtfData)
const pdfFontName = 'my Font';
// const base64EncodedPdfFont = Buffer.from(binaryTtfData).toString('base64');
const base64EncodedPdfFont = btoa(binaryTtfData);

doc.addFileToVFS(`${pdfFontName}.ttf`, base64EncodedPdfFont);
doc.addFont(`${pdfFontName}.ttf`, pdfFontName, "normal");
doc.setFont(pdfFontName);
doc.text("The quick brown fox jumps over the カスタム期間 !", 10, 70);
console.log('2nd font: ', doc.getFont().fontName)
// console.log('Font list: ', doc.getFontList())


doc.save(pdfFilename);