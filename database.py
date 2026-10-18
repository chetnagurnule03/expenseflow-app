"""
database.py - SQLite Database Management for ExpenseFlow

This module handles:
- Establishing SQLite connection and auto-creating 'data/expenseflow.db'
- Initializing 'transactions' and 'budget' tables
- CRUD operations for transactions
- Getting and setting monthly budgets
- Loading initial demo data
"""

import os
import sqlite3
import datetime
import pandas as pd

# Directory where the database file will be stored
DB_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
DB_PATH = os.path.join(DB_DIR, "expenseflow.db")


def get_connection():
    """
    Ensures the data directory exists and returns a connection to SQLite database.
    """
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH, check_same_thread=False, timeout=10.0)
    conn.row_factory = sqlite3.Row  # Enables column access by name
    return conn


def init_db():
    """
    Creates 'transactions' and 'budget' tables if they do not already exist.
    Called automatically when the application starts.
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Table 1: Transactions
    # Stores each income or expense record. Amount is always positive.
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL CHECK(type IN ('Income', 'Expense')),
            amount REAL NOT NULL CHECK(amount > 0),
            category TEXT NOT NULL,
            date TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Table 2: Budget
    # Stores one monthly budget per month in 'YYYY-MM' format.
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS budget (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            month TEXT NOT NULL UNIQUE,
            amount REAL NOT NULL CHECK(amount > 0),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Indexes for fast filtering over 10,000+ transactions
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(date);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);")

    conn.commit()
    conn.close()


def add_transaction(trans_type: str, amount: float, category: str, trans_date: str, description: str = "") -> int:
    """
    Inserts a new transaction into the database.
    Returns the newly generated transaction ID.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO transactions (type, amount, category, date, description)
        VALUES (?, ?, ?, ?, ?)
    """, (trans_type, float(amount), category.strip(), trans_date, description.strip()))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id


def update_transaction(trans_id: int, trans_type: str, amount: float, category: str, trans_date: str, description: str = "") -> bool:
    """
    Updates an existing transaction record by ID.
    Returns True if update succeeded, False otherwise.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE transactions
        SET type = ?, amount = ?, category = ?, date = ?, description = ?
        WHERE id = ?
    """, (trans_type, float(amount), category.strip(), trans_date, description.strip(), trans_id))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0


def delete_transaction(trans_id: int) -> bool:
    """
    Deletes a transaction by its ID.
    Returns True if deleted, False otherwise.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions WHERE id = ?", (trans_id,))
    rows_affected = cursor.rowcount
    conn.commit()
    conn.close()
    return rows_affected > 0


def get_transaction_by_id(trans_id: int) -> dict:
    """
    Retrieves a single transaction by ID as a dictionary.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transactions WHERE id = ?", (trans_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None


def get_all_transactions() -> pd.DataFrame:
    """
    Fetches all transactions ordered by date descending, then id descending.
    Returns a pandas DataFrame.
    """
    conn = get_connection()
    query = """
        SELECT id, type, amount, category, date, description, created_at
        FROM transactions
        ORDER BY date DESC, id DESC
    """
    df = pd.read_sql_query(query, conn)
    conn.close()

    if df.empty:
        # Return an empty DataFrame with expected columns and dtypes
        return pd.DataFrame(columns=['id', 'type', 'amount', 'category', 'date', 'description', 'created_at'])
    
    # Ensure proper data types
    df['id'] = df['id'].astype(int)
    df['amount'] = df['amount'].astype(float)
    df['date'] = pd.to_datetime(df['date']).dt.strftime('%Y-%m-%d')
    return df


def get_budget(month: str) -> float:
    """
    Retrieves the budget amount for a given month ('YYYY-MM').
    Returns the budget as float, or None if not set.
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT amount FROM budget WHERE month = ?", (month,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return float(row['amount'])
    return None


def set_budget(month: str, amount: float) -> bool:
    """
    Sets or updates the monthly budget for 'month' ('YYYY-MM').
    Uses SQLite upsert (INSERT ... ON CONFLICT(month) DO UPDATE).
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO budget (month, amount)
        VALUES (?, ?)
        ON CONFLICT(month) DO UPDATE SET
            amount = excluded.amount,
            created_at = CURRENT_TIMESTAMP
    """, (month, float(amount)))
    conn.commit()
    conn.close()
    return True


def clear_all_data():
    """
    Wipes all transactions and budget records (useful for fresh resets).
    """
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM transactions;")
    cursor.execute("DELETE FROM budget;")
    conn.commit()
    conn.close()


def load_demo_data():
    """
    Loads standard demonstration data into SQLite:
    - Income: ₹20,000 (Salary/Allowance)
    - Expenses: Food ₹2,000, Travel ₹1,500, Shopping ₹1,000
    - Total expenses: ₹4,500
    - Net balance: ₹15,500
    - Savings rate: 77.5%
    - Demo Monthly Budget: ₹10,000
    """
    clear_all_data()

    today = datetime.date.today()
    current_month_str = today.strftime("%Y-%m")

    # Pick valid dates within the current month that are <= today
    first_day = today.replace(day=1)
    
    # Ensure transaction dates do not exceed today
    def clamp_date(target_day):
        max_day = today.day
        chosen_day = min(target_day, max_day)
        return today.replace(day=max_day if chosen_day < 1 else chosen_day).strftime("%Y-%m-%d")

    date_salary = first_day.strftime("%Y-%m-%d")
    date_food = clamp_date(min(5, today.day))
    date_travel = clamp_date(min(10, today.day))
    date_shopping = clamp_date(min(12, today.day))

    # Add demo income
    add_transaction("Income", 20000.0, "Salary/Allowance", date_salary, "Monthly Salary Credit")

    # Add demo expenses
    add_transaction("Expense", 2000.0, "Food", date_food, "Grocery and household supplies")
    add_transaction("Expense", 1500.0, "Travel", date_travel, "Metro card recharge & fuel")
    add_transaction("Expense", 1000.0, "Shopping", date_shopping, "Clothing & daily essentials")

    # Set demo budget
    set_budget(current_month_str, 10000.0)
