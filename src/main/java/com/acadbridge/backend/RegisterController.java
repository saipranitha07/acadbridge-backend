
package com.acadbridge.backend;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class RegisterController {

    private final JdbcTemplate jdbc;
    private final BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    public RegisterController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostMapping("/register")
    public Map<String, String> register(
            @RequestBody Map<String, String> body) {

        String fullName = body.getOrDefault("fullName", "").trim();
        String email = body.getOrDefault("email", "")
                .trim().toLowerCase();
        String password = body.getOrDefault("password", "");
        String branch = body.getOrDefault("branch", "").trim();
        String batchYear = body.getOrDefault("batchYear", "").trim();

        if (fullName.isBlank() || email.isBlank()
                || password.length() < 8
                || branch.isBlank() || batchYear.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Fill all required fields. Password must have at least 8 characters.");
        }

        Integer branchId = jdbc.query(
                "SELECT branch_id FROM branches WHERE branch_name = ?",
                rs -> rs.next() ? rs.getInt("branch_id") : null,
                branch);

        if (branchId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please select a valid branch.");
        }

        int year;
        try {
            year = Integer.parseInt(batchYear);
        } catch (NumberFormatException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid batch year.");
        }

        try {
            jdbc.update(
                    "INSERT INTO users " +
                    "(full_name, email, password_hash, role, branch_id, batch_year) " +
                    "VALUES (?, ?, ?, 'STUDENT', ?, ?)",
                    fullName, email, encoder.encode(password),
                    branchId, year);
        } catch (DuplicateKeyException ex) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "An account with this email already exists.");
        }

        return Map.of(
                "message", "Account registered successfully.");
    }
}
