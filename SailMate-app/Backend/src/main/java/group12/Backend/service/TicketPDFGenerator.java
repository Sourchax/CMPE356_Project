package group12.Backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.nio.file.FileSystems;
import java.nio.file.Path;

public class TicketPDFGenerator {

    public static class TicketData {
        public String ticketId;
        public String passengerName;
        public String date;
        public String time;
        public String from;
        public String to;
        public String seat;
        public String gate;
        public String boardTill;
        public String ticketClass;
    }

    
    public static void generateMultiTicketPDF(String filePath, java.util.List<TicketData> ticketList) throws Exception {
        new java.io.File("out/output").mkdirs();

        Document document = new Document(new Rectangle(800, 250));
        PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(filePath));
        document.open();
        boolean isFirst = true;
        for (TicketData data : ticketList) {
            if (!isFirst) {
                document.newPage(); // only after the first page
            }
            isFirst = false;
            PdfContentByte canvas = writer.getDirectContent();
            canvas.setColorFill(new BaseColor(30, 144, 255));
            canvas.rectangle(0, 220, 800, 30);
            canvas.fill();

            Font headerFont = new Font(Font.FontFamily.HELVETICA, 16, Font.BOLD, BaseColor.WHITE);
            ColumnText.showTextAligned(canvas, Element.ALIGN_CENTER,
                    new Phrase("SailMate Ferries - Boarding Pass", headerFont), 400, 227, 0);

            PdfPTable layout = new PdfPTable(2);
            layout.setWidthPercentage(100);
            layout.setWidths(new int[]{2, 1});
            layout.setSpacingBefore(10);

            Image logo = Image.getInstance("assets/logo.png");
            logo.scaleToFit(200, 200);
            logo.setAbsolutePosition(200, 10);
            document.add(logo);

            String logoPath;
            switch (data.ticketClass.toLowerCase()) {
                case "business":
                    logoPath = "assets/Business.png";
                    break;
                case "promo":
                    logoPath = "assets/Promo.png";
                    break;
                default:
                    logoPath = "assets/Economy.png";
                    break;
            }

            try {
                Image classLogo = Image.getInstance(logoPath);
                classLogo.setAbsolutePosition(580, 0);
                classLogo.scaleToFit(220, 220);
                document.add(classLogo);
            } catch (Exception e) {
                System.err.println("⚠ Could not load class logo: " + e.getMessage());
            }

            PdfPTable left = new PdfPTable(2);
            left.setWidths(new int[]{1, 2});
            addInfo(left, "Ticket ID:", data.ticketId);
            addInfo(left, "Passenger:", data.passengerName);
            addInfo(left, "Date:", data.date);
            addInfo(left, "Time:", data.time);
            addInfo(left, "From:", data.from);
            addInfo(left, "To:", data.to);
            addInfo(left, "Seat:", data.seat);
            addInfo(left, "Gate:", data.gate);
            addInfo(left, "Board Till:", data.boardTill);
            addInfo(left, "Class:", data.ticketClass);

            layout.addCell(noBorderCell(left));

            PdfPCell spacer = new PdfPCell();
            spacer.setBorder(Rectangle.NO_BORDER);
            layout.addCell(spacer);

            document.add(layout);

            String qrData = String.format(
                    "TicketID: %s\nPassenger: %s\nFrom: %s\nTo: %s\nDate: %s %s\nSeat: %s\nGate: %s\nBoard Till: %s\nClass: %s",
                    data.ticketId, data.passengerName, data.from, data.to, data.date, data.time,
                    data.seat, data.gate, data.boardTill, data.ticketClass
            );
            Image qr = Image.getInstance(generateQRCodeImage(qrData));
            qr.scaleAbsolute(120, 120);
            qr.setAbsolutePosition(402, 60);
            document.add(qr);
        }

        document.close();
        System.out.println("📄 Multi-ticket PDF created: " + filePath);
    }

    private static void addInfo(PdfPTable table, String label, String value) {
        Font bold = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD);
        Font normal = new Font(Font.FontFamily.HELVETICA, 12);
        PdfPCell labelCell = new PdfPCell(new Phrase(label, bold));
        labelCell.setBorder(Rectangle.NO_BORDER);
        PdfPCell valueCell = new PdfPCell(new Phrase(value, normal));
        valueCell.setBorder(Rectangle.NO_BORDER);
        table.addCell(labelCell);
        table.addCell(valueCell);
    }

    private static PdfPCell noBorderCell(PdfPTable inner) {
        PdfPCell cell = new PdfPCell(inner);
        cell.setBorder(Rectangle.NO_BORDER);
        return cell;
    }

    private static byte[] generateQRCodeImage(String text) throws Exception {
        BitMatrix matrix = new MultiFormatWriter().encode(text, BarcodeFormat.QR_CODE, 120, 120);
        ByteArrayOutputStream pngOutputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(matrix, "PNG", pngOutputStream);
        return pngOutputStream.toByteArray();
    }

}
