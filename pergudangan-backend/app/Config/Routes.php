<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */

$routes->group('api', ['namespace' => 'App\Controllers', 'filter' => 'jwtAuth'], function ($routes) {
    //* Routes for Items
    $routes->resource('items', ['controller' => 'ItemsController']);
    // $routes->get('items', 'ItemsController::index');
    // $routes->post('items', 'ItemsController::create');
    // $routes->get('items/(:num)', 'ItemsController::show/$1');
    // $routes->put('items/(:num)', 'ItemsController::update/$1');
    // $routes->delete('items/(:num)', 'ItemsController::delete/$1');

    //* Routes for Categories
    $routes->resource('categories', ['controller' => 'CategoriesController']);
    // $routes->get('categories', 'CategoriesController::index');
    
    //* Routes for Suppliers
    $routes->resource('suppliers', ['controller' => 'SuppliersController']);
    // $routes->get('suppliers', 'SuppliersController::index');
    // $routes->get('suppliers/(:num)', 'SuppliersController::show/$1');
    
    $routes->group('', ['namespace' => 'App\Controllers', 'filter' => 'role:admin'], function ($routes) {
        // $routes->post('categories', 'CategoriesController::create');
        // $routes->put('categories/(:num)', 'CategoriesController::update/$1');
        // $routes->delete('categories/(:num)', 'CategoriesController::delete/$1');
        
        // $routes->post('suppliers', 'SuppliersController::create');
        // $routes->put('suppliers/(:num)', 'SuppliersController::update/$1');
        // $routes->delete('suppliers/(:num)', 'SuppliersController::delete/$1');
        
    });

    //* Routes for Stocks
    // $routes->resource('stocks', ['controller' => 'StocksController']);

    //* Routes for Transactions
    $routes->resource('transactions', ['controller' => 'TransactionsController']);
    // $routes->get('transactions', 'TransactionsController::index');
    // $routes->post('transactions', 'TransactionsController::create'); 
    // $routes->get('transactions/(:num)', 'TransactionsController::show/$1');

});

// Routes for Auth (no authentication needed)
$routes->post('auth/login', 'AuthController::login');
$routes->post('auth/register', 'AuthController::create');
$routes->options('(:any)', 'Preflight::options');