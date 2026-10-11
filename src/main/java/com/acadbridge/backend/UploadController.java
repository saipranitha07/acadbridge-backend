
package com.acadbridge.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/resources")
public class UploadController {

    private final JdbcTemplate jdbc;

    private final Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

    public UploadController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostMapping(
        value = "/upload",
        consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadResource(
            @RequestParam String title,
            @RequestParam String description,
            @RequestParam String subject,
            @RequestParam("file") MultipartFile file) {

        if (title.isBlank() || description.isBlank()
                || subject.isBlank() || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please fill all required fields."
            );
        }

        String originalName = file.getOriginalFilename();

        if (originalName == null ||
                !originalName.toLowerCase().endsWith(".pdf")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Please upload a PDF file."
            );
        }

        if (file.getSize() > 20L * 1024 * 1024) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "PDF must be smaller than 20 MB."
            );
        }

        Integer subjectId = jdbc.query(
                "SELECT subject_id FROM subjects " +
                "WHERE LOWER(subject_name) = LOWER(?)",
                rs -> rs.next() ? rs.getInt("subject_id") : null,
                subject.trim()
        );

        if (subjectId == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Subject not found. Use an existing subject, " +
                    "such as Java Programming or DBMS."
            );
        }

        String savedName = UUID.randomUUID() + ".pdf";
        Path destination = uploadDirectory.resolve(savedName).normalize();

        if (!destination.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid file path."
            );
        }

        try {
            Files.createDirectories(uploadDirectory);
            file.transferTo(destination);

            jdbc.update(
                    "INSERT INTO resources " +
                    "(title, description, file_path, uploaded_by, subject_id) " +
                    "VALUES (?, ?, ?, 1, ?)",
                    title.trim(),
                    description.trim(),
                    "uploads/" + savedName,
                    subjectId
            );

            Integer resourceId = jdbc.queryForObject(
                    "SELECT LAST_INSERT_ID()", Integer.class
            );

            return ResponseEntity.ok(Map.of(
                    "message", "Resource uploaded successfully",
                    "resourceId", resourceId
            ));

        } catch (IOException ex) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save the PDF."
            );
        }
    }
}
