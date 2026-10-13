package com.maheesha.inventory.config;

import com.maheesha.inventory.entity.Customer;
import com.maheesha.inventory.entity.Product;
import com.maheesha.inventory.repository.CustomerRepository;
import com.maheesha.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/** Adds a few sample records in the dev profile so Swagger has data to show straight away. */
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataLoader implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }
        productRepository.save(product("PEN-BLU-001", "Blue Ballpoint Pen", "45.00", 200, 50));
        productRepository.save(product("BK-A4-200", "A4 Exercise Book 200 Pages", "320.00", 15, 20));
        productRepository.save(product("CALC-SCI-01", "Scientific Calculator", "4850.00", 8, 5));

        customerRepository.save(customer("Perera Stationers", "orders@pererastationers.lk", "0771234567", "Galle Road, Colombo 03"));
        customerRepository.save(customer("Kandy Book Centre", "info@kandybooks.lk", "0812223344", "Dalada Veediya, Kandy"));
    }

    private Product product(String sku, String name, String price, int qty, int reorder) {
        Product p = new Product();
        p.setSku(sku);
        p.setName(name);
        p.setUnitPrice(new BigDecimal(price));
        p.setQuantityInStock(qty);
        p.setReorderLevel(reorder);
        return p;
    }

    private Customer customer(String name, String email, String phone, String address) {
        Customer c = new Customer();
        c.setName(name);
        c.setEmail(email);
        c.setPhone(phone);
        c.setAddress(address);
        return c;
    }
}
