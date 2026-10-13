package com.maheesha.inventory.dto;

import com.maheesha.inventory.entity.Customer;

import java.time.LocalDateTime;

public record CustomerResponse(
        Long id,
        String name,
        String email,
        String phone,
        String address,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static CustomerResponse from(Customer c) {
        return new CustomerResponse(
                c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getAddress(),
                c.getCreatedAt(), c.getUpdatedAt());
    }
}
