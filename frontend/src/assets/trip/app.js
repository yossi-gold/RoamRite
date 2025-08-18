// app.js - Frontend logic to interact with the Express backend
// Note: You must have the backend server (server.js) running for this to work.

// --- Variables and DOM Elements ---
const API_URL = 'https://trip-production-fa70.up.railway.app/api';

// Shared elements
const budgetModal = document.getElementById('budget-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const initialBudgetInput = document.getElementById('initial-budget-input');

// Elements specific to trip.html (Add Expense Page)
const expenseForm = document.getElementById('expense-form');
const totalBudgetEl = document.getElementById('total-budget');
const totalSpentEl = document.getElementById('total-spent');
const remainingBalanceEl = document.getElementById('remaining-balance');
const budgetBar = document.getElementById('budget-bar');
const submitBtn = document.getElementById('submit-btn');
const formButtons = document.getElementById('form-buttons');
const editBudgetBtn = document.getElementById('edit-budget-btn');

// Elements specific to expenses.html (View Expenses Page)
const expenseList = document.getElementById('expense-list');
const clearExpensesBtn = document.getElementById('clear-expenses');
const spendingCircleEl = document.getElementById('spending-circle');
const circleTextPrimaryEl = document.getElementById('circle-text-primary');
const circleTextSecondaryEl = document.getElementById('circle-text-secondary');
const circleTextTertiaryEl = document.getElementById('circle-text-tertiary');
const categoryCardsEl = document.getElementById('category-summary-cards'); // NEW: Element for the cards


// --- DUMMY DATA FOR FRONTEND PREVIEW ---
// These expenses are hardcoded to allow the category summary to be displayed.
// When the backend is fixed, this section should be replaced by the original fetch logic.
let expenses = [
    { id: 1, description: 'Dinner at The Mill', amount: '85.50', category: 'Food' },
    { id: 2, description: 'Groceries for the cabin', amount: '120.00', category: 'Food' },
    { id: 3, description: '2 nights at the Tannersville Inn', amount: '450.00', category: 'Lodging' },
    { id: 4, description: 'Lift tickets at Hunter Mountain', amount: '180.00', category: 'Entertainment' },
    { id: 5, description: 'Gas for the car', amount: '55.25', category: 'Transportation' },
    { id: 6, description: 'Souvenirs for family', amount: '40.00', category: 'Shopping' },
    { id: 7, description: 'Brunch at a local cafe', amount: '35.75', category: 'Food' },
    { id: 8, description: 'Firewood', amount: '25.00', category: 'Other' },
    { id: 9, description: 'Cable car ride', amount: '60.00', category: 'Entertainment' }
];

let initialBudget = 1000;
let isEditing = false;
let editingExpenseId = null;

// --- Functions ---

/**
 * Renders the UI for the main trip page (add expense form).
 * This function will not be used with dummy data but is kept for when the backend is restored.
 */
function renderTripPage() {
    if (!totalBudgetEl || !totalSpentEl || !remainingBalanceEl || !budgetBar) return;
    
    let totalSpent = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const remainingBalance = initialBudget - totalSpent;

    totalBudgetEl.textContent = `$${initialBudget.toFixed(2)}`;
    totalSpentEl.textContent = `$${totalSpent.toFixed(2)}`;
    remainingBalanceEl.textContent = `$${remainingBalance.toFixed(2)}`;
    
    if (remainingBalance < 0) {
        remainingBalanceEl.classList.remove('text-emerald-800');
        remainingBalanceEl.classList.add('text-red-800');
    } else {
        remainingBalanceEl.classList.remove('text-red-800');
        remainingBalanceEl.classList.add('text-emerald-800');
    }

    let percentage = (totalSpent / initialBudget) * 100;
    if (percentage > 100) {
        percentage = 100;
        budgetBar.classList.remove('bg-teal-500');
        budgetBar.classList.add('bg-red-500');
    } else {
        budgetBar.classList.remove('bg-red-500');
        budgetBar.classList.add('bg-teal-500');
    }
    budgetBar.style.width = `${percentage}%`;
}

/**
 * Renders the UI for the expenses page (list of expenses and category summary).
 */

















function renderExpensesPage() {
    if (!expenseList) return;
    
    // Render the interactive spending circle
    renderSpendingCircle();

    // NEW: Render the category summary cards
    renderCategoryCards();
    
    expenseList.innerHTML = ''; // Clear existing list items

    expenses.forEach((expense) => {
        const listItem = document.createElement('li');
        listItem.className = 'expense-item bg-gray-50 p-4 rounded-xl flex items-center justify-between transition-all hover:shadow-md';
        
        listItem.innerHTML = `
            <div class="flex-1">
                <p class="text-lg font-medium text-gray-800">${expense.description}</p>
                <p class="text-gray-500 text-sm">Category: ${expense.category}</p>
            </div>
            <div class="flex items-center space-x-4">
                <p class="text-xl font-bold text-orange-600">$${parseFloat(expense.amount).toFixed(2)}</p>
                <button class="edit-btn text-gray-400 hover:text-teal-500 transition-all" data-id="${expense.id}">
                    <i class="fa-solid fa-pen-to-square text-xl"></i>
                </button>
                <button class="delete-btn text-gray-400 hover:text-red-500 transition-all" data-id="${expense.id}">
                    <i class="fa-solid fa-xmark text-xl"></i>
                </button>
            </div>
        `;
        expenseList.appendChild(listItem);
    });
}





















/**
 * Renders the new interactive spending circle UI using SVG.
 */
function renderSpendingCircle() {
    if (!spendingCircleEl) return;

    // Calculate totals
    const grandTotal = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    const budgetPercentage = (grandTotal / initialBudget) * 100;

    // Calculate category totals
    const categoryTotals = expenses.reduce((totals, expense) => {
        const category = expense.category;
        const amount = parseFloat(expense.amount);
        totals[category] = (totals[category] || 0) + amount;
        return totals;
    }, {});
    
    // Set the initial text in the center of the circle
    if (circleTextPrimaryEl && circleTextSecondaryEl && circleTextTertiaryEl) {
        circleTextPrimaryEl.textContent = `$${grandTotal.toFixed(2)}`;
        circleTextSecondaryEl.textContent = `Total Spent`;
        circleTextTertiaryEl.textContent = `${budgetPercentage.toFixed(1)}% of Budget`;
    }

    spendingCircleEl.innerHTML = ''; // Clear existing content
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('class', 'w-full h-full');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '45');
    circle.setAttribute('fill', 'transparent');
    circle.setAttribute('stroke', '#E5E7EB'); // Tailwind gray-200
    circle.setAttribute('stroke-width', '10');
    svg.appendChild(circle);

    const circumference = 2 * Math.PI * 45; // Circumference for a radius of 45
    let dashOffset = 0;

    for (const category in categoryTotals) {
        const total = categoryTotals[category];
        
        const percentageOfTotal = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
        console.log(percentageOfTotal);
        const color = getCategoryColor(category);
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dashArray = (percentageOfTotal / 100) * circumference;
        console.log('l',dashArray);
        path.setAttribute('d', 'M 50 50 m 0 -45 a 45 45 0 0 1 0 90 a 45 45 0 0 1 0 -90');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', color.ringColor);
        path.setAttribute('stroke-width', '10');
        path.setAttribute('stroke-dasharray', `${dashArray} ${circumference - dashArray}`);
        path.setAttribute('stroke-dashoffset', `-${dashOffset}`);
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('class', 'transition-all duration-300 ease-in-out cursor-pointer');

        // Add event listeners
        path.addEventListener('mouseover', () => {
            if (circleTextPrimaryEl && circleTextSecondaryEl && circleTextTertiaryEl) {
                circleTextPrimaryEl.textContent = `$${total.toFixed(2)}`;
                circleTextSecondaryEl.textContent = category;
                circleTextTertiaryEl.textContent = `${percentageOfTotal.toFixed(1)}% of Total`;
            }
        });
        
        path.addEventListener('mouseout', () => {
            if (circleTextPrimaryEl && circleTextSecondaryEl && circleTextTertiaryEl) {
                circleTextPrimaryEl.textContent = `$${grandTotal.toFixed(2)}`;
                circleTextSecondaryEl.textContent = `Total Spent`;
                circleTextTertiaryEl.textContent = `${budgetPercentage.toFixed(1)}% of Budget`;
            }
        });

        svg.appendChild(path);
        dashOffset += dashArray;
    }
    
    spendingCircleEl.appendChild(svg);
}


















/**
 * NEW: Renders the category cards with progress bars below the circle.
 */
function renderCategoryCards() {
    if (!categoryCardsEl) return;

    const categoryTotals = expenses.reduce((totals, expense) => {
        const category = expense.category;
        const amount = parseFloat(expense.amount);
        totals[category] = (totals[category] || 0) + amount;
        return totals;
    }, {});
    
    const grandTotal = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);
    
    categoryCardsEl.innerHTML = '';
    
    for (const category in categoryTotals) {
        const total = categoryTotals[category];
        const percentage = grandTotal > 0 ? (total / grandTotal) * 100 : 0;
        const color = getCategoryColor(category);

        const card = document.createElement('div');
        // Apply the new dynamic background color class here
        card.className = `p-6 rounded-2xl shadow-lg transition-transform hover:scale-105 ${color.bgColor}`;
        card.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="text-xl font-bold text-gray-800">${category}</span>
                <span class="text-lg font-semibold ${color.totalText}">$${total.toFixed(2)}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div class="h-2.5 rounded-full" style="width: ${percentage.toFixed(1)}%; background-color: ${color.ringColor};"></div>
            </div>
            <p class="text-sm text-gray-500 mt-2">${percentage.toFixed(1)}% of total spent</p>
        `;
        categoryCardsEl.appendChild(card);
    }
}


/**
 * Helper function to get Tailwind color classes for a category.
 */
function getCategoryColor(category) {
    switch (category) {
        case 'Food':
            // Added a new bgColor property
            return { ringColor: '#F59E0B', text: 'text-yellow-600', totalText: 'text-yellow-800', bgColor: 'bg-yellow-50' };
        case 'Lodging':
            // Added a new bgColor property
            return { ringColor: '#3B82F6', text: 'text-blue-600', totalText: 'text-blue-800', bgColor: 'bg-blue-50' };
        case 'Transportation':
            // Added a new bgColor property
            return { ringColor: '#8B5CF6', text: 'text-purple-600', totalText: 'text-purple-800', bgColor: 'bg-purple-50' };
        case 'Entertainment':
            // Added a new bgColor property
            return { ringColor: '#10B981', text: 'text-green-600', totalText: 'text-green-800', bgColor: 'bg-green-50' };
        case 'Shopping':
            // Added a new bgColor property
            return { ringColor: '#EF4444', text: 'text-red-600', totalText: 'text-red-800', bgColor: 'bg-red-50' };
        case 'Other':
        default:
            // Added a new bgColor property
            return { ringColor: '#6B7280', text: 'text-gray-600', totalText: 'text-gray-800', bgColor: 'bg-gray-50' };
    }
}


/**
 * Handles form submission for adding or updating an expense.
 * These functions are left here but won't work correctly without a live backend.
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    
    // API calls are disabled for this dummy data version
    console.warn("API calls are disabled for this version with dummy data.");
    
    // For now, we'll just log the data and reset the form.
    console.log("Attempted to add/update expense:", { description, amount, category });
    resetForm();
}

/**
 * Resets the expense form and editing state.
 */
function resetForm() {
    if (expenseForm) expenseForm.reset();
    isEditing = false;
    editingExpenseId = null;
    if (submitBtn) submitBtn.textContent = 'Add Expense';
    
    const cancelButton = document.getElementById('cancel-btn');
    if (cancelButton) {
        cancelButton.remove();
    }
}



















// --- Event Listeners ---
if (expenseForm) {
    expenseForm.addEventListener('submit', handleFormSubmit);
}
// Other event listeners are left in place but will not function without the backend
// because the functions they call rely on the API_URL.

if (clearExpensesBtn) {
    clearExpensesBtn.addEventListener('click', () => {
        // Clear the hardcoded expenses
        expenses = [];
        renderExpensesPage();
    });
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    // Only render the expenses page if we are on that page.
    if (window.location.pathname.includes('expenses.html')) {
        renderExpensesPage();
    }
});
