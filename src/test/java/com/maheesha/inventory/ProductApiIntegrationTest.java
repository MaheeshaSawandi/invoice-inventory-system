package com.maheesha.inventory;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Starts the full app on H2 and calls the real endpoints. */
@SpringBootTest
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class ProductApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private static final String VALID_PRODUCT = """
            {"sku":"tst-001","name":"Test Item","unitPrice":100.50,"quantityInStock":3,"reorderLevel":5}
            """;

    @Test
    void createProduct_returns201_andMarksLowStock() throws Exception {
        mockMvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(VALID_PRODUCT))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.sku").value("TST-001"))
                .andExpect(jsonPath("$.lowStock").value(true));
    }

    @Test
    void createProduct_withDuplicateSku_returns409() throws Exception {
        mockMvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(VALID_PRODUCT))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(VALID_PRODUCT))
                .andExpect(status().isConflict());
    }

    @Test
    void createProduct_withInvalidData_returns400_withFieldErrors() throws Exception {
        String invalid = """
                {"sku":"","name":"X","unitPrice":-5,"quantityInStock":-1,"reorderLevel":0}
                """;
        mockMvc.perform(post("/api/products").contentType(MediaType.APPLICATION_JSON).content(invalid))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.sku").exists())
                .andExpect(jsonPath("$.fieldErrors.unitPrice").exists())
                .andExpect(jsonPath("$.fieldErrors.quantityInStock").exists());
    }

    @Test
    void getMissingProduct_returns404() throws Exception {
        mockMvc.perform(get("/api/products/9999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Product not found with id 9999"));
    }

    @Test
    void lowStockEndpoint_returnsOnlyLowStockProducts() throws Exception {
        // Sample data: 1 of the 3 dev products is low stock (A4 book: 15 <= 20)
        mockMvc.perform(get("/api/products/low-stock"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].sku").value("BK-A4-200"));
    }

    @Test
    void deleteProduct_returns204_thenGetReturns404() throws Exception {
        mockMvc.perform(delete("/api/products/1")).andExpect(status().isNoContent());
        mockMvc.perform(get("/api/products/1")).andExpect(status().isNotFound());
    }
}
