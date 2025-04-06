package group12.Backend.repository;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Timestamp;

public class BarcodeStoreRepository {

    private final Connection connection;

    public BarcodeStoreRepository(Connection connection) {
        this.connection = connection;
    }

    public void saveTicketWithBarcode(String ticketCode, String passengerName, int ferryId,
                                      Timestamp departureTime, byte[] barcodeImage) throws Exception {

        String sql = "INSERT INTO tickets (TicketID, voyage_id, total_price, purchaser_name, barcode_image) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, ticketCode);
            stmt.setInt(2, ferryId);
            stmt.setInt(3, 100); // Example price
            stmt.setString(4, passengerName);
            stmt.setBytes(5, barcodeImage);
            stmt.executeUpdate();
        }
    }
}
