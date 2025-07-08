"use client";

import { PDFDocument, StandardFonts } from "pdf-lib";

export default function FillableFormPdf() {
  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 792]); // standard letter

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const form = pdfDoc.getForm();

    const label = (text: string, x: number, y: number) => {
      page.drawText(text, { x, y, size: 12, font });
    };

    let y = 720;

    label("Full Name:", 50, y);
    form.createTextField("name").addToPage(page, {
      x: 150,
      y: y - 4,
      width: 300,
      height: 20,
    });

    y -= 40;
    label("Address:", 50, y);
    form.createTextField("address").addToPage(page, {
      x: 150,
      y: y - 4,
      width: 300,
      height: 20,
    });

    y -= 40;
    label("Mailing Address (if different):", 50, y);
    form.createTextField("mailing_address").addToPage(page, {
      x: 250,
      y: y - 4,
      width: 200,
      height: 20,
    });

    y -= 40;
    label("Email:", 50, y);
    form.createTextField("email").addToPage(page, {
      x: 150,
      y: y - 4,
      width: 300,
      height: 20,
    });

    y -= 40;
    label("Phone:", 50, y);
    form.createTextField("phone").addToPage(page, {
      x: 150,
      y: y - 4,
      width: 300,
      height: 20,
    });

    y -= 50;
    label("Preferred Contact Method:", 50, y);

    const mailCheck = form.createCheckBox("contact_mail");
    mailCheck.addToPage(page, { x: 250, y: y - 2, width: 12, height: 12 });
    page.drawText("Mail", { x: 270, y: y, size: 12, font });

    const emailCheck = form.createCheckBox("contact_email");
    emailCheck.addToPage(page, { x: 320, y: y - 2, width: 12, height: 12 });
    page.drawText("Email", { x: 340, y: y, size: 12, font });

    const textCheck = form.createCheckBox("contact_text");
    textCheck.addToPage(page, { x: 400, y: y - 2, width: 12, height: 12 });
    page.drawText("Text", { x: 420, y: y, size: 12, font });

    // Save
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-form.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4">
      <button
        onClick={generatePdf}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
      >
        Generate Fillable PDF Form
      </button>
    </div>
  );
}
