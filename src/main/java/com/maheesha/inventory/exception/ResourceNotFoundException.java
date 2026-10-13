package com.maheesha.inventory.exception;

/** Thrown when a record with the given id does not exist. Returns HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resource, Long id) {
        super(resource + " not found with id " + id);
    }
}
