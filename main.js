//HTTP REQUEST GETALL
const API_URL = 'https://api.escuelajs.co/api/v1/products'
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let itemsPerPage = 10;
let titleSortOrder = 'none';
let priceSortOrder = 'none';

async function GetAllData() {
    try {
        let res = await fetch(API_URL);
        allProducts = await res.json();
        filteredProducts = allProducts;
        DisplayProducts();
    } catch (error) {
        console.log('Error fetching products:', error);
    }
}

function DisplayProducts() {
    let body_of_table = document.getElementById('table-body')
    body_of_table.innerHTML = "";
    
    let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = Math.min(startIndex + itemsPerPage, filteredProducts.length);
    let productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    for (const product of productsToShow) {
        let imagesHtml = '';
        if (product.images && product.images.length > 0) {
            for (let i = 0; i < Math.min(3, product.images.length); i++) {
                imagesHtml += '<img src="' + product.images[i] + '" alt="' + product.title + '" referrerpolicy="no-referrer">';
            }
        } else {
            imagesHtml = '<img src="https://via.placeholder.com/80" alt="No image" referrerpolicy="no-referrer">';
        }
        
        let description = product.description || 'Không có mô tả';
        
        let row = document.createElement('tr');
        row.innerHTML = '<td>' + product.id + '</td>' +
            '<td><div class="image-container">' + imagesHtml + '</div></td>' +
            '<td>' + product.title + '</td>' +
            '<td>' + description + '</td>' +
            '<td>$' + product.price + '</td>' +
            '<td>' + (product.category?.name || 'N/A') + '</td>';
        
        // Lưu description vào data attribute
        row.dataset.description = description;
        
        // Thêm sự kiện hover để hiển thị tooltip
        row.addEventListener('mouseenter', function() {
            let tooltip = document.getElementById('global-tooltip');
            tooltip.textContent = this.dataset.description;
            tooltip.classList.add('show');
        });
        
        row.addEventListener('mouseleave', function() {
            let tooltip = document.getElementById('global-tooltip');
            tooltip.classList.remove('show');
        });
        
        body_of_table.appendChild(row);
    }
    
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function SearchProducts() {
    let searchValue = document.getElementById('searchInput').value.toLowerCase();
    filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchValue)
    );
    currentPage = 1;
    DisplayProducts();
}

function ChangeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1;
    DisplayProducts();
}

function PreviousPage() {
    if (currentPage > 1) {
        currentPage--;
        DisplayProducts();
    }
}

function NextPage() {
    let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        DisplayProducts();
    }
}

function SortByTitle() {
    if (titleSortOrder === 'none' || titleSortOrder === 'desc') {
        titleSortOrder = 'asc';
        filteredProducts.sort((a, b) => a.title.localeCompare(b.title));
        document.getElementById('sortTitleBtn').textContent = 'Tên A-Z ↑';
        document.getElementById('sortTitleBtn').classList.add('active');
    } else {
        titleSortOrder = 'desc';
        filteredProducts.sort((a, b) => b.title.localeCompare(a.title));
        document.getElementById('sortTitleBtn').textContent = 'Tên Z-A ↓';
        document.getElementById('sortTitleBtn').classList.add('active');
    }
    
    priceSortOrder = 'none';
    document.getElementById('sortPriceBtn').textContent = 'Giá ⇅';
    document.getElementById('sortPriceBtn').classList.remove('active');
    
    currentPage = 1;
    DisplayProducts();
}

function SortByPrice() {
    if (priceSortOrder === 'none' || priceSortOrder === 'desc') {
        priceSortOrder = 'asc';
        filteredProducts.sort((a, b) => a.price - b.price);
        document.getElementById('sortPriceBtn').textContent = 'Giá Tăng ↑';
        document.getElementById('sortPriceBtn').classList.add('active');
    } else {
        priceSortOrder = 'desc';
        filteredProducts.sort((a, b) => b.price - a.price);
        document.getElementById('sortPriceBtn').textContent = 'Giá Giảm ↓';
        document.getElementById('sortPriceBtn').classList.add('active');
    }
    
    titleSortOrder = 'none';
    document.getElementById('sortTitleBtn').textContent = 'Tên A-Z ⇅';
    document.getElementById('sortTitleBtn').classList.remove('active');
    
    currentPage = 1;
    DisplayProducts();
}

GetAllData();
