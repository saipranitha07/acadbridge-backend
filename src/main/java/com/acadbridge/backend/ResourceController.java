
package com.acadbridge.backend;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ResourceController {

    private final JdbcTemplate jdbcTemplate;

    public ResourceController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/resources")
    public List<Map<String, Object>> getResources() {

        String sql = """
            SELECT
                r.resource_id AS resourceId,
                r.title AS title,
                r.description AS description,
                r.file_path AS filePath,
                r.created_at AS createdAt,
                r.resource_type AS resourceType,
                r.semester AS semester,
                r.exam_year AS examYear,
                s.subject_name AS subject,
                u.full_name AS uploadedBy,
                b.branch_name AS branch
            FROM resources r
            JOIN subjects s
                ON r.subject_id = s.subject_id
            JOIN users u
                ON r.uploaded_by = u.user_id
            LEFT JOIN branches b
                ON u.branch_id = b.branch_id
            ORDER BY r.created_at DESC
            """;

        return jdbcTemplate.queryForList(sql);
    }
}
