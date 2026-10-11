
package com.acadbridge.backend;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/papers")
public class PaperController {

    private final JdbcTemplate jdbcTemplate;

    private static final Path UPLOAD_DIR =
            Paths.get("uploads", "papers")
                    .toAbsolutePath()
                    .normalize();

    public PaperController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Map<String, Object>> uploadPaper(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("subject") String subject,
            @RequestParam("semester") Integer semester,
            @RequestParam("examYear") Integer examYear,
            @RequestParam("file") MultipartFile file) {

        // 1. Validate text fields.
        if (title == null || title.isBlank()
                || description == null || description.isBlank()
                || subject == null || subject.isBlank()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Title, description and subject are required."
            );
        }

        // 2. Validate semester and examination year.
        if (semester == null || semester < 1 || semester > 8) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Semester must be between 1 and 8."
            );
        }

        if (examYear == null || examYear < 2000 || examYear > 2100) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Enter a valid examination year."
            );
        }

        // 3. Validate the uploaded file.
        if (file == null || file.isEmpty()) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Please select a PDF file."
            );
        }

        if (file.getSize() > 20L * 1024 * 1024) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "The PDF must not exceed 20 MB."
            );
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null
                || !originalFilename.toLowerCase()
                        .endsWith(".pdf")) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Only PDF files are allowed."
            );
        }

        try {
            byte[] signature = file.getInputStream().readNBytes(5);

            if (!"%PDF-".equals(
                    new String(signature, StandardCharsets.US_ASCII))) {
                return error(
                        HttpStatus.BAD_REQUEST,
                        "The selected file is not a valid PDF."
                );
            }
        } catch (IOException exception) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Could not read the uploaded PDF."
            );
        }

        // 4. Find the selected subject in MySQL.
        Integer subjectId;

        try {
            subjectId = jdbcTemplate.queryForObject(
                    "SELECT subject_id FROM subjects WHERE subject_name = ?",
                    Integer.class,
                    subject.trim()
            );
        } catch (EmptyResultDataAccessException exception) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Subject not found. Choose a subject from the database."
            );
        }

        // 5. Generate a safe filename.
        String savedFilename = UUID.randomUUID() + ".pdf";
        Path savedFile = UPLOAD_DIR.resolve(savedFilename).normalize();

        if (!savedFile.startsWith(UPLOAD_DIR)) {
            return error(
                    HttpStatus.BAD_REQUEST,
                    "Invalid file path."
            );
        }

        boolean fileSaved = false;

        try {
            // 6. Store the physical PDF file.
            Files.createDirectories(UPLOAD_DIR);
            Files.copy(file.getInputStream(), savedFile);
            fileSaved = true;

            String relativeFilePath =
                    "uploads/papers/" + savedFilename;

            // 7. Store the paper metadata in MySQL.
            String sql = """
                    INSERT INTO resources
                    (title, description, file_path, uploaded_by,
                     subject_id, resource_type, semester, exam_year)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """;

            // Temporary uploader ID, matching your existing upload setup.
            int rowsInserted = jdbcTemplate.update(
                    sql,
                    title.trim(),
                    description.trim(),
                    relativeFilePath,
                    1,
                    subjectId,
                    "paper",
                    semester,
                    examYear
            );

            if (rowsInserted != 1) {
                throw new IllegalStateException(
                        "Paper details were not saved."
                );
            }

            Map<String, Object> response = new LinkedHashMap<>();
            response.put("success", true);
            response.put(
                    "message",
                    "Question paper uploaded successfully."
            );
            response.put("fileName", savedFilename);
            response.put("subject", subject.trim());
            response.put("semester", semester);
            response.put("examYear", examYear);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);

        } catch (Exception exception) {
            // Remove the stored file if the database insert fails.
            if (fileSaved) {
                try {
                    Files.deleteIfExists(savedFile);
                } catch (IOException cleanupException) {
                    exception.addSuppressed(cleanupException);
                }
            }

            exception.printStackTrace();

            return error(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Paper upload failed. Check the backend console."
            );
        }
    }

    private ResponseEntity<Map<String, Object>> error(
            HttpStatus status,
            String message) {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("success", false);
        response.put("message", message);

        return ResponseEntity.status(status).body(response);
    }
}
