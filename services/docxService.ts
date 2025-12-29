
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType } from "docx";
import FileSaver from "file-saver";
import { GeneratedExamData } from "../types.ts";

export const downloadDocx = (data: GeneratedExamData) => {
  const font = "Times New Roman";
  const size = 26;

  const createPara = (text: string, bold = false, alignment = AlignmentType.LEFT) => 
    new Paragraph({ alignment, children: [new TextRun({ text, font, bold, size })], spacing: { after: 120 } });

  const doc = new Document({
    sections: [{
      children: [
        createPara(data.title.toUpperCase(), true, AlignmentType.CENTER),
        createPara(data.subtitle, false, AlignmentType.CENTER),
        createPara("I. PHẦN TRẮC NGHIỆM", true),
        ...data.mcqPart.flatMap((q, i) => [
          createPara(`Câu ${i+1}: ${q.question}`),
          ...q.options.map((opt, oi) => createPara(`${['A','B','C','D'][oi]}. ${opt}`))
        ]),
        createPara("II. PHẦN TỰ LUẬN", true),
        ...data.essayPart.map((q, i) => createPara(`Câu ${i+1} (${q.points}đ): ${q.question}`)),
      ]
    }]
  });

  Packer.toBlob(doc).then((blob) => {
    const saveAs = (FileSaver as any).saveAs || FileSaver;
    saveAs(blob, `${data.title}.docx`);
  });
};
