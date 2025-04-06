package group12.Backend;

import group12.Backend.service.TicketPDFGenerator;
import java.util.ArrayList;
import java.util.List;

public class PDFTest {

    public static void main(String[] args) {
        try {
            // ✅ Prepare dynamic list of tickets
            List<TicketPDFGenerator.TicketData> tickets = new ArrayList<>();

            // 👇 Add ticket #1
            tickets.add(makeTicket("FTS-001", "Ali Usta", "25 JUL", "10:30", "İzmir", "İstanbul", "A1", "3", "10:15", "Economy"));

            // 👇 Add ticket #2
            tickets.add(makeTicket("FTS-002", "Zeynep Kaya", "25 JUL", "12:00", "Bursa", "Foça", "B5", "4", "11:45", "Business"));

            // 👇 Add ticket #3
            tickets.add(makeTicket("FTS-003", "Deneme Guy", "25 JUL", "12:00", "Bursa", "Foça", "B5", "4", "11:45", "Promo"));

            // ✅ Generate PDF from all
            TicketPDFGenerator.generateMultiTicketPDF("out/output/multiple_tickets.pdf", tickets);
            System.out.println("✅ PDF generated with " + tickets.size() + " tickets!");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // ✅ Helper method to create ticket data cleanly
    private static TicketPDFGenerator.TicketData makeTicket(
            String ticketId, String passengerName, String date, String time,
            String from, String to, String seat, String gate, String boardTill, String ticketClass
    ) {
        TicketPDFGenerator.TicketData t = new TicketPDFGenerator.TicketData();
        t.ticketId = ticketId;
        t.passengerName = passengerName;
        t.date = date;
        t.time = time;
        t.from = from;
        t.to = to;
        t.seat = seat;
        t.gate = gate;
        t.boardTill = boardTill;
        t.ticketClass = ticketClass;
        return t;
    }
}
