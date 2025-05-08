package group12.Backend.util;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.internet.MimeMessage;

/**
 * Utility class for sending notification emails to users
 */
@Component
public class EmailUtil {
    private static final Logger logger = LoggerFactory.getLogger(EmailUtil.class);
    
    @Autowired
    private JavaMailSender emailSender;
    
    private final String EMAIL_FROM = "sailmatesup@gmail.com";
    
    /**
     * Sends notification to all users in the system who have subscribed to news
     * 
     * @param subjectEn English subject
     * @param subjectTr Turkish subject
     * @param messageEn English message
     * @param messageTr Turkish message
     */
    public void notifyAllUsers(String subjectEn, String subjectTr, String messageEn, String messageTr) {
        try {
            // Get all users from Clerk
            Map<String, Object> allUsers = ClerkUsers.allUsers();
            if (allUsers == null || allUsers.isEmpty()) {
                logger.warn("No users found to notify");
                return;
            }
            
            // Iterate through all users
            for (Map.Entry<String, Object> entry : allUsers.entrySet()) {
                String userId = entry.getKey();
                @SuppressWarnings("unchecked")
                HashMap<String, Object> userData = (HashMap<String, Object>) entry.getValue();
                
                try {
                    // Check if user has subscribed to news
                    Boolean newsSubscription = Boolean.FALSE;
                    if (userData.containsKey("news")) {
                        newsSubscription = Boolean.valueOf(userData.get("news").toString());
                    }
                    
                    // Only send to users who have subscribed to news (or if news preference is not set)
                    if (newsSubscription && userData.containsKey("email")) {
                        // Get user's language preference (default to English)
                        String language = userData.containsKey("lan") ? (String) userData.get("lan") : "en";
                        
                        // Select subject and message based on language
                        String subject = "tr".equals(language) ? subjectTr : subjectEn;
                        String message = "tr".equals(language) ? messageTr : messageEn;
                        
                        // Create and send the email
                        SimpleMailMessage mailMessage = new SimpleMailMessage();
                        mailMessage.setFrom(EMAIL_FROM);
                        mailMessage.setTo((String) userData.get("email"));
                        mailMessage.setSubject(subject);
                        mailMessage.setText(message);
                        
                        emailSender.send(mailMessage);
                        logger.info("Notification email sent to: {} ({})", userData.get("email"), userData.get("full_name"));
                    } else {
                        logger.debug("Skipping notification for user {} - news subscription disabled", userData.get("full_name"));
                    }
                } catch (Exception e) {
                    logger.error("Error sending notification to user {}: {}", userId, e.getMessage());
                    // Continue with the next user
                }
            }
            logger.info("Completed sending notifications to subscribed users");
        } catch (Exception e) {
            logger.error("Error in notifyAllUsers: {}", e.getMessage(), e);
        }
    }
    
    /**
     * Sends notification email about a new station
     * 
     * @param stationTitle The title of the new station
     * @param city The city where the station is located
     */
    public void notifyStationCreated(String stationTitle, String city) {
        String subjectEn = "New Station Added: " + stationTitle;
        String subjectTr = "Yeni İstasyon Eklendi: " + stationTitle;
        
        String messageEn = "Dear User,\n\n" +
                          "We are pleased to inform you that a new station has been added to our network.\n\n" +
                          "Station: " + stationTitle + "\n" +
                          "Location: " + city + "\n\n" +
                          "You can now select this station for your rides.\n\n" +
                          "Best regards,\n" +
                          "The Transportation Team";
        
        String messageTr = "Değerli Kullanıcımız,\n\n" +
                          "Ağımıza yeni bir istasyon eklendiğini bildirmekten memnuniyet duyarız.\n\n" +
                          "İstasyon: " + stationTitle + "\n" +
                          "Konum: " + city + "\n\n" +
                          "Artık bu istasyonu yolculuklarınız için seçebilirsiniz.\n\n" +
                          "Saygılarımızla,\n" +
                          "Ulaşım Ekibi";
        
        notifyAllUsers(subjectEn, subjectTr, messageEn, messageTr);
    }
    
    /**
     * Sends notification email about a station deletion
     * 
     * @param stationTitle The title of the deleted station
     * @param city The city where the station was located
     */
    public void notifyStationDeleted(String stationTitle, String city) {
        String subjectEn = "Station Removed: " + stationTitle;
        String subjectTr = "İstasyon Kaldırıldı: " + stationTitle;
        
        String messageEn = "Dear User,\n\n" +
                          "Please note that the following station has been removed from our network:\n\n" +
                          "Station: " + stationTitle + "\n" +
                          "Location: " + city + "\n\n" +
                          "If you had any upcoming trips scheduled with this station, please update your plans accordingly.\n\n" +
                          "We apologize for any inconvenience this may cause.\n\n" +
                          "Best regards,\n" +
                          "The Transportation Team";
        
        String messageTr = "Değerli Kullanıcımız,\n\n" +
                          "Aşağıdaki istasyonun ağımızdan kaldırıldığını bildiririz:\n\n" +
                          "İstasyon: " + stationTitle + "\n" +
                          "Konum: " + city + "\n\n" +
                          "Bu istasyonla planlanmış yaklaşan yolculuklarınız varsa, lütfen planlarınızı buna göre güncelleyin.\n\n" +
                          "Yaşatabileceğimiz herhangi bir rahatsızlık için özür dileriz.\n\n" +
                          "Saygılarımızla,\n" +
                          "Ulaşım Ekibi";
        
        notifyAllUsers(subjectEn, subjectTr, messageEn, messageTr);
    }
    
    /**
     * Sends notification email about price updates
     * 
     * @param className The class/category that had a price update
     * @param oldValue The previous price value
     * @param newValue The new price value
     */
    public void notifyPriceUpdated(String className, double oldValue, double newValue) {
        String subjectEn = "Price Update: " + className;
        String subjectTr = "Fiyat Güncellemesi: " + className;
        
        String messageEn = "Dear User,\n\n" +
                          "We would like to inform you about a price update for the following service:\n\n" +
                          "Service: " + className + "\n" +
                          "Previous Price: " + oldValue + "\n" +
                          "New Price: " + newValue + "\n\n" +
                          "This change will take effect immediately.\n\n" +
                          "Best regards,\n" +
                          "The Transportation Team";
        
        String messageTr = "Değerli Kullanıcımız,\n\n" +
                          "Aşağıdaki hizmet için bir fiyat güncellemesi hakkında sizi bilgilendirmek istiyoruz:\n\n" +
                          "Hizmet: " + className + "\n" +
                          "Önceki Fiyat: " + oldValue + "\n" +
                          "Yeni Fiyat: " + newValue + "\n\n" +
                          "Bu değişiklik hemen geçerli olacaktır.\n\n" +
                          "Saygılarımızla,\n" +
                          "Ulaşım Ekibi";
        
        notifyAllUsers(subjectEn, subjectTr, messageEn, messageTr);
    }
    
    /**
     * Sends notification email about a new announcement
     * 
     * @param title The title of the announcement
     * @param content The content of the announcement
     */
    public void notifyAnnouncementAdded(String title) {
        String subjectEn = "New Announcement: " + title;
        String subjectTr = "Yeni Duyuru: " + title;
        
        String messageEn = "Dear User,\n\n" +
                          "A new announcement has been published:\n\n" +
                          "Title: " + title + "\n\n" +
                          "Best regards,\n" +
                          "The Transportation Team";
        
        String messageTr = "Değerli Kullanıcımız,\n\n" +
                          "Yeni bir duyuru yayınlandı:\n\n" +
                          "Başlık: " + title + "\n\n" +
                          "Saygılarımızla,\n" +
                          "Ulaşım Ekibi";
        
        notifyAllUsers(subjectEn, subjectTr, messageEn, messageTr);
    }
    
    /**
     * Sends email with PDF attachment
     * 
     * @param userId User ID to send email to
     * @param subjectEn English subject
     * @param subjectTr Turkish subject
     * @param messageEn English message content
     * @param messageTr Turkish message content
     * @param attachmentName Name of the attachment file
     * @param attachmentData Byte array of attachment data
     * @return true if email sent successfully
     */
    public boolean sendEmailWithAttachment(String userId, String subjectEn, String subjectTr, 
                                        String messageEn, String messageTr, 
                                        String attachmentName, byte[] attachmentData) {
        try {
            // Get user from Clerk
            HashMap<String, Object> user = ClerkUsers.getUser(userId);
            if (user == null || user.get("email") == null) {
                logger.warn("Cannot send email: User not found or no email address for ID: {}", userId);
                return false;
            }
            
            // Get user's language preference (default to English)
            String language = user.containsKey("lan") ? (String) user.get("lan") : "en";
            
            // Select subject and message based on language
            String subject = "tr".equals(language) ? subjectTr : subjectEn;
            String message = "tr".equals(language) ? messageTr : messageEn;
            
            // Create a MimeMessage to support attachments
            MimeMessage mimeMessage = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            
            helper.setFrom(EMAIL_FROM);
            helper.setTo((String) user.get("email"));
            helper.setSubject(subject);
            helper.setText(message);
            
            // Add attachment
            helper.addAttachment(attachmentName, new ByteArrayResource(attachmentData));
            
            // Send the email
            emailSender.send(mimeMessage);
            logger.info("Email with attachment sent successfully to: {}", user.get("email"));
            return true;
        } catch (Exception e) {
            logger.error("Error sending email with attachment to user {}: {}", userId, e.getMessage(), e);
            return false;
        }
    }
    
    /**
     * Sends notification emails to all users with news subscription, including attachments
     * 
     * @param subjectEn English subject
     * @param subjectTr Turkish subject
     * @param messageEn English message
     * @param messageTr Turkish message
     * @param attachmentName Name of the attachment file
     * @param attachmentData Byte array of attachment data
     */
    public void notifyAllUsersWithAttachment(String subjectEn, String subjectTr, String messageEn, String messageTr,
                                           String attachmentName, byte[] attachmentData) {
        try {
            // Get all users from Clerk
            Map<String, Object> allUsers = ClerkUsers.allUsers();
            if (allUsers == null || allUsers.isEmpty()) {
                logger.warn("No users found to notify with attachment");
                return;
            }
            
            // Iterate through all users
            for (Map.Entry<String, Object> entry : allUsers.entrySet()) {
                String userId = entry.getKey();
                @SuppressWarnings("unchecked")
                HashMap<String, Object> userData = (HashMap<String, Object>) entry.getValue();
                
                try {
                    // Check if user has subscribed to news
                    Boolean newsSubscription = Boolean.TRUE;
                    if (userData.containsKey("news")) {
                        newsSubscription = Boolean.valueOf(userData.get("news").toString());
                    }
                    
                    // Only send to users who have subscribed to news (or if news preference is not set)
                    if (newsSubscription && userData.containsKey("email")) {
                        // Get user's language preference (default to English)
                        String language = userData.containsKey("lan") ? (String) userData.get("lan") : "en";
                        
                        // Select subject and message based on language
                        String subject = "tr".equals(language) ? subjectTr : subjectEn;
                        String message = "tr".equals(language) ? messageTr : messageEn;
                        
                        // Create a MimeMessage to support attachments
                        MimeMessage mimeMessage = emailSender.createMimeMessage();
                        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
                        
                        helper.setFrom(EMAIL_FROM);
                        helper.setTo((String) userData.get("email"));
                        helper.setSubject(subject);
                        helper.setText(message);
                        
                        // Add attachment
                        helper.addAttachment(attachmentName, new ByteArrayResource(attachmentData));
                        
                        // Send the email
                        emailSender.send(mimeMessage);
                        logger.info("Notification email with attachment sent to: {} ({})", userData.get("email"), userData.get("full_name"));
                    } else {
                        logger.debug("Skipping notification for user {} - news subscription disabled", userData.get("full_name"));
                    }
                } catch (Exception e) {
                    logger.error("Error sending notification with attachment to user {}: {}", userId, e.getMessage());
                    // Continue with the next user
                }
            }
            logger.info("Completed sending notifications with attachments to subscribed users");
        } catch (Exception e) {
            logger.error("Error in notifyAllUsersWithAttachment: {}", e.getMessage(), e);
        }
    }
}