package ru.sbf.ui.pages;

import com.codeborne.selenide.*;

public class MainPage1 {

    public MainPage1 checkUrl() {
        Selenide.webdriver().shouldHave(WebDriverConditions.url(Configuration.baseUrl + "/dashboard"));
        return this;
    }
}
