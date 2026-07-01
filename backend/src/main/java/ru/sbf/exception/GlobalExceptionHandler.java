package ru.sbf.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ru.sbf.dto.response.MessageResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AppException.NotFoundException.class)
    public ResponseEntity<MessageResponse> handleNotFound(AppException.NotFoundException e) {
        return ResponseEntity.status(404).body(new MessageResponse(e.getMessage()));
    }

    @ExceptionHandler(AppException.AccessDeniedException.class)
    public ResponseEntity<MessageResponse> handleAccessDenied(AppException.AccessDeniedException e) {
        return ResponseEntity.status(403).body(new MessageResponse(e.getMessage()));
    }

    @ExceptionHandler(AppException.AlreadyExistsException.class)
    public ResponseEntity<MessageResponse> handleAlreadyExists(AppException.AlreadyExistsException e) {
        return ResponseEntity.status(409).body(new MessageResponse(e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageResponse> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(400).body(new MessageResponse(e.getMessage()));
    }
}