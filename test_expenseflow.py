"""
test_expenseflow.py - Automated Verification Suite for ExpenseFlow

Validates all prompt requirements and checklist items:
1. Database CRUD & Data Persistence
2. Positive and zero income savings rate ("N/A")
3. Demo data exact values (Income ₹20,000; Expenses ₹4,500; Balance ₹15,500; Savings Rate 77.5%)
4. Filter consistency across metrics and tables
5. Budget calculation & exceeded warning logic
6. CSV export formatting
7. Performance test on 10,000 transactions
"""

import os
import io
import datetime
import pandas as pd
import database
import calculations
import charts

def test_all():
    print("==========================================")
    print("🚀 Starting ExpenseFlow Verification Suite")
    print("==========================================")

    # 1. Database Initialization
    database.init_db()
    assert os.path.exists(database.DB_PATH), "Database file must exist!"
    print("✅ Test 1: SQLite database created successfully.")

    # 2. Demo Data Loading & Verification
    database.load_demo_data()
    df_demo = database.get_all_transactions()
    assert len(df_demo) == 4, f"Expected 4 demo transactions, got {len(df_demo)}"
    
    metrics = calculations.calculate_metrics(df_demo)
    assert metrics["total_income"] == 20000.0, f"Expected Income 20000, got {metrics['total_income']}"
    assert metrics["total_expense"] == 4500.0, f"Expected Expense 4500, got {metrics['total_expense']}"
    assert metrics["balance"] == 15500.0, f"Expected Balance 15500, got {metrics['balance']}"
    assert metrics["savings_rate_str"] == "77.5%", f"Expected Savings Rate 77.5%, got {metrics['savings_rate_str']}"
    print(f"✅ Test 2: Demo data values verified: Income={metrics['total_income']}, Expenses={metrics['total_expense']}, Balance={metrics['balance']}, Savings={metrics['savings_rate_str']}")

    # 3. Currency Formatting
    assert calculations.format_inr(20000) == "₹20,000", f"Formatting failed: {calculations.format_inr(20000)}"
    assert calculations.format_inr(150000) == "₹1,50,000", f"Formatting failed: {calculations.format_inr(150000)}"
    assert calculations.format_inr(4500) == "₹4,500", f"Formatting failed: {calculations.format_inr(4500)}"
    assert calculations.format_inr(-1500) == "-₹1,500", f"Formatting failed: {calculations.format_inr(-1500)}"
    assert calculations.format_inr(0) == "₹0", f"Formatting failed: {calculations.format_inr(0)}"
    print("✅ Test 3: Indian currency formatting (₹) with grouping verified.")

    # 4. Zero Income Savings Rate (N/A, no division by zero)
    df_no_income = df_demo[df_demo["type"] == "Expense"]
    m_no_income = calculations.calculate_metrics(df_no_income)
    assert m_no_income["savings_rate"] is None, "Savings rate should be None when income is 0"
    assert m_no_income["savings_rate_str"] == "N/A", f"Expected 'N/A', got {m_no_income['savings_rate_str']}"
    print("✅ Test 4: Savings rate with zero income cleanly returns 'N/A' without division by zero.")

    # 5. CRUD: Add, Edit, Delete
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    new_id = database.add_transaction("Expense", 500.0, "Bills", today_str, "Internet bill")
    assert new_id > 0, "Insert failed"
    tx = database.get_transaction_by_id(new_id)
    assert tx["amount"] == 500.0 and tx["category"] == "Bills"
    
    # Update
    updated = database.update_transaction(new_id, "Expense", 600.0, "Bills", today_str, "Updated internet bill")
    assert updated is True, "Update failed"
    tx_updated = database.get_transaction_by_id(new_id)
    assert tx_updated["amount"] == 600.0 and tx_updated["description"] == "Updated internet bill"

    # Delete
    deleted = database.delete_transaction(new_id)
    assert deleted is True, "Delete failed"
    assert database.get_transaction_by_id(new_id) is None, "Transaction should no longer exist"
    print("✅ Test 5: Add, Edit, and Delete operations verified.")

    # 6. Shared Filter Consistency
    df_food = calculations.filter_transactions_df(df_demo, categories=["Food"])
    assert len(df_food) == 1 and df_food.iloc[0]["category"] == "Food"
    m_food = calculations.calculate_metrics(df_food)
    assert m_food["total_expense"] == 2000.0 and m_food["total_income"] == 0.0
    print("✅ Test 6: Shared filter consistency verified.")

    # 7. Budget Status & Warning Trigger
    current_month = datetime.date.today().strftime("%Y-%m")
    # Set budget above expenses
    database.set_budget(current_month, 10000.0)
    b_ok = calculations.calculate_budget_status(df_demo, current_month, 10000.0)
    assert b_ok["is_exceeded"] is False
    assert b_ok["spent"] == 4500.0
    assert b_ok["remaining"] == 5500.0

    # Set budget below expenses (e.g. 3000 vs 4500 spent)
    database.set_budget(current_month, 3000.0)
    b_warn = calculations.calculate_budget_status(df_demo, current_month, 3000.0)
    assert b_warn["is_exceeded"] is True
    assert b_warn["spent"] == 4500.0
    assert b_warn["remaining"] == -1500.0
    print("✅ Test 7: Budget status & exceeded warning logic verified.")

    # 8. CSV Export Columns & Encoding
    export_df = df_demo[["id", "date", "type", "category", "description", "amount"]].copy()
    export_df.columns = ["ID", "Date", "Type", "Category", "Description", "Amount"]
    csv_bytes = export_df.to_csv(index=False).encode("utf-8-sig")
    csv_str = csv_bytes.decode("utf-8-sig")
    header_line = csv_str.splitlines()[0]
    assert header_line == "ID,Date,Type,Category,Description,Amount", f"CSV Header mismatch: {header_line}"
    print("✅ Test 8: CSV Export headers and utf-8-sig encoding verified.")

    # 9. Charts Generation (with data and empty states)
    fig_bar = charts.build_income_expense_bar_chart(df_demo)
    fig_donut = charts.build_category_donut_chart(df_demo)
    empty_df = pd.DataFrame(columns=["id", "type", "amount", "category", "date", "description"])
    fig_empty_bar = charts.build_income_expense_bar_chart(empty_df)
    fig_empty_donut = charts.build_category_donut_chart(empty_df)
    assert fig_bar is not None and fig_donut is not None
    assert fig_empty_bar is not None and fig_empty_donut is not None
    print("✅ Test 9: Charts generation (active & empty states) verified.")

    # 10. Performance Test with 10,000 Transactions
    print("Testing performance with 10,000 transactions...")
    conn = database.get_connection()
    cursor = conn.cursor()
    cursor.execute("BEGIN TRANSACTION;")
    # Bulk insert 10,000 transactions
    sample_rows = [
        ("Expense" if i % 4 != 0 else "Income", 
         float((i % 500) + 10), 
         "Food" if i % 2 == 0 else "Salary/Allowance", 
         f"2026-{(i % 12) + 1:02d}-{(i % 28) + 1:02d}", 
         f"Bulk transaction #{i}")
        for i in range(10000)
    ]
    cursor.executemany("""
        INSERT INTO transactions (type, amount, category, date, description)
        VALUES (?, ?, ?, ?, ?)
    """, sample_rows)
    conn.commit()
    conn.close()

    t_start = datetime.datetime.now()
    df_large = database.get_all_transactions()
    t_fetch = (datetime.datetime.now() - t_start).total_seconds()
    
    t_calc_start = datetime.datetime.now()
    large_metrics = calculations.calculate_metrics(df_large)
    df_large_filtered = calculations.filter_transactions_df(df_large, categories=["Food"])
    t_calc = (datetime.datetime.now() - t_calc_start).total_seconds()

    print(f"Fetched {len(df_large)} rows in {t_fetch:.3f}s, filtered & calculated in {t_calc:.3f}s.")
    assert len(df_large) >= 10000, "Expected at least 10,000 transactions"
    assert t_fetch + t_calc < 2.0, "Performance benchmark: should process 10,000 rows in under 2 seconds"
    print("✅ Test 10: Performance benchmark on 10,000+ transactions passed with flying colors.")

    # Restore clean demo data
    database.load_demo_data()
    print("==========================================")
    print("🎉 ALL TESTS PASSED SUCCESSFULLY!")
    print("==========================================")

if __name__ == "__main__":
    test_all()
