
package com.acadbridge.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resources")
public class SubjectController {

    private final JdbcTemplate jdbc;

    public SubjectController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/subjects")
    public List<Map<String, String>> getSubjects() {
        return jdbc.query(
            "SELECT subject_name FROM subjects ORDER BY subject_name",
            (rs, rowNum) -> Map.of(
                "subjectName",
                rs.getString("subject_name")
            )
        );
    }
}
