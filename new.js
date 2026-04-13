document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('productForm');
    const categorySelect = document.getElementById('productCategory');
    const categoryFields = {
        coffee: document.getElementById('coffeeFields'),
        tea: document.getElementById('teaFields'),
        desserts: document.getElementById('dessertsFields')
    };
    const imageUpload = document.getElementById('imageUpload');
    const fileInput = document.getElementById('fileInput');
    const imagePreview = document.getElementById('imagePreview');
    const sizeOptions = document.getElementById('sizeOptions');
    const sizeCheckboxes = document.querySelectorAll('.size-checkbox');
    let uploadedImages = [];

    function toggleCategoryFields() {
        const selectedCategory = categorySelect.value;
        Object.values(categoryFields).forEach(fields => {
            fields.classList.remove('active');
        });
        if (categoryFields[selectedCategory]) {
            categoryFields[selectedCategory].classList.add('active');
        }
    }

    function setMinDate() {
        const dateField = document.getElementById('productDate');
        const today = new Date().toISOString().split('T')[0];
        dateField.min = today;
        
        if (!dateField.value) {
            dateField.value = today;
        }
    }

    function validateProductName() {
        const name = document.getElementById('productName').value.trim();
        const errorElement = document.getElementById('productNameError');
        const inputElement = document.getElementById('productName');
        
        const regex = /^[А-Яа-яёЁ\s\-]{3,20}$/;
        
        if (!name) {
            showError(inputElement, errorElement, 'Название товара обязательно');
            return false;
        }
        if (!regex.test(name)) {
            showError(inputElement, errorElement, 'Только русские буквы, пробелы и дефисы, от 3 до 20 символов');
            return false;
        }
        showSuccess(inputElement, errorElement);
        return true;
    }

    function validateProductDescription() {
        const field = document.getElementById('productDescription');
        const value = field.value.trim();
        const errorElement = document.getElementById('productDescriptionError');
        const inputElement = field;
        
        if (!value) {
            showError(inputElement, errorElement, 'Описание обязательно');
            return false;
        }
        if (value.endsWith(',')) {
            showError(inputElement, errorElement, 'Текст не должен заканчиваться запятой');
            return false;
        }
        if (value.endsWith('-')) {
            showError(inputElement, errorElement, 'Текст не должен заканчиваться дефисом');
            return false;
        }
        const regex = /^[А-Яа-яёЁ\s\.,\-]*$/;
        if (!regex.test(value)) {
            showError(inputElement, errorElement, 'Только русские буквы, пробелы и знаки препинания');
            return false;
        }
        if (value.length < 20 || value.length > 1000) {
            showError(inputElement, errorElement, 'Длина должна быть от 20 до 1000 символов');
            return false;
        }
        showSuccess(inputElement, errorElement);
        return true;
    }

    function validateCategory() {
        const category = categorySelect.value;
        const errorElement = document.getElementById('productCategoryError');
        const inputElement = categorySelect;
        
        if (!category) {
            showError(inputElement, errorElement, 'Выберите категорию');
            return false;
        }
        showSuccess(inputElement, errorElement);
        return true;
    }

    function validateProductDate() {
        const dateField = document.getElementById('productDate');
        const dateValue = dateField.value;
        const errorElement = document.getElementById('productDateError');
        
        if (!dateValue) {
            showError(dateField, errorElement, 'Дата добавления обязательна');
            return false;
        }
        const selectedDate = new Date(dateValue);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);
        if (selectedDate < currentDate) {
            showError(dateField, errorElement, 'Дата не может быть меньше текущей');
            return false;
        }
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        maxDate.setHours(0, 0, 0, 0);
        if (selectedDate > maxDate) {
            showError(dateField, errorElement, 'Дата не может быть больше чем на год вперед');
            return false;
        }
        showSuccess(dateField, errorElement);
        return true;
    }

    function validateIntegerField(fieldId, min, max) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (!value) {
            showError(field, errorElement, 'Это поле обязательно');
            return false;
        }
        const digitsOnly = /^\d+$/;
        if (!digitsOnly.test(value)) {
            showError(field, errorElement, 'Введите только цифры');
            return false;
        }
        if (value.length > 1 && value.startsWith('0')) {
            showError(field, errorElement, 'Число не должно начинаться с 0');
            return false;
        }
        const numValue = parseInt(value);
        if (isNaN(numValue) || !Number.isInteger(numValue)) {
            showError(field, errorElement, 'Введите целое число');
            return false;
        }
        if (numValue < min || numValue > max) {
            showError(field, errorElement, `Число должно быть от ${min} до ${max}`);
            return false;
        }
        showSuccess(field, errorElement);
        return true;
    }

    function validateDecimalField(fieldId, min, max) {
        const field = document.getElementById(fieldId);
        const value = field.value.trim();
        const errorElement = document.getElementById(fieldId + 'Error');
        if (!value) {
            showError(field, errorElement, 'Это поле обязательно');
            return false;
        }
        const decimalRegex = /^\d+(\.\d+)?$/;
        if (!decimalRegex.test(value)) {
            showError(field, errorElement, 'Введите число в формате 2.3 (целая часть, точка, дробная часть)');
            return false;
        }
        const parts = value.split('.');
        const integerPart = parts[0];
        if (integerPart.length > 1 && integerPart.startsWith('0')) {
            showError(field, errorElement, 'Целая часть числа не должна начинаться с 0');
            return false;
        }
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            showError(field, errorElement, 'Введите число');
            return false;
        }
        if (numValue < min || numValue > max) {
            showError(field, errorElement, `Число должно быть от ${min} до ${max}`);
            return false;
        }
        showSuccess(field, errorElement);
        return true;
    }

    function restrictEnergyInput() {
        const energyFields = ['coffeeEnergy'];
        
        energyFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            
            if (field) {
                field.addEventListener('input', function(e) {
                    let newValue = this.value.replace(/[^\d]/g, '');
                    
                    if (newValue.length > 1 && newValue.startsWith('0')) {
                        newValue = newValue.replace(/^0+/, '');
                    }
                    this.value = newValue;
                });
                field.addEventListener('keypress', function(e) {
                    if (!/\d/.test(e.key)) {
                        e.preventDefault();
                    }
                });
            }
        });
    }

    function validateIngredients() {
        const ingredients = document.getElementById('ingredients').value.trim();
        const errorElement = document.getElementById('ingredientsError');
        const inputElement = document.getElementById('ingredients');
        
        if (ingredients) {
            if (ingredients.endsWith(',')) {
                showError(inputElement, errorElement, 'Текст не должен заканчиваться запятой');
                return false;
            }
            if (ingredients.endsWith('-')) {
                showError(inputElement, errorElement, 'Текст не должен заканчиваться дефисом');
                return false;
            }
            const regex = /^[А-Яа-яёЁ\s,\-]*$/;
            if (!regex.test(ingredients)) {
                showError(inputElement, errorElement, 'Только русские буквы, пробелы, запятые и дефисы');
                return false;
            }
        }
        showSuccess(inputElement, errorElement);
        return true;
    }

    function validateBasePrice() {
        const field = document.getElementById('basePrice');
        const value = field.value.trim();
        const errorElement = document.getElementById('basePriceError');
        
        if (!value) {
            showError(field, errorElement, 'Базовая цена обязательна');
            return false;
        }
        const digitsOnly = /^\d+$/;
        if (!digitsOnly.test(value)) {
            showError(field, errorElement, 'Введите только цифры');
            return false;
        }
        if (value.length > 1 && value.startsWith('0')) {
            showError(field, errorElement, 'Цена не должна начинаться с 0');
            return false;
        }
        const numValue = parseInt(value);
        if (isNaN(numValue)) {
            showError(field, errorElement, 'Введите число');
            return false;
        }
        if (numValue < 200 || numValue > 2500) {
            showError(field, errorElement, 'Цена должна быть от 200 до 2500 рублей');
            return false;
        }
        showSuccess(field, errorElement);
        return true;
    }

    function restrictBasePriceInput() {
        const basePriceField = document.getElementById('basePrice');
        
        basePriceField.addEventListener('input', function(e) {
            let newValue = this.value.replace(/[^\d]/g, '');
            
            if (newValue.length > 1 && newValue.startsWith('0')) {
                newValue = newValue.replace(/^0+/, '');
            }
            this.value = newValue;
        });
        basePriceField.addEventListener('keypress', function(e) {
            if (!/\d/.test(e.key)) {
                e.preventDefault();
            }
        });
    }

    function validateCoffeeFields() {
        let isValid = true;
        
        isValid = validateIntegerField('coffeeEnergy', 10, 1000) && isValid;
        isValid = validateDecimalField('coffeeProteins', 1, 100) && isValid;
        isValid = validateDecimalField('coffeeFats', 1, 100) && isValid;
        isValid = validateDecimalField('coffeeCarbs', 1, 100) && isValid;
        return isValid;
    }

    function validateSizes() {
        const checkedSizes = document.querySelectorAll('.size-checkbox:checked');
        const errorElement = document.getElementById('sizesError');
        if (checkedSizes.length === 0) {
            sizeOptions.classList.add('error');
            errorElement.textContent = 'Выберите хотя бы один размер';
            errorElement.style.display = 'block';
            return false;
        }
        sizeOptions.classList.remove('error');
        errorElement.style.display = 'none';
        return true;
    }

    function validateImages() {
        const errorElement = document.getElementById('imagesError');
        if (uploadedImages.length === 0) {
            imageUpload.classList.add('error');
            errorElement.textContent = 'Загрузите хотя бы одно изображение';
            errorElement.style.display = 'block';
            return false;
        }
        imageUpload.classList.remove('error');
        errorElement.style.display = 'none';
        return true;
    }

    function showError(inputElement, errorElement, message) {
        inputElement.classList.remove('valid');
        inputElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function showSuccess(inputElement, errorElement) {
        inputElement.classList.remove('error');
        inputElement.classList.add('valid');
        errorElement.style.display = 'none';
    }

    function clearValidation(inputElement, errorElement) {
        inputElement.classList.remove('error', 'valid');
        errorElement.style.display = 'none';
    }

    function handleImageUpload(files) {
        for (let file of files) {
            if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
                alert('Разрешены только файлы JPG и PNG');
                continue;
            }
            if (file.size > 5 * 1024 * 1024) {
                alert('Размер файла не должен превышать 5MB');
                continue;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageData = {
                    id: Date.now() + Math.random(),
                    file: file,
                    dataUrl: e.target.result
                };
                uploadedImages.push(imageData);
                updateImagePreview();
                validateImages();
            };
            reader.readAsDataURL(file);
        }
    }

    function updateImagePreview() {
        imagePreview.innerHTML = '';
        
        uploadedImages.forEach((image, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'preview-item';
            
            const img = document.createElement('img');
            img.src = image.dataUrl;
            img.alt = 'Preview';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-image';
            removeBtn.textContent = '×';
            removeBtn.onclick = function() {
                uploadedImages.splice(index, 1);
                updateImagePreview();
                validateImages();
            };
            previewItem.appendChild(img);
            previewItem.appendChild(removeBtn);
            imagePreview.appendChild(previewItem);
        });
    }

    function validateForm() {
        let isValid = true;
        
        isValid = validateProductName() && isValid;
        isValid = validateProductDescription() && isValid;
        isValid = validateCategory() && isValid;
        isValid = validateProductDate() && isValid;
        
        const category = categorySelect.value;
        if (category === 'coffee') {
            isValid = validateCoffeeFields() && isValid;
        }
        
        isValid = validateSizes() && isValid;
        isValid = validateBasePrice() && isValid;
        isValid = validateImages() && isValid;
        isValid = validateIngredients() && isValid;
        return isValid;
    }

    function getFormData() {
        const selectedSizes = Array.from(document.querySelectorAll('.size-checkbox:checked'))
            .map(checkbox => checkbox.value)
            .join(',');
        
        const photo = uploadedImages.length > 0 ? uploadedImages[0].dataUrl : '';
        
        const category = categorySelect.value;
        let fullDescription = `${document.getElementById('productDescription').value.trim()}\n`;
        
        let ingredientsValue = document.getElementById('ingredients').value.trim();
        ingredientsValue = ingredientsValue.replace(/,\s*/g, ',');
        ingredientsValue = ingredientsValue.trim();
        const processedIngredients = ingredientsValue || null;

        const formData = {
            photo: photo,
            name: document.getElementById('productName').value.trim(),
            stars: 0,
            cost: parseInt(document.getElementById('basePrice').value),
            ingredients: processedIngredients,
            sizes: selectedSizes,
            description: fullDescription
        };
        
        return formData;
    }

    async function sendEmailStub(emailData) {
        console.log('=== ЗАГЛУШКА: ОТПРАВКА ПИСЬМА (НИКУДА НЕ ОТПРАВЛЯЕТСЯ) ===');
        console.log('Тема:', emailData.subject);
        console.log('Кому:', emailData.to);
        console.log('Текст письма:', emailData.text);
        console.log('=== КОНЕЦ ЗАГЛУШКИ ===');
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { success: true, message: 'Письмо (заглушка) успешно "отправлено"' };
    }

    async function submitFormToServer(formData) {
        try {
            const response = await fetch('http://45.131.214.123:7070/api/catalog/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Ответ сервера (БД):', result);
            return { success: true, data: result };
        } catch (error) {
            console.error('Ошибка при отправке данных в БД:', error);
            return { success: false, error: error.message };
        }
    }

    function initEvents() {
        categorySelect.addEventListener('change', toggleCategoryFields);
        
        document.getElementById('productName').addEventListener('input', validateProductName);
        document.getElementById('productDescription').addEventListener('input', validateProductDescription);
        document.getElementById('productDate').addEventListener('change', validateProductDate);
        categorySelect.addEventListener('change', validateCategory);
        
        document.getElementById('basePrice').addEventListener('input', validateBasePrice);
        restrictBasePriceInput();
        restrictEnergyInput();
        
        document.getElementById('coffeeEnergy').addEventListener('input', function() {
            validateIntegerField('coffeeEnergy', 10, 1000);
        });
        document.getElementById('coffeeProteins').addEventListener('input', function() {
            validateDecimalField('coffeeProteins', 1, 100);
        });
        document.getElementById('coffeeFats').addEventListener('input', function() {
            validateDecimalField('coffeeFats', 1, 100);
        });
        document.getElementById('coffeeCarbs').addEventListener('input', function() {
            validateDecimalField('coffeeCarbs', 1, 100);
        });
        
        sizeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateSizes);
        });
        document.getElementById('ingredients').addEventListener('input', validateIngredients);
        
        imageUpload.addEventListener('click', function() {
            fileInput.click();
        });
        imageUpload.addEventListener('dragover', function(e) {
            e.preventDefault();
            imageUpload.style.borderColor = '#3498db';
        });
        imageUpload.addEventListener('dragleave', function() {
            imageUpload.style.borderColor = '#e1e8ed';
        });
        imageUpload.addEventListener('drop', function(e) {
            e.preventDefault();
            imageUpload.style.borderColor = '#e1e8ed';
            const files = e.dataTransfer.files;
            handleImageUpload(files);
        });
        fileInput.addEventListener('change', function() {
            handleImageUpload(this.files);
            this.value = '';
        });
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                const formData = getFormData();
                console.log('Данные для отправки:', formData);
                
                const submitBtn = document.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                // Удалена отправка email, так как поле adminEmail убрано
                console.log('Отправка email пропущена (поле adminEmail удалено)');
                
                const dbResult = await submitFormToServer(formData);
                
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                
                if (dbResult.success) {
                    alert('Товар успешно добавлен в каталог!');
                    form.reset();
                    uploadedImages = [];
                    updateImagePreview();
                    
                    document.querySelectorAll('.form-control').forEach(input => {
                        input.classList.remove('valid', 'error');
                    });
                    document.querySelectorAll('.error-message').forEach(error => {
                        error.style.display = 'none';
                    });
                    sizeOptions.classList.remove('error');
                    imageUpload.classList.remove('error');
                    
                    toggleCategoryFields();
                    setMinDate();
                } else {
                    alert(`Ошибка при добавлении товара: ${dbResult.error}`);
                }
            } else {
                alert('Пожалуйста, исправьте ошибки в форме');
            }
        });
    }
    toggleCategoryFields();
    setMinDate();
    initEvents();
});