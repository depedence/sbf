package ru.sbf.dto.request;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RegisterRequest {
    String name;
    String email;
    String password;
}