package group12.Backend.util;

import com.clerk.backend_api.helpers.jwks.AuthenticateRequest;
import com.clerk.backend_api.helpers.jwks.AuthenticateRequestOptions;
import com.clerk.backend_api.helpers.jwks.RequestState;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import java.util.List;
 import java.util.Map;
import java.io.IOException;


public class Authentication {
    public static Claims getClaims(String auth) throws IOException {
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();

        RequestState requestState = AuthenticateRequest.authenticateRequest(Map.of("Authorization", List.of(auth)), AuthenticateRequestOptions
                .secretKey(dotenv.get("VITE_CLERK_SECRET_KEY"))
                .build());

        if (requestState.isSignedIn() && requestState.claims().isPresent())
            return requestState.claims().get();
        return null;
    }
}