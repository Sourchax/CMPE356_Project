package group12.Backend;

import group12.Backend.service.TicketService;
import group12.Backend.repository.TicketRepository;
import group12.Backend.repository.BarcodeRetrieveRepository;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Timestamp;

public class BarcodeTest {

    public static void main(String[] args) {
        try {
            // 1. Connect to database
            Connection conn = DriverManager.getConnection(
                "jdbc:mysql://localhost:3306/SAILMATE", "root", "CanavarForTest147"
            );

            // 2. Set up repositories and service
            TicketRepository repo = new TicketRepository(conn);
            BarcodeRetrieveRepository retrieveRepo = new BarcodeRetrieveRepository(conn);
            TicketService service = new TicketService(repo, retrieveRepo);

            // 3. Create ticket with barcode
            String ticketJson = "{\"name\":\"Ali\",\"surname\":\"Test\",\"birthDate\":\"1999-01-01\",\"email\":\"ali@example.com\",\"phoneNo\":\"5551234567\"}";

            service.createTicket(
                "FTS-001",         // ticket_id
                1,                 // voyage_id
                1,                 // passenger_count
                100,               // total_price
                "Economy",         // ticket_class
                "A1",              // selected_seats
                "user123",         // user_id
                ticketJson,        // ticket_data
                Timestamp.valueOf("2025-04-04 14:00:00") // created_at
            );

            System.out.println("✅ Ticket with barcode saved to database.");

            // 4. Retrieve barcode image and save to file
            byte[] image = service.getBarcodeImage("FTS-001");
            Files.write(Paths.get("output/barcode_test.png"), image);

            System.out.println("✅ Barcode image saved to output/barcode_test.png");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
