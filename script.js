let exchangeRate = 0;
let items = [];
let productList = [
    { name: "Manzanas", type: "weight" },
    { name: "Pan", type: "unit" },
    { name: "Leche", type: "unit" },
    { name: "Arroz", type: "weight" },
    { name: "Huevos", type: "unit" }
];

function initializeProductList() {
    const itemSelect = document.getElementById('item-select');
    itemSelect.innerHTML = '<option value="">Seleccionar artículo</option>';
    productList.forEach(product => {
        const option = document.createElement('option');
        option.value = product.name;
        option.textContent = product.name;
        itemSelect.appendChild(option);
    });
}

function setExchangeRate() {
    const rateInput = document.getElementById('exchange-rate');
    const newRate = parseFloat(rateInput.value);
    if (newRate > 0) {
        exchangeRate = newRate;
        document.getElementById('exchange-rate-form').style.display = 'none';
        document.getElementById('item-form').style.display = 'block';
        initializeProductList();
        alert(`Tipo de cambio establecido a ${exchangeRate} VES por 1 USD`);
    } else {
        alert('Por favor, ingrese un tipo de cambio válido mayor que 0.');
    }
}

function showNewItemForm() {
    document.getElementById('new-item-form').style.display = 'block';
}

function addNewItem() {
    const newItemName = document.getElementById('new-item-name').value.trim();
    const newItemType = document.getElementById('new-item-type').value;

    if (newItemName) {
        productList.push({ name: newItemName, type: newItemType });
        initializeProductList();
        document.getElementById('item-select').value = newItemName;
        document.getElementById('new-item-name').value = '';
        document.getElementById('new-item-form').style.display = 'none';
        alert(`Nuevo artículo "${newItemName}" agregado a la lista.`);
    } else {
        alert('Por favor, ingrese un nombre para el nuevo artículo.');
    }
}

function toggleUnitSelect() {
    const itemType = document.getElementById('item-type').value;
    const unitSelect = document.getElementById('item-unit');
    const quantityInput = document.getElementById('item-quantity');
    
    if (itemType === 'weight') {
        unitSelect.style.display = 'block';
        quantityInput.placeholder = 'Peso';
    } else {
        unitSelect.style.display = 'none';
        quantityInput.placeholder = 'Cantidad';
    }
}

function addItem() {
    const nameSelect = document.getElementById('item-select');
    const typeSelect = document.getElementById('item-type');
    const quantityInput = document.getElementById('item-quantity');
    const unitSelect = document.getElementById('item-unit');
    const priceInput = document.getElementById('item-price');
    const currencySelect = document.getElementById('item-currency');

    const name = nameSelect.value;
    const type = typeSelect.value;
    const quantity = parseFloat(quantityInput.value);
    const unit = type === 'weight' ? unitSelect.value : 'unidad';
    const price = parseFloat(priceInput.value);
    const currency = currencySelect.value;

    if (name && quantity > 0 && price > 0) {
        const priceUSD = currency === 'USD' ? price : price / exchangeRate;
        const priceVES = currency === 'VES' ? price : price * exchangeRate;
        items.push({ name, type, quantity, unit, priceUSD, priceVES });
        updateItemList();
        updateTotal();
        nameSelect.value = '';
        quantityInput.value = '';
        priceInput.value = '';
    } else {
        alert('Por favor, complete todos los campos correctamente.');
    }
}

function updateItemList() {
    const itemsBody = document.getElementById('items-body');
    itemsBody.innerHTML = '';
    items.forEach((item, index) => {
        const row = itemsBody.insertRow();
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = `${item.quantity} ${item.unit}`;
        row.insertCell(2).textContent = item.priceVES.toFixed(2);
        row.insertCell(3).textContent = item.priceUSD.toFixed(2);
        
        const actionsCell = row.insertCell(4);
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.className = 'action-button edit-button';
        editButton.onclick = () => editItem(index);
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.className = 'action-button delete-button';
        deleteButton.onclick = () => deleteItem(index);
        
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
    });
}

function updateTotal() {
    const totalVES = items.reduce((sum, item) => sum + item.priceVES * item.quantity, 0);
    const totalUSD = items.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
    document.getElementById('total-ves').textContent = totalVES.toFixed(2);
    document.getElementById('total-usd').textContent = totalUSD.toFixed(2);
}

function editItem(index) {
    const item = items[index];
    document.getElementById('item-select').value = item.name;
    document.getElementById('item-type').value = item.type;
    document.getElementById('item-quantity').value = item.quantity;
    if (item.type === 'weight') {
        document.getElementById('item-unit').value = item.unit;
        document.getElementById('item-unit').style.display = 'block';
    } else {
        document.getElementById('item-unit').style.display = 'none';
    }
    document.getElementById('item-price').value = item.priceUSD;
    document.getElementById('item-currency').value = 'USD';

    items.splice(index, 1);
    updateItemList();
    updateTotal();
}

function deleteItem(index) {
    if (confirm('¿Está seguro de que desea eliminar este artículo?')) {
        items.splice(index, 1);
        updateItemList();
        updateTotal();
    }
}

function saveList() {
    const data = {
        exchangeRate: exchangeRate,
        items: items,
        productList: productList
    };
    localStorage.setItem('marketList', JSON.stringify(data));
    alert('Lista guardada correctamente.');
}

function loadList() {
    const savedData = localStorage.getItem('marketList');
    if (savedData) {
        const data = JSON.parse(savedData);
        exchangeRate = data.exchangeRate;
        items = data.items;
        productList = data.productList;
        
        document.getElementById('exchange-rate').value = exchangeRate;
        document.getElementById('exchange-rate-form').style.display = 'none';
        document.getElementById('item-form').style.display = 'block';
        
        initializeProductList();
        updateItemList();
        updateTotal();
        alert('Lista cargada correctamente.');
    } else {
        alert('No hay lista guardada para cargar.');
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    const savedData = localStorage.getItem('marketList');
    if (savedData) {
        document.getElementById('load-list').style.display = 'block';
        const data = JSON.parse(savedData);
        if (data.exchangeRate) {
            exchangeRate = data.exchangeRate;
            document.getElementById('exchange-rate').value = exchangeRate;
            setExchangeRate();
        }
    } else {
        document.getElementById('load-list').style.display = 'none';
    }
    
    document.getElementById('item-type').addEventListener('change', toggleUnitSelect);
    document.getElementById('item-select').addEventListener('change', function() {
        const selectedProduct = productList.find(p => p.name === this.value);
        if (selectedProduct) {
            document.getElementById('item-type').value = selectedProduct.type;
            toggleUnitSelect();
        }
    });
    
    // Agregar event listeners para los botones
    document.getElementById('set-exchange-rate').addEventListener('click', setExchangeRate);
    document.getElementById('show-new-item-form').addEventListener('click', showNewItemForm);
    document.getElementById('add-new-item').addEventListener('click', addNewItem);
    document.getElementById('add-item').addEventListener('click', addItem);
    document.getElementById('save-list').addEventListener('click', saveList);
    document.getElementById('load-list').addEventListener('click', loadList);
    
    toggleUnitSelect();
});