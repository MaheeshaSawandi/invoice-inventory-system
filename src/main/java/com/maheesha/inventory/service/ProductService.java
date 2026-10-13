package com.maheesha.inventory.service;

import com.maheesha.inventory.dto.PageResponse;
import com.maheesha.inventory.dto.ProductRequest;
import com.maheesha.inventory.dto.ProductResponse;
import com.maheesha.inventory.entity.Product;
import com.maheesha.inventory.exception.DuplicateResourceException;
import com.maheesha.inventory.exception.ResourceNotFoundException;
import com.maheesha.inventory.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductResponse create(ProductRequest request) {
        String sku = request.sku().trim();
        if (productRepository.existsBySkuIgnoreCase(sku)) {
            throw new DuplicateResourceException("A product with SKU '" + sku + "' already exists");
        }
        Product product = new Product();
        apply(product, request);
        return ProductResponse.from(productRepository.save(product));
    }

    public ProductResponse getById(Long id) {
        return ProductResponse.from(findOrThrow(id));
    }

    public PageResponse<ProductResponse> getAll(String search, Pageable pageable) {
        Page<Product> page = StringUtils.hasText(search)
                ? productRepository.findByNameContainingIgnoreCase(search.trim(), pageable)
                : productRepository.findAll(pageable);
        return PageResponse.from(page.map(ProductResponse::from));
    }

    public List<ProductResponse> getLowStock() {
        return productRepository.findLowStockProducts().stream()
                .map(ProductResponse::from)
                .toList();
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = findOrThrow(id);
        String sku = request.sku().trim();
        if (productRepository.existsBySkuIgnoreCaseAndIdNot(sku, id)) {
            throw new DuplicateResourceException("A product with SKU '" + sku + "' already exists");
        }
        apply(product, request);
        return ProductResponse.from(product); // saved automatically at the end of the transaction
    }

    @Transactional
    public void delete(Long id) {
        productRepository.delete(findOrThrow(id));
    }

    private Product findOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", id));
    }

    private void apply(Product product, ProductRequest request) {
        product.setSku(request.sku().trim().toUpperCase());
        product.setName(request.name().trim());
        product.setDescription(request.description());
        product.setUnitPrice(request.unitPrice());
        product.setQuantityInStock(request.quantityInStock());
        product.setReorderLevel(request.reorderLevel());
    }
}
