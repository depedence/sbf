package ru.sbf.ui;

import com.codeborne.selenide.Configuration;
import com.codeborne.selenide.Selenide;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import ru.sbf.api.helpers.DataBaseCleaner;
import ru.sbf.dto.request.RegisterRequest;
import ru.sbf.service.AuthService;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("tests")
public abstract class BaseUiTest {

    protected String baseUrl;

    @Autowired
    private AuthService authService;

    @Autowired
    private DataBaseCleaner dataBaseCleaner;

    @BeforeEach
    void setup() {
        dataBaseCleaner.cleanDb();
        baseUrl = "http://localhost:5174";
        Configuration.browser = "chrome";
        Configuration.headless = false;
        Configuration.timeout = 10_000;
        Configuration.baseUrl = baseUrl;

        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@test.com");
        request.setName("test_user");
        request.setPassword("12345678");

        String token = authService.register(request).getToken();

        Selenide.open("/");
        Selenide.localStorage().setItem("token", token);
        Selenide.refresh();
    }

    @AfterEach
    void tearDown() {
        Selenide.closeWebDriver();
    }
}