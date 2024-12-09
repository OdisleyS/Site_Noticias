package com.example.atividade1.controller;

import com.example.atividade1.model.NewsItem;
import com.example.atividade1.model.Category;
import com.example.atividade1.service.NewsService;
import com.example.atividade1.service.CategoryService;
import com.example.atividade1.repository.NewsItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/news")
public class NewsController {

    @Autowired
    private NewsItemRepository newsItemRepository;

    @Autowired
    private final NewsService newsService;

    @Autowired
    private CategoryService categoryService;

    private static final Logger logger = LoggerFactory.getLogger(NewsController.class);

    @Autowired
    public NewsController(NewsService newsService, CategoryService categoryService) {
        this.newsService = newsService;
        this.categoryService = categoryService;
    }

    @GetMapping("/recent")
    public ResponseEntity<List<NewsItem>> getRecentNews() {
        List<NewsItem> newsItems = newsItemRepository.findAllOrderByPublicationDateDesc();
        return ResponseEntity.ok(newsItems);
    }

    @GetMapping("/category/{categoryId}")
    public List<NewsItem> getNewsByCategory(@PathVariable Long categoryId) {
        return newsItemRepository.findByCategoryIdOrderByPublicationDateDesc(categoryId);
    }

    @GetMapping("/all")
    public List<NewsItem> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        List<Category> categories = categoryService.findAll();
        if (categories.isEmpty()) {
            logger.warn("No categories found");
        } else {
            logger.info("Found {} categories", categories.size());
        }
        return ResponseEntity.ok(categories);
    }
}
