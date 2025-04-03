package group12.Backend.util;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.util.Enumeration;
import java.util.Set;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpServletRequest;

public class HttpConverter {
    
    // Set of headers that are restricted by HttpRequest
    private static final Set<String> RESTRICTED_HEADERS = Set.of(
            "host", "connection", "content-length", "expect", "upgrade"
    );

    public static HttpRequest convert(HttpServletRequest servletRequest) throws IOException {
        // Create the request builder with URI and method
        HttpRequest.Builder requestBuilder = createBaseRequestBuilder(servletRequest);
        
        // Add non-restricted headers
        addNonRestrictedHeaders(servletRequest, requestBuilder);
        
        return requestBuilder.build();
    }

    private static HttpRequest.Builder createBaseRequestBuilder(HttpServletRequest servletRequest) {
        return HttpRequest.newBuilder()
                .uri(URI.create(servletRequest.getRequestURL().toString()))
                .method(servletRequest.getMethod(), HttpRequest.BodyPublishers.noBody());
    }
    
    private static void addNonRestrictedHeaders(HttpServletRequest servletRequest, HttpRequest.Builder requestBuilder) {
        Enumeration<String> headerNames = servletRequest.getHeaderNames();
        
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement().toLowerCase();
            if (!RESTRICTED_HEADERS.contains(headerName)) {
                requestBuilder.header(headerName, servletRequest.getHeader(headerName));
            }
        }
    }
}