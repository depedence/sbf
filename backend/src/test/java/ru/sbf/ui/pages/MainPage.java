package ru.sbf.ui.pages;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import com.codeborne.selenide.Condition;
import com.codeborne.selenide.ElementsCollection;
import com.codeborne.selenide.Selenide;
import com.codeborne.selenide.SelenideElement;
import com.codeborne.selenide.WebDriverConditions;

public class MainPage {

    public double addMinAndMaxProduct() {
        ElementsCollection items = Selenide.$$(".inventory_item");

        List<Product> products = new ArrayList<>();

        for (SelenideElement item : items) {
            double price = Double.parseDouble(
                    item.$(".inventory_item_price")
                            .getText()
                            .replace("$", ""));

            products.add(new Product(price, item));
        }

        Product cheapest = products.stream()
                .min(Comparator.comparing(Product::price))
                .orElseThrow();

        Product expensive = products.stream()
                .max(Comparator.comparing(Product::price))
                .orElseThrow();

        cheapest.item().$("button").click();
        expensive.item.$("button").click();

        return cheapest.price() + expensive.price();
    }

    public MainPage chechCart() {
        Selenide.$(".shopping_cart_link").shouldBe(Condition.visible);
        return this;
    }

    public MainPage goToOrder(String firstName, String lastName, String postalCode) {
        Selenide.$(".shopping_cart_link").click();
        Selenide.webdriver().shouldHave(WebDriverConditions.url("https://www.saucedemo.com/cart.html"));
        Selenide.$("#checkout").click();
        Selenide.webdriver().shouldHave(WebDriverConditions.url("https://www.saucedemo.com/checkout-step-one.html"));

        Selenide.$("#first-name").setValue(firstName);
        Selenide.$("#last-name").setValue(lastName);
        Selenide.$("#postal-code").setValue(postalCode);

        Selenide.$("#continue").click();
        Selenide.webdriver().shouldHave(WebDriverConditions.url("https://www.saucedemo.com/checkout-step-two.html"));
        return this;
    }

    public double checkTotalPrice() {
        return Double.parseDouble(
                Selenide.$(".summary_subtotal_label")
                        .getText()
                        .replace("Item total: $", ""));
    }

    public void finishOrder() {
        Selenide.$("#finish").click();
        Selenide.$("h2").shouldHave(Condition.text("Thank you for your order!"));
    }

    private record Product(double price, SelenideElement item) {
    }
}
