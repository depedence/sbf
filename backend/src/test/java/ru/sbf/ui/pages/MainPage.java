package ru.sbf.ui.pages;

import com.codeborne.selenide.*;

public class MainPage {

    public MainPage checkUrl() {
        Selenide.webdriver().shouldHave(WebDriverConditions.url(Configuration.baseUrl + "/dashboard"));
        return this;
    }
}