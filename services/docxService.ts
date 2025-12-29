import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, BorderStyle } from "docx";
import FileSaver from "file-saver";
import { GeneratedExamData } from "../types";

export const downloadDocx = (data: GeneratedExamData) => {
  // Styles
  const boldFont = "Times New Roman";
  const regularFont = "Times New Roman";
  const fontSize = 26; // 13pt

  // Helper to create simple text paragraph
  const createPara = (text: string, bold = false, alignment = AlignmentType.LEFT, italic = false) => {
    return new Paragraph({
      alignment: alignment,
      children: [
        new TextRun({
          text: text,
          font: bold ? boldFont : regularFont,
          bold: bold,
          italics: italic,
          size: fontSize,
        }),
      ],
      spacing: { after: 120 },
    });
  };

  // Matrix Table
  const matrixRows = [
    new TableRow({
      children: [
        new TableCell({ children: [createPara("Chủ đề", true)], width: { size: 30, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [createPara("Nhận biết", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [createPara("Thông hiểu", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [createPara("Vận dụng", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [createPara("VD Cao", true)], width: { size: 15, type: WidthType.PERCENTAGE } }),
        new TableCell({ children: [createPara("Tổng", true)], width: { size: 10, type: WidthType.PERCENTAGE } }),
      ],
    }),
    ...data.matrix.map(item => new TableRow({
      children: [
        new TableCell({ children: [createPara(item.topic)] }),
        new TableCell({ children: [createPara(item.levels.knowledge || "-")] }),
        new TableCell({ children: [createPara(item.levels.comprehension || "-")] }),
        new TableCell({ children: [createPara(item.levels.application || "-")] }),
        new TableCell({ children: [createPara(item.levels.highApplication || "-")] }),
        new TableCell({ children: [createPara(item.levels.total || "-")] }),
      ]
    }))
  ];

  const matrixTable = new Table({
    rows: matrixRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });

  // MCQ Section
  const mcqParagraphs = data.mcqPart.flatMap((q, index) => [
    new Paragraph({
      children: [
        new TextRun({ text: `Câu ${index + 1}: `, bold: true, font: boldFont, size: fontSize }),
        new TextRun({ text: q.question, font: regularFont, size: fontSize }),
      ],
      spacing: { before: 120 },
    }),
    ...q.options.map((opt, i) => {
        const label = ["A. ", "B. ", "C. ", "D. "][i];
        return new Paragraph({
            children: [
                new TextRun({ text: label, bold: true, font: regularFont, size: fontSize }),
                new TextRun({ text: opt, font: regularFont, size: fontSize }),
            ],
            indent: { left: 720 }, // Indent options
        });
    })
  ]);

  // Essay Section
  const essayParagraphs = data.essayPart.flatMap((q, index) => [
    new Paragraph({
      children: [
        new TextRun({ text: `Câu ${index + 1} (${q.points} điểm): `, bold: true, font: boldFont, size: fontSize }),
        new TextRun({ text: q.question, font: regularFont, size: fontSize }),
      ],
      spacing: { before: 240, after: 120 },
    })
  ]);

  // Answers Section
  const answerMCQ = data.mcqPart.map((q, i) => 
     new Paragraph({
        children: [
            new TextRun({ text: `Câu ${i + 1}: ${q.correctAnswer}`, font: regularFont, size: fontSize }),
            new TextRun({ text: ` - ${q.explanation}`, italics: true, font: regularFont, size: fontSize }),
        ]
     })
  );

  const answerEssay = data.essayPart.flatMap((q, i) => [
     new Paragraph({
        children: [new TextRun({ text: `Câu ${i + 1} tự luận:`, bold: true, font: boldFont, size: fontSize })],
        spacing: { before: 120 }
     }),
     new Paragraph({
         children: [new TextRun({ text: q.guide, font: regularFont, size: fontSize })]
     })
  ]);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          createPara(data.title.toUpperCase(), true, AlignmentType.CENTER),
          createPara(data.subtitle, false, AlignmentType.CENTER),
          createPara("", false), // Spacer

          createPara("I. MA TRẬN ĐỀ THI", true),
          matrixTable,
          createPara("", false),

          createPara("II. NỘI DUNG ĐỀ THI", true),
          createPara("A. TRẮC NGHIỆM", true),
          ...mcqParagraphs,
          
          createPara("B. TỰ LUẬN", true),
          ...essayParagraphs,

          new Paragraph({ pageBreakBefore: true }), // New page for answers
          createPara("HƯỚNG DẪN CHẤM VÀ ĐÁP ÁN", true, AlignmentType.CENTER),
          createPara("1. Trắc nghiệm", true),
          ...answerMCQ,
          createPara("2. Tự luận", true),
          ...answerEssay,
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    // Handle file-saver import structure which can vary by environment
    const saveAs = (FileSaver as any).saveAs || FileSaver;
    saveAs(blob, `${data.title}.docx`);
  });
};