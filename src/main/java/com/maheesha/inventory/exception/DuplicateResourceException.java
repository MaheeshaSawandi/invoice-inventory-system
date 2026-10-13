package com.maheesha.inventory.exception;

/** Thrown when a unique value (SKU, email) is already used. Returns HTTP 409. */
public class DuplicateResourceException extends RuntimeException {

    public DuplicateResourceException(String message) {
        super(message);
    }
}
