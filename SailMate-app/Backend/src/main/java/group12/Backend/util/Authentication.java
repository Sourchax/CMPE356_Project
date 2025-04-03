package group12.Backend.util;

import com.clerk.backend_api.helpers.jwks.AuthenticateRequest;
import com.clerk.backend_api.helpers.jwks.AuthenticateRequestOptions;
import com.clerk.backend_api.helpers.jwks.RequestState;
import io.github.cdimascio.dotenv.Dotenv;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import java.io.IOException;

public class Authentication {
    public static Claims getClaims(HttpServletRequest request) throws IOException {
        Dotenv dotenv = Dotenv.configure().directory("../Frontend").filename(".env.local").load();

        RequestState requestState = AuthenticateRequest.authenticateRequest(HttpConverter.convert(request), AuthenticateRequestOptions
                .secretKey(dotenv.get("VITE_CLERK_SECRET_KEY"))
                .build());

        if (requestState.isSignedIn() && requestState.claims().isPresent())
            return requestState.claims().get();
        return null;
    }
}