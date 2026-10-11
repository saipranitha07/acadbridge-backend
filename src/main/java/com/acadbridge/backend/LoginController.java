
package com.acadbridge.backend;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
public class LoginController {

    private final JdbcTemplate jdbc;
    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public LoginController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestBody Map<String, String> body) {

        String email = body.getOrDefault("email", "")
                .trim().toLowerCase();
        String password = body.getOrDefault("password", "");

        if (email.isBlank() || password.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please enter your email and password.");
        }

        var users = jdbc.query(
                """
                SELECT user_id, full_name, email, password_hash, role
                FROM users
                WHERE email = ?
                """,
                (rs, rowNum) -> new LoginUser(
                        rs.getInt("user_id"),
                        rs.getString("full_name"),
                        rs.getString("email"),
                        rs.getString("password_hash"),
                        rs.getString("role")
                ),
                email
        );

        if (users.isEmpty()
                || !passwordEncoder.matches(
                        password, users.get(0).passwordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Incorrect email or password.");
        }

        LoginUser user = users.get(0);

        return Map.of(
                "message", "Login successful.",
                "userId", user.userId(),
                "fullName", user.fullName(),
                "email", user.email(),
                "role", user.role()
        );
    }

    private record LoginUser(
            int userId,
            String fullName,
            String email,
            String passwordHash,
            String role) {
    }
}
