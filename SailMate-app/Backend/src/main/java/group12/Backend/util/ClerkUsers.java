package group12.Backend.util;

import java.util.HashMap;
import java.util.Map;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.components.User;
import com.clerk.backend_api.models.operations.DeleteUserResponse;
import com.clerk.backend_api.models.operations.GetUserListRequest;
import com.clerk.backend_api.models.operations.GetUserListResponse;
import com.clerk.backend_api.models.operations.GetUserResponse;
import com.clerk.backend_api.models.operations.UpdateUserMetadataRequestBody;
import com.clerk.backend_api.models.operations.UpdateUserMetadataResponse;


import io.github.cdimascio.dotenv.Dotenv;

public class ClerkUsers {
    public static Map<String, Object> allUsers(){
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();
        
        GetUserListRequest req = GetUserListRequest.builder().build();
        Map<String, Object> all_users = new HashMap<>();
        try {
            GetUserListResponse res = sdk.users().list().request(req).call();
            if (res.userList().isEmpty())
                return null;
            for(User a: res.userList().get()){
                HashMap<String, Object> user = new HashMap<>();
                user.put("full_name", a.firstName().get() + " " + a.lastName().get());
                if (a.emailAddresses().isPresent())
                    user.put("email", a.emailAddresses().get().getFirst().emailAddress());
                if(a.publicMetadata().isPresent()){
                    Object metadata = a.publicMetadata().get();
                    if (metadata instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> metadataMap = (Map<String, Object>) metadata;
                        if (metadataMap.containsKey("role")) {
                            user.put("role", metadataMap.get("role"));
                        }
                        if (metadataMap.containsKey("lan")) {
                            user.put("lan", metadataMap.get("lan"));
                        }
                        if (metadataMap.containsKey("news")) {
                            user.put("news", metadataMap.get("news"));
                        }
                    }
                }
                if (a.imageUrl().isPresent())
                    user.put("image", a.imageUrl().get());
                if (a.id().isPresent())
                    all_users.put(a.id().get(), user);
            }
            return all_users;
        } catch (Exception e) {
            
            e.printStackTrace();
            return null;
        }
    }

    public static void updateUserRole(String userId, String newRole) throws Exception{
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();

         UpdateUserMetadataResponse res = sdk.users().updateMetadata()
                 .userId(userId)
                 .requestBody(UpdateUserMetadataRequestBody.builder().publicMetadata(Map.of("role", newRole)).build())
                 .call();
        if (res.user().isEmpty()) {
            throw new Exception("User not found");
        }
    }

    public static void updateUserLanguage(String userId, String language) throws Exception {
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();

        UpdateUserMetadataResponse res = sdk.users().updateMetadata()
            .userId(userId)
            .requestBody(UpdateUserMetadataRequestBody.builder().publicMetadata(Map.of("lan", language)).build())
            .call();
            
        if (res.user().isEmpty()) {
            throw new Exception("Failed to update user language preference");
        }
    }
    
    /**
     * Update user metadata with multiple fields at once
     * 
     * @param userId The user ID
     * @param metadata A map of metadata fields to update
     * @throws Exception If the update fails
     */
    public static void updateUserMetadata(String userId, Map<String, Object> metadata) throws Exception {
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();

        UpdateUserMetadataResponse res = sdk.users().updateMetadata()
            .userId(userId)
            .requestBody(UpdateUserMetadataRequestBody.builder().publicMetadata(metadata).build())
            .call();
            
        if (res.user().isEmpty()) {
            throw new Exception("Failed to update user metadata");
        }
    }

    public static void deleteUser(String userId) throws Exception {
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();
        
        try {
            DeleteUserResponse res = sdk.users().delete()
                .userId(userId)
                .call();
            
            // Success case - res.deletedObject() should be present
            if (!res.deletedObject().isPresent()) {
                throw new Exception("User deletion did not return expected response");
            }
            
        } catch (Exception e) {
            throw new Exception("Error deleting user: " + e.getMessage());
        }
    }

    public static HashMap<String, Object> getUser(String userId) throws Exception {
        if (userId == null) {
            throw new Exception("Error getting user: userId is null");
        }
        
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();
        
        try {
            GetUserResponse res = sdk.users().get()
                .userId(userId)
                .call();
            
            if (res.user().isEmpty()) {
                throw new Exception("User not found in Clerk");
            }
            
            HashMap<String, Object> user = new HashMap<>();
            
            // Safe access to firstName and lastName
            String firstName = res.user().get().firstName().orElse("");
            String lastName = res.user().get().lastName().orElse("");
            user.put("full_name", firstName + " " + lastName);
            
            // Safely get email (if available)
            if (res.user().get().emailAddresses().isPresent() && 
                !res.user().get().emailAddresses().get().isEmpty()) {
                user.put("email", res.user().get().emailAddresses().get().get(0).emailAddress());
            } else {
                // Default email value if none exists
                user.put("email", "");
            }
            
            // Safely get phone (if available)
            if (res.user().get().phoneNumbers().isPresent() && 
                !res.user().get().phoneNumbers().get().isEmpty()) {
                user.put("phone", res.user().get().phoneNumbers().get().get(0).phoneNumber());
            } else {
                // Default phone value if none exists
                user.put("phone", "");
            }
            
            // Get user preferences from metadata
            if (res.user().get().publicMetadata().isPresent()) {
                Object metadata = res.user().get().publicMetadata().get();
                if (metadata instanceof Map) {
                    @SuppressWarnings("unchecked")
                    Map<String, Object> metadataMap = (Map<String, Object>) metadata;
                    
                    // Get language preference (default to English)
                    if (metadataMap.containsKey("lan")) {
                        user.put("lan", metadataMap.get("lan"));
                    } else {
                        user.put("lan", "en");
                    }
                    
                    // Get newsletter subscription (default to false)
                    if (metadataMap.containsKey("news")) {
                        user.put("news", metadataMap.get("news"));
                    } else {
                        user.put("news", false);
                    }
                } else {
                    // Default values if metadata is not a map
                    user.put("lan", "en");
                    user.put("news", false);
                }
            } else {
                // Default values if no metadata is present
                user.put("lan", "en");
                user.put("news", false);
            }
            
            return user;
        }
        catch (Exception e) {
            e.printStackTrace();
            throw new Exception("Error getting user: " + e.getMessage());
        }
    }
}