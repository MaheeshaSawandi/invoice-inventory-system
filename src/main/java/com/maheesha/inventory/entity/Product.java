package com.maheesha.inventory.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "products")
public class Product extends BaseEntity {

    /** Stock keeping unit, e.g. "PEN-BLU-001". Unique per product. */
    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 500)
    private String description;

    /** Money is stored as BigDecimal, never double, to avoid rounding errors. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false)
    private Integer quantityInStock;

    /** When stock falls to this level or below, the product shows as low stock. */
    @Column(nullable = false)
    private Integer reorderLevel;

    public boolean isLowStock() {
        return quantityInStock <= reorderLevel;
    }
}
