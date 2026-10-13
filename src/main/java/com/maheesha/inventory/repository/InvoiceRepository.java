package com.maheesha.inventory.repository;

import com.maheesha.inventory.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

/** Used from tomorrow, when the invoice logic is added. */
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
