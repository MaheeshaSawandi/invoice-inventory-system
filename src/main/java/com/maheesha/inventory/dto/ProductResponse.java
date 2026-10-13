package com.maheesha.inventory.dto;

import com.maheesha.inventory.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Data the API returns for a product. Entities are never returned directly. */
public record ProductResponse(
        Long id,
        String sku,
        String name,
        String description,
        BigDecimal unitPrice,
        Integer quantityInStock,
        Integer reorderLevel,
        boolean lowStock,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getSku(), p.getName(), p.getDescription(),
                p.getUnitPrice(), p.getQuantityInStock(), p.getReorderLevel(),
                p.isLowStock(), p.getCreatedAt(), p.getUpdatedAt());
    }
}
