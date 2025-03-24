package group12.Backend;

import group12.Backend.repository.TicketRepository;
import group12.Backend.service.TicketService;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Timestamp;
import java.time.LocalDateTime;

public class BarcodeTest {
    public static void main(String[] args) throws Exception {
        // Connect to MySQL
        Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/SAILMATE", "root", "CanavarForTest147"
        );

        // Create repo + service
        TicketRepository repo = new TicketRepository(conn);
        TicketService service = new TicketService(repo);

        // Test data
        String ticketCode = "FTS-TEST-001";
        String purchaserName = "Test User";
        int voyageId = 2; // make sure voyage with ID 1 exists
        int totalPrice = 100;
        Timestamp departureTime = Timestamp.valueOf(LocalDateTime.now().plusDays(1));

        // Generate + insert
        service.createTicketWithBarcode(ticketCode, purchaserName, voyageId, totalPrice, departureTime);
        System.out.println("✅ Ticket inserted with barcode: " + ticketCode);

        conn.close();
    }
}
