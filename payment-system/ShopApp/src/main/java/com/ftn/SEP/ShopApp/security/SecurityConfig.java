package com.ftn.SEP.ShopApp.security;

import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/payment/callback/**",
                                "/auth/**",
                                "/error"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/cars").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginProcessingUrl("/auth/login")
                        .successHandler(jsonSuccessHandler())
                        .failureHandler(jsonFailureHandler())
                        .permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) ->
                                res.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                )
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public AuthenticationSuccessHandler jsonSuccessHandler() {
        return (request, response, authentication) -> {
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String username = authentication.getName();

            String rolesJson = authentication.getAuthorities().stream()
                    .map(a -> "\"" + a.getAuthority() + "\"")
                    .reduce((a, b) -> a + "," + b)
                    .map(s -> "[" + s + "]")
                    .orElse("[]");

            String json = "{\"authenticated\":true,\"username\":\"" + username + "\",\"roles\":" + rolesJson + "}";

            response.getWriter().write(json);
        };
    }

    @Bean
    public AuthenticationFailureHandler jsonFailureHandler() {
        return (request, response, exception) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"authenticated\":false}");
        };
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return new org.springframework.security.provisioning.InMemoryUserDetailsManager(
                User.withUsername("user")
                        .password("user")
                        .roles("USER")
                        .build(),
                User.withUsername("admin")
                        .password("admin")
                        .roles("ADMIN")
                        .build()
        );
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("https://localhost:4200"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Set-Cookie"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }


    @SuppressWarnings("deprecation")
    @Bean
    public static NoOpPasswordEncoder passwordEncoder() {
        return (NoOpPasswordEncoder) NoOpPasswordEncoder.getInstance();
    }

    @PostConstruct
    public void test() {
        System.out.println("SECURITY CONFIG LOADED");
    }
}
