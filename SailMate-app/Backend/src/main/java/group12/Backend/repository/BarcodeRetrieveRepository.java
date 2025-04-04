package group12.Backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class BarcodeRetrieveRepository {

    private final Connection connection;

    public BarcodeRetrieveRepository(Connection connection) {
        this.connection = connection;
    }

    public String getTicketDataString(String ticketCode) throws Exception {
        String sql = "SELECT TicketID, purchaser_name, voyage_id, total_price FROM tickets WHERE TicketID = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, ticketCode);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                String ticketId = rs.getString("TicketID");
                String purchaser = rs.getString("purchaser_name");
                int voyageId = rs.getInt("voyage_id");
                int totalPrice = rs.getInt("total_price");

                // 👇 You can format this however you want
                return String.format(
                    "{\"ticketId\":\"%s\",\"passenger\":\"%s\",\"voyageId\":%d,\"price\":%d}",
                    ticketId, purchaser, voyageId, totalPrice
                );
            } else {
                throw new Exception("Ticket not found: " + ticketCode);
            }
        }
    }
}
