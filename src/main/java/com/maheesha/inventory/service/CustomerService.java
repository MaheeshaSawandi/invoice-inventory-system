package com.maheesha.inventory.service;

import com.maheesha.inventory.dto.CustomerRequest;
import com.maheesha.inventory.dto.CustomerResponse;
import com.maheesha.inventory.dto.PageResponse;
import com.maheesha.inventory.entity.Customer;
import com.maheesha.inventory.exception.DuplicateResourceException;
import com.maheesha.inventory.exception.ResourceNotFoundException;
import com.maheesha.inventory.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CustomerService {

    private final CustomerRepository customerRepository;

    @Transactional
    public CustomerResponse create(CustomerRequest request) {
        String email = request.email().trim();
        if (customerRepository.existsByEmailIgnoreCase(email)) {
            throw new DuplicateResourceException("A customer with email '" + email + "' already exists");
        }
        Customer customer = new Customer();
        apply(customer, request);
        return CustomerResponse.from(customerRepository.save(customer));
    }

    public CustomerResponse getById(Long id) {
        return CustomerResponse.from(findOrThrow(id));
    }

    public PageResponse<CustomerResponse> getAll(String search, Pageable pageable) {
        Page<Customer> page = StringUtils.hasText(search)
                ? customerRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : customerRepository.findAll(pageable);
        return PageResponse.from(page.map(CustomerResponse::from));
    }

    @Transactional
    public CustomerResponse update(Long id, CustomerRequest request) {
        Customer customer = findOrThrow(id);
        String email = request.email().trim();
        if (customerRepository.existsByEmailIgnoreCaseAndIdNot(email, id)) {
            throw new DuplicateResourceException("A customer with email '" + email + "' already exists");
        }
        apply(customer, request);
        return CustomerResponse.from(customer);
    }

    @Transactional
    public void delete(Long id) {
        customerRepository.delete(findOrThrow(id));
    }

    private Customer findOrThrow(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", id));
    }

    private void apply(Customer customer, CustomerRequest request) {
        customer.setName(request.name().trim());
        customer.setEmail(request.email().trim().toLowerCase());
        customer.setPhone(request.phone());
        customer.setAddress(request.address());
    }
}
