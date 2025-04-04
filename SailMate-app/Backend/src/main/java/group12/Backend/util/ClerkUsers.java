package group12.Backend.util;

import java.util.HashMap;
import java.util.Map;

import com.clerk.backend_api.Clerk;
import com.clerk.backend_api.models.components.User;
import com.clerk.backend_api.models.operations.GetUserListRequest;
import com.clerk.backend_api.models.operations.GetUserListResponse;

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
                if (a.id().isPresent())
                    all_users.put(a.id().get(), user);
                if (a.imageUrl().isPresent())
                    all_users.put("image", a.imageUrl().get());
                if(a.publicMetadata().isPresent()){
                    Object metadata = a.publicMetadata().get();
                    System.out.println(metadata);
                    if (metadata instanceof Map) {
                        @SuppressWarnings("unchecked")
                        Map<String, Object> metadataMap = (Map<String, Object>) metadata;
                        if (metadataMap.containsKey("role")) {
                            user.put("role", metadataMap.get("role"));
                        }

                    }
                }
            }
            return all_users;
        } catch (Exception e) {
            
            e.printStackTrace();
            return null;
        }
    }

}
