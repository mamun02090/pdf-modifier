const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;

//fake data
const fieldValues = [
  "21, April",
  "21, March",
  "24",
  "JOHN DOE",
  "12537 15TH AVE",
  "SEATTLE, WA 98125",
  "23543857489357",
  "04/02/2023",
  132000,
  113000,
  1000,
  0,
  200,
  300,
  300,
  300,
  300,
  100,
  0,
  1500,
  1000,
  233,
  323,
  343,
  23,
  34,
  23,
  3456,
  0,
  0,
  23,
  34,
  23,
  0,
  23,
  0,
  0,
  0,
  245,
  21,
  289,
  2333,
  12321,
  123,
  2434,
  "Accountant",
  "",
  "",
  "",
  "",
  "",
  "",
];

let downloadedPDF = null;

// pdf modification
async function modifyPdf() {
  const url = "./f1120h.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  const inputs = pdfDoc.getForm().getFields();
  const fieldsNames = inputs.map((f) => f.getName());
  const form = pdfDoc.getForm();

  const textInputList = [];
  const checkBoxesList = [];

  fieldsNames.forEach((f, ind) => {
    if (f.includes("f1")) {
      const textField = form.getTextField(f);
      textField.setMaxLength(100);
      textInputList.push(textField);
    } else {
      checkBoxesList.push(form.getCheckBox(fieldsNames[ind]));
    }
  });

  // text fields data assign
  textInputList.forEach((f, ind) => {
    const value = fieldValues[ind];
    if (value) {
      f.setText(fieldValues[ind].toString());
    }
  });

  //checklist value assign
  checkBoxesList[0].check();
  checkBoxesList[5].check();
  checkBoxesList[8].check();
  checkBoxesList[9].check();

  const pdfUri = await pdfDoc.saveAsBase64({ dataUri: true });
  const pdf = document.getElementById("pdf");
  pdf.src = pdfUri;
  // document.getElementById("download").style.display = "block";
  const pdfBytes = await pdfDoc.save();

  downloadedPDF = pdfBytes;
}

async function downloadPDF() {
  if (downloadedPDF) {
    download(downloadedPDF, "EIN_Form.pdf", "application/pdf");
  }
}
