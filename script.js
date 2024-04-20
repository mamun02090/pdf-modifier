const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
//data
const axis = {
  name: {
    x: 80,
    y: 115,
  },
  ein: { x: 424, y: 115 },
  street: { x: 80, y: 140 },
  city: { x: 80, y: 163 },
  dateAssociation: { x: 424, y: 163 },
  B: { x: 45, y: 201 },
  C: { x: 45, y: 213 },
  D: { x: 45, y: 225 },
  E: { x: 45, y: 237 },
  1: { x: 45, y: 261 },
  2: { x: 45, y: 273 },
  3: { x: 45, y: 285 },
  4: { x: 45, y: 297 },
  6: { x: 45, y: 309 },
  7: { x: 45, y: 321 },
  8: { x: 45, y: 333 },
  9: { x: 45, y: 369 },
  10: { x: 45, y: 381 },
  11: { x: 45, y: 393 },
  12: { x: 45, y: 405 },
  13: { x: 45, y: 417 },
  14: { x: 45, y: 429 },
  15: { x: 45, y: 441 },
  16: { x: 45, y: 453 },
  17: { x: 45, y: 465 },
  18: { x: 45, y: 477 },
  19: { x: 45, y: 501 },
  20: { x: 45, y: 513 },
  21: { x: 45, y: 525 },
  22: { x: 45, y: 537 },
  "23a": { x: 150, y: 549 },
  "23b": { x: 150, y: 561 },
  "23c": { x: 150, y: 573 },
  "23d": { x: 150, y: 585 },
  "23e": { x: 150, y: 597 },
  "23f": { x: 150, y: 609 },
  "23g": { x: 150, y: 621 },
  24: { x: 45, y: 633 },
  25: { x: 45, y: 645 },
};
const fields = {
  name: "JOHN DOE",
  ein: "23543857489357",
  street: "12537 15TH AVE",
  city: "SEATTLE, WA 98125-",
  dateAssociation: "04/02/2023",
  B: "132,000.",
  C: "113,000.",
  D: "1000.",
  E: "",
  1: "200.",
  2: "300.",
  3: "300.",
  4: "300.",
  6: "300.",
  7: "100.",
  9: "1000.",
  10: "233.",
  11: "323.",
  12: "343.",
  13: "23.",
  14: "34.",
  15: "23.",
  16: "455",
  17: "",
  18: "",
  19: "",
  20: "34.",
  21: "23.",
  22: "",
  "23a": "23.",
  "23b": "",
  "23c": "",
  "23d": "",
  "23e": "245.",
  "23f": "",
  "23g": "",
  24: "2333.",
  25: "12321.",
};
const checkBoxesAxis = {
  returnType: {
    finalReturn: { x: 105.3, y: 176.5 },
    nameChange: { x: 227.3, y: 176.5 },
    addressChange: { x: 357, y: 176.5 },
    amendedReturn: { x: 487, y: 176.5 },
  },
  homeOwnerTypes: {
    CMA: { x: 213, y: 188.5 },
    RREA: { x: 353.3, y: 188.5 },
    TA: { x: 487, y: 188.5 },
  },
  IRSDiscuss: {
    false: { x: 555, y: 697 },
    true: { x: 530, y: 697 },
  },
};
const checkBoxes = {
  returnType: "addressChange",
  homeOwnerTypes: "TA",
  IRSDiscuss: "true",
};

// pdf modification
async function modifyPdf() {
  const url = "./f1120h.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();

  Object.keys(axis).map((item) => {
    const field = fields[item];
    if (field) {
      let xAxis = axis[item].x;

      if (item.length <= 2 || (item.length > 2 && item[0] === "2")) {
        const textWidth = helveticaFont.widthOfTextAtSize(field, 9);
        xAxis = width - xAxis - textWidth;
      }
      firstPage.drawText(fields[item], {
        x: xAxis,
        y: height - axis[item].y,
        size: 9,
        font: helveticaFont,
        color: rgb(0, 0, 0),
      });
    }
  });

  Object.keys(checkBoxes).map((item) => {
    let xAxis = checkBoxesAxis[item][checkBoxes[item]].x;
    let yAxis = checkBoxesAxis[item][checkBoxes[item]].y;
    firstPage.drawRectangle({
      x: xAxis,
      y: height - yAxis,
      width: item === "IRSDiscuss" ? 4 : 5,
      height: item === "IRSDiscuss" ? 4 : 5,
      color: rgb(0, 0, 0),
      borderWidth: 0,
    });
  });

  const pdfBytes = await pdfDoc.save();
  download(pdfBytes, "pdf-lib_modification_example.pdf", "application/pdf");
}
