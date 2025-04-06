package group12.Backend.repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class BarcodeRetrieveRepository {

    private final Connection connection;

    public BarcodeRetrieveRepository(Connection connection) {
        this.connection = connection;
    }

    public String getTicketDataString(String ticketId) throws Exception {
        String sql = "SELECT ticket_id, voyage_id, passenger_count, total_price, ticket_class, selected_seats, user_id, ticket_data FROM tickets WHERE ticket_id = ?";
        try (PreparedStatement stmt = connection.prepareStatement(sql)) {
            stmt.setString(1, ticketId);
            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                return String.format(
                    "ticket_id: %s\nvoyage_id: %d\npassengers: %d\ntotal_price: %d\nclass: %s\nseats: %s\nuser: %s\npassenger_info: %s",
                    rs.getString("ticket_id"),
                    rs.getInt("voyage_id"),
                    rs.getInt("passenger_count"),
                    rs.getInt("total_price"),
                    rs.getString("ticket_class"),
                    rs.getString("selected_seats"),
                    rs.getString("user_id"),
                    rs.getString("ticket_data")
                );
            } else {
                throw new Exception("Ticket not found: " + ticketId);
            }
        }
    }
}
