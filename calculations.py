"""
calculations.py - Financial Calculations and Formatting for ExpenseFlow

This module handles:
- Indian Currency (₹) formatting with traditional comma grouping (e.g. ₹20,000, ₹1,50,000)
- Core financial metric calculations: Total Income, Total Expense, Balance, Savings Rate
- Monthly budget status, remaining balance, and threshold checks
- Centralized filtering logic ensuring cards, tables, and charts remain 100% consistent
"""

import pandas as pd
from typing import Optional, Dict, Any, List


def format_inr(
    val: Optional[float], 
    include_symbol: bool = True, 
    decimals: bool = False,
    sign_mode: Optional[str] = None
) -> str:
    """
    Formats a numeric value into the Indian numbering format (e.g., ₹20,000, ₹1,50,000).
    In the Indian numbering system:
    - The last 3 digits are grouped together.
    - Subsequent groups are separated in pairs of 2 digits.
    - Supports sign_mode: 'income' (+), 'expense' (−), 'balance' (+/−), 'auto' (+/−).
    Never rely on color alone: explicit + / − ensures accessibility.
    """
    if val is None or pd.isna(val):
        return "₹0" if include_symbol else "0"

    is_negative = val < 0
    abs_val = abs(float(val))

    # Determine decimal string
    if decimals or (abs_val != int(abs_val)):
        dec_part = f"{abs_val:.2f}".split(".")[1]
        dec_str = f".{dec_part}"
    else:
        dec_str = ""

    int_str = str(int(abs_val))

    # Apply Indian grouping
    if len(int_str) <= 3:
        formatted_int = int_str
    else:
        last3 = int_str[-3:]
        remaining = int_str[:-3]
        groups = []
        while len(remaining) > 2:
            groups.insert(0, remaining[-2:])
            remaining = remaining[:-2]
        if remaining:
            groups.insert(0, remaining)
        formatted_int = ",".join(groups) + "," + last3

    symbol = "₹" if include_symbol else ""
    amount_str = f"{symbol}{formatted_int}{dec_str}"

    # Handle sign prefix
    if sign_mode == "income":
        return f"+ {amount_str}"
    elif sign_mode == "expense":
        return f"− {amount_str}"
    elif sign_mode in ("balance", "auto"):
        if val > 0:
            return f"+ {amount_str}"
        elif val < 0:
            return f"− {amount_str}"
        else:
            return amount_str
    
    # Default fallback
    return f"-{amount_str}" if is_negative else amount_str


def calculate_metrics(df: pd.DataFrame) -> Dict[str, Any]:
    """
    Computes key financial summary metrics for a given DataFrame:
    - Total Income
    - Total Expense
    - Net Balance (Income - Expense)
    - Savings Rate ((Balance / Income) * 100; returns None if Income is 0)

    Guarantees no division-by-zero errors.
    """
    if df is None or df.empty:
        return {
            "total_income": 0.0,
            "total_expense": 0.0,
            "balance": 0.0,
            "savings_rate": None,
            "savings_rate_str": "N/A",
            "transaction_count": 0,
            "income_count": 0,
            "expense_count": 0,
        }

    # Sums
    income_rows = df[df["type"] == "Income"]
    expense_rows = df[df["type"] == "Expense"]

    total_income = float(income_rows["amount"].sum()) if not income_rows.empty else 0.0
    total_expense = float(expense_rows["amount"].sum()) if not expense_rows.empty else 0.0
    balance = total_income - total_expense

    # Savings rate calculation: strictly handle income == 0
    if total_income > 0:
        savings_rate = (balance / total_income) * 100.0
        # Format cleanly to 1 decimal place, e.g., 77.5%
        savings_rate_str = f"{savings_rate:.1f}%"
    else:
        savings_rate = None
        savings_rate_str = "N/A"

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "savings_rate": savings_rate,
        "savings_rate_str": savings_rate_str,
        "transaction_count": len(df),
        "income_count": len(income_rows),
        "expense_count": len(expense_rows),
    }


def calculate_budget_status(df: pd.DataFrame, month_str: str, budget_amount: Optional[float]) -> Dict[str, Any]:
    """
    Calculates budget metrics for a specific month ('YYYY-MM'):
    - Total expenses spent in that month (only 'Expense' rows count)
    - Amount remaining (budget - spent)
    - Percentage spent
    - Exceeded flag (True if spent > budget)
    """
    if df is None or df.empty:
        spent = 0.0
    else:
        # Filter for Expense transactions in the target month
        month_expenses = df[
            (df["date"].str.startswith(month_str)) &
            (df["type"] == "Expense")
        ]
        spent = float(month_expenses["amount"].sum()) if not month_expenses.empty else 0.0

    if budget_amount is None or budget_amount <= 0:
        return {
            "has_budget": False,
            "budget": None,
            "spent": spent,
            "remaining": None,
            "percentage": 0.0,
            "is_exceeded": False,
        }

    remaining = budget_amount - spent
    percentage = (spent / budget_amount) * 100.0 if budget_amount > 0 else 0.0
    is_exceeded = spent > budget_amount

    return {
        "has_budget": True,
        "budget": budget_amount,
        "spent": spent,
        "remaining": remaining,
        "percentage": percentage,
        "is_exceeded": is_exceeded,
    }


def filter_transactions_df(
    df: pd.DataFrame,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    categories: Optional[List[str]] = None,
    trans_type: Optional[str] = None,
    search_text: Optional[str] = None,
) -> pd.DataFrame:
    """
    Pure filtering function used across all pages to ensure cards, tables,
    and charts always share the exact same filtered dataset.
    """
    if df is None or df.empty:
        return df

    filtered = df.copy()

    # 1. Date Range Filter
    if start_date:
        filtered = filtered[filtered["date"] >= str(start_date)]
    if end_date:
        filtered = filtered[filtered["date"] <= str(end_date)]

    # 2. Transaction Type Filter
    if trans_type and trans_type != "All":
        filtered = filtered[filtered["type"] == trans_type]

    # 3. Category Filter
    if categories and len(categories) > 0 and "All" not in categories:
        filtered = filtered[filtered["category"].isin(categories)]

    # 4. Search Filter (Search in description or category)
    if search_text and search_text.strip():
        q = search_text.strip().lower()
        desc_match = filtered["description"].fillna("").str.lower().str.contains(q, regex=False)
        cat_match = filtered["category"].fillna("").str.lower().str.contains(q, regex=False)
        filtered = filtered[desc_match | cat_match]

    return filtered
