
package com.acadbridge.backend;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/resources")
public class DownloadController {

    private final JdbcTemplate jdbc;

    public DownloadController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadResource(
            @PathVariable int id) {

        String filePath;

        try {
            filePath = jdbc.queryForObject(
                "SELECT file_path FROM resources WHERE resource_id = ?",
                String.class,
                id
            );
        } catch (org.springframework.dao.EmptyResultDataAccessException ex) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Resource not found."
            );
        }

        Path uploadDirectory =
            Paths.get("uploads").toAbsolutePath().normalize();

        Path file = Paths.get(filePath).toAbsolutePath().normalize();

        if (!file.startsWith(uploadDirectory)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid file path."
            );
        }

        Resource resource = new FileSystemResource(file);

        if (!resource.exists() || !resource.isReadable()) {
            throw new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "The PDF file could not be found on the server."
            );
        }

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .header(
                HttpHeaders.CONTENT_DISPOSITION,
                "attachment; filename=\"" + file.getFileName() + "\""
            )
            .body(resource);
    }
}
