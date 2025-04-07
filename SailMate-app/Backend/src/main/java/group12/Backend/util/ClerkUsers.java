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

    public static HashMap<String, Object> getUserEmail(String userId) throws Exception {
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();
        Clerk sdk = Clerk.builder()
            .bearerAuth(dotenv.get("VITE_CLERK_SECRET_KEY"))
            .build();
        
        try{
            GetUserResponse res = sdk.users().get()
                .userId(userId)
                .call();

            HashMap<String, Object> user = new HashMap<>();
            user.put("full_name", res.user().get().firstName().get() + " " + res.user().get().lastName().get());
            if (res.user().get().emailAddresses().isPresent())
                user.put("email", res.user().get().emailAddresses().get().getFirst().emailAddress());

            return user;
        }
        catch (Exception e) {
            throw new Exception("Error getting user: " + e.getMessage());
        }
    }
}