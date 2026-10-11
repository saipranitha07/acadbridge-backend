package com.acadbridge.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DatabaseController {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/db-test")
    public Map<String, Object> testDatabase() {
        Integer branchCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM branches",
            Integer.class
        );

        return Map.of(
            "status", "Connected",
            "database", "acadbridge",
            "branchesCount", branchCount
        );
    }
}