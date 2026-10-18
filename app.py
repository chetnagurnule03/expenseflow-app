"""
app.py - ExpenseFlow: Personal Expense Tracker

Theme: Playful Bronze Palette (Dark default, Light toggle)
Palette:
  - Espresso #372C2E (Dark page bg, light theme text)
  - Cocoa    #563727 (Dark theme cards)
  - Mint     #5ED3A6 (Income, positive, under-budget progress)
  - Coral    #FF6B8A (Expenses, delete buttons, over-budget warning)
  - Sunny    #FFC857 (Active nav pill, highlights, accents)
  - White    #FFFFFF (Text on dark, cards on light)

Typography:
  - Fredoka (Headings, card values, nav)
  - Hanken Grotesk (Body, tables, inputs)
  - Tabular numbers for all monetary values
  - Outline icons only (Material Symbols Outlined) - Strictly NO emoji
"""

import streamlit as st
import pandas as pd
import datetime
from typing import Tuple, Optional

# Local module imports
import database
from calculations import (
    format_inr,
    calculate_metrics,
    calculate_budget_status,
    filter_transactions_df,
)
import charts

# ==========================================
# 1. PAGE CONFIGURATION
# ==========================================
st.set_page_config(
    page_title="ExpenseFlow",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Ensure database is initialized
database.init_db()

# Pre-defined category lists
EXPENSE_CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Education", "Health", "Other"]
INCOME_CATEGORIES = ["Salary/Allowance", "Bonus", "Freelance", "Investments", "Other Income"]

# Session State for Theme (Dark by default)
if "theme" not in st.session_state:
    st.session_state["theme"] = "dark"

active_theme = st.session_state["theme"]
is_dark = (active_theme == "dark")


# ==========================================
# 2. BRONZE PALETTE & PLAYFUL CSS INJECTION
# ==========================================
css_vars = f"""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');

    :root {{
        --espresso: #372C2E;
        --cocoa: #563727;
        --mint: #5ED3A6;
        --coral: #FF6B8A;
        --sunny: #FFC857;
        --white: #FFFFFF;

        /* Active theme dynamic tokens */
        --bg-page: {"#372C2E" if is_dark else "#F6F0E8"};
        --bg-card: {"#563727" if is_dark else "#FFFFFF"};
        --text-main: {"#FFFFFF" if is_dark else "#372C2E"};
        --text-muted: {"rgba(255, 255, 255, 0.70)" if is_dark else "rgba(55, 44, 46, 0.70)"};
        --border-card: {"rgba(255, 255, 255, 0.12)" if is_dark else "rgba(55, 44, 46, 0.12)"};
        
        /* Income/Expense text: darker contrast on light background */
        --income-text: {"#5ED3A6" if is_dark else "#18704F"};
        --expense-text: {"#FF6B8A" if is_dark else "#BE2049"};
        --balance-pos: {"#5ED3A6" if is_dark else "#18704F"};
        --balance-neg: {"#FF6B8A" if is_dark else "#BE2049"};
        --nav-pill-bg: #FFC857;
        --nav-pill-text: #372C2E;
    }}

    /* Global page styling */
    html, body, .stApp {{
        background-color: var(--bg-page) !important;
        color: var(--text-main) !important;
        font-family: 'Hanken Grotesk', sans-serif !important;
    }}

    /* Floating background soft circles (approx 12% opacity) */
    .bg-blob-1, .bg-blob-2, .bg-blob-3 {{
        position: fixed;
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        filter: blur(50px);
    }}
    .bg-blob-1 {{
        width: 320px;
        height: 320px;
        top: -60px;
        right: -60px;
        background: rgba(255, 200, 87, 0.12); /* Sunny */
        animation: floatBlob1 18s ease-in-out infinite alternate;
    }}
    .bg-blob-2 {{
        width: 290px;
        height: 290px;
        bottom: 40px;
        left: -50px;
        background: rgba(94, 211, 166, 0.12); /* Mint */
        animation: floatBlob2 22s ease-in-out infinite alternate;
    }}
    .bg-blob-3 {{
        width: 240px;
        height: 240px;
        top: 50%;
        right: 12%;
        background: rgba(255, 107, 138, 0.10); /* Coral */
        animation: floatBlob3 20s ease-in-out infinite alternate;
    }}
    @keyframes floatBlob1 {{
        0% {{ transform: translate(0, 0) scale(1); }}
        100% {{ transform: translate(-35px, 45px) scale(1.08); }}
    }}
    @keyframes floatBlob2 {{
        0% {{ transform: translate(0, 0) scale(1); }}
        100% {{ transform: translate(45px, -35px) scale(1.05); }}
    }}
    @keyframes floatBlob3 {{
        0% {{ transform: translate(0, 0) scale(1); }}
        100% {{ transform: translate(-25px, -35px) scale(0.96); }}
    }}

    /* Typography: Fredoka for headings, nav, card values */
    h1, h2, h3, h4, h5, h6 {{
        font-family: 'Fredoka', cursive, sans-serif !important;
        font-weight: 500 !important;
        color: var(--text-main) !important;
        text-transform: none !important;
        letter-spacing: -0.2px;
    }}

    /* Outline icon helper */
    .material-symbols-outlined {{
        font-family: 'Material Symbols Outlined' !important;
        font-weight: normal;
        font-style: normal;
        font-size: 20px;
        line-height: 1;
        letter-spacing: normal;
        text-transform: none;
        display: inline-block;
        white-space: nowrap;
        word-wrap: normal;
        direction: ltr;
        vertical-align: middle;
    }}

    /* Tabular numbers for all monetary values */
    .tabular-num {{
        font-variant-numeric: tabular-nums !important;
    }}

    /* Summary Card Styling with Staggered Load & Springy Hover */
    .metric-card {{
        background: var(--bg-card);
        border: 1px solid var(--border-card);
        border-radius: 16px;
        padding: 20px 22px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        margin-bottom: 16px;
        position: relative;
        z-index: 1;
        opacity: 0;
        transition: transform 0.35s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s ease, border-color 0.35s ease;
    }}
    .metric-card:hover {{
        transform: translateY(-5px) rotate(-1deg);
        box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.18);
        border-color: rgba(255, 200, 87, 0.4);
    }}

    /* Staggered entrance animations (60ms stagger) */
    @keyframes cardSlideUp {{
        0% {{
            opacity: 0;
            transform: translateY(18px);
        }}
        100% {{
            opacity: 1;
            transform: translateY(0);
        }}
    }}
    .stagger-1 {{ animation: cardSlideUp 0.45s cubic-bezier(.34,1.56,.64,1) 0ms forwards; }}
    .stagger-2 {{ animation: cardSlideUp 0.45s cubic-bezier(.34,1.56,.64,1) 60ms forwards; }}
    .stagger-3 {{ animation: cardSlideUp 0.45s cubic-bezier(.34,1.56,.64,1) 120ms forwards; }}
    .stagger-4 {{ animation: cardSlideUp 0.45s cubic-bezier(.34,1.56,.64,1) 180ms forwards; }}

    .metric-header {{
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }}
    .metric-title {{
        font-family: 'Fredoka', cursive, sans-serif;
        font-size: 14px;
        font-weight: 500;
        color: var(--text-muted);
        text-transform: none;
    }}
    .metric-value {{
        font-family: 'Fredoka', cursive, sans-serif;
        font-size: 28px;
        font-weight: 500;
        line-height: 1.2;
        font-variant-numeric: tabular-nums;
        margin-bottom: 4px;
    }}
    .metric-subtitle {{
        font-size: 12px;
        color: var(--text-muted);
    }}

    /* Value colors */
    .val-income {{ color: var(--income-text) !important; }}
    .val-expense {{ color: var(--expense-text) !important; }}
    .val-balance-pos {{ color: var(--balance-pos) !important; }}
    .val-balance-neg {{ color: var(--balance-neg) !important; }}
    .val-savings {{ color: var(--sunny) !important; }}

    /* Budget Progress & Animated Container */
    .budget-container {{
        background: var(--bg-card);
        border: 1px solid var(--border-card);
        border-radius: 16px;
        padding: 20px 24px;
        margin-bottom: 24px;
        position: relative;
        z-index: 1;
    }}
    .budget-progress-track {{
        width: 100%;
        height: 12px;
        background: rgba(255, 255, 255, 0.12);
        border-radius: 9999px;
        overflow: hidden;
        margin: 14px 0 10px 0;
    }}
    .budget-progress-fill {{
        height: 100%;
        border-radius: 9999px;
        animation: fillProgress 0.85s cubic-bezier(.34,1.56,.64,1) forwards;
        transform-origin: left;
    }}
    .fill-mint {{
        background: var(--mint);
    }}
    .fill-coral {{
        background: var(--coral);
    }}
    @keyframes fillProgress {{
        from {{ width: 0%; }}
        to {{ width: var(--fill-pct); }}
    }}

    /* Exceeded budget shake animation (shakes once) */
    @keyframes budgetShakeOnce {{
        0%, 100% {{ transform: translateX(0); }}
        15%, 45%, 75% {{ transform: translateX(-6px); }}
        30%, 60%, 90% {{ transform: translateX(6px); }}
    }}
    .budget-exceeded-shake {{
        animation: budgetShakeOnce 0.6s cubic-bezier(.36,.07,.19,.97) both;
        border-left: 5px solid var(--coral) !important;
    }}
    .budget-healthy {{
        border-left: 5px solid var(--mint) !important;
    }}

    /* Badges with text in Espresso */
    .badge {{
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 12px;
        border-radius: 9999px;
        font-size: 12px;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
    }}
    .badge-mint {{
        background: var(--mint) !important;
        color: var(--espresso) !important;
    }}
    .badge-coral {{
        background: var(--coral) !important;
        color: var(--espresso) !important;
    }}
    .badge-sunny {{
        background: var(--sunny) !important;
        color: var(--espresso) !important;
    }}

    /* Sidebar Styling & Nav Item Hover Shift */
    section[data-testid="stSidebar"] {{
        background-color: {"#2A2123" if is_dark else "#EFE7DC"} !important;
        border-right: 1px solid var(--border-card);
    }}
    
    /* Navigation radio items styling */
    div[data-testid="stRadio"] > div {{
        gap: 8px;
    }}
    div[data-testid="stRadio"] label {{
        font-family: 'Fredoka', cursive, sans-serif !important;
        font-size: 15px !important;
        color: var(--text-main) !important;
        padding: 10px 16px !important;
        border-radius: 9999px !important;
        transition: transform 0.2s ease, background-color 0.2s ease !important;
        cursor: pointer !important;
        display: flex !important;
        align-items: center !important;
    }}
    div[data-testid="stRadio"] label:hover {{
        transform: translateX(6px);
        background-color: rgba(255, 200, 87, 0.15) !important;
    }}
    /* Active nav item pill */
    div[data-testid="stRadio"] label[data-checked="true"], 
    div[data-testid="stRadio"] label:has(input:checked) {{
        background-color: var(--sunny) !important;
        color: var(--espresso) !important;
        font-weight: 500 !important;
    }}
    div[data-testid="stRadio"] label:has(input:checked) * {{
        color: var(--espresso) !important;
    }}

    /* Delete buttons in Coral with Espresso text */
    button[kind="primary"] {{
        border-radius: 14px !important;
        font-family: 'Fredoka', cursive, sans-serif !important;
        font-weight: 500 !important;
    }}
    .coral-btn button, button[data-testid="baseButton-primary"]:has(.del-btn-marker) {{
        background-color: var(--coral) !important;
        color: var(--espresso) !important;
        border: none !important;
    }}

    /* Form inputs and containers */
    div[data-testid="stTextInput"] input, 
    div[data-testid="stNumberInput"] input, 
    div[data-testid="stDateInput"] input {{
        border-radius: 14px !important;
        font-family: 'Hanken Grotesk', sans-serif !important;
        border: 1px solid var(--border-card) !important;
        background-color: var(--bg-card) !important;
        color: var(--text-main) !important;
    }}
    div[data-baseweb="select"] > div {{
        border-radius: 14px !important;
        border: 1px solid var(--border-card) !important;
        background-color: var(--bg-card) !important;
        color: var(--text-main) !important;
    }}

    /* Tables */
    div[data-testid="stDataFrame"] {{
        border-radius: 16px !important;
        overflow: hidden;
        border: 1px solid var(--border-card);
    }}

    /* Accessibility: Respect prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {{
        *, *::before, *::after {{
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
        }}
    }}
</style>

<!-- Floating Ambient Blobs -->
<div class="bg-blob-1"></div>
<div class="bg-blob-2"></div>
<div class="bg-blob-3"></div>
"""

st.markdown(css_vars, unsafe_allow_html=True)


# ==========================================
# 3. HELPER FUNCTIONS
# ==========================================
def render_metric_card(title: str, value_str: str, subtitle: str, color_class: str, stagger_class: str, icon_name: str):
    """Renders a responsive metric card with stagger entrance, hover lift/tilt, and outline icons."""
    html = f"""
    <div class="metric-card {stagger_class}">
        <div class="metric-header">
            <span class="material-symbols-outlined" style="color: var(--text-muted); font-size: 20px;">{icon_name}</span>
            <div class="metric-title">{title}</div>
        </div>
        <div class="metric-value {color_class} tabular-num">{value_str}</div>
        <div class="metric-subtitle">{subtitle}</div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)


def get_date_range_presets(preset: str) -> Tuple[Optional[str], Optional[str]]:
    """Returns (start_date_str, end_date_str) based on a period selection preset."""
    today = datetime.date.today()
    if preset == "All Time":
        return None, None
    elif preset == "This Month":
        start_date = today.replace(day=1)
        return start_date.strftime("%Y-%m-%d"), today.strftime("%Y-%m-%d")
    elif preset == "Last 30 Days":
        start_date = today - datetime.timedelta(days=30)
        return start_date.strftime("%Y-%m-%d"), today.strftime("%Y-%m-%d")
    elif preset == "This Year":
        start_date = today.replace(month=1, day=1)
        return start_date.strftime("%Y-%m-%d"), today.strftime("%Y-%m-%d")
    return None, None


# ==========================================
# 4. SIDEBAR NAVIGATION & THEME TOGGLE
# ==========================================
st.sidebar.markdown(f"""
<div style="margin-bottom: 20px;">
    <div style="display: flex; align-items: center; gap: 8px;">
        <span class="material-symbols-outlined" style="font-size: 28px; color: #5ED3A6;">wallet</span>
        <h2 style="margin: 0; font-size: 24px; color: var(--text-main);">ExpenseFlow</h2>
    </div>
    <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">Personal expense tracker</div>
</div>
""", unsafe_allow_html=True)

nav_page = st.sidebar.radio(
    "Navigation",
    ["Overview", "Transactions", "Analytics", "Budget"],
    label_visibility="collapsed"
)

st.sidebar.markdown("---")

# Theme Toggle in Sidebar
st.sidebar.markdown("<div style='font-family: Fredoka, sans-serif; font-size: 14px; margin-bottom: 6px;'>Theme appearance</div>", unsafe_allow_html=True)
theme_col1, theme_col2 = st.sidebar.columns([1, 4])
with theme_col1:
    icon_theme = "light_mode" if is_dark else "dark_mode"
    st.markdown(f'<span class="material-symbols-outlined" style="font-size: 24px; margin-top: 4px; color: var(--sunny);">{icon_theme}</span>', unsafe_allow_html=True)
with theme_col2:
    toggle_light = st.toggle("Light mode", value=(not is_dark), key="theme_toggle")
    selected_theme = "light" if toggle_light else "dark"
    if selected_theme != active_theme:
        st.session_state["theme"] = selected_theme
        st.rerun()

st.sidebar.markdown("---")

# Demo Data Section
st.sidebar.markdown("""
<div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
    <span class="material-symbols-outlined" style="font-size: 18px; color: var(--sunny);">inventory_2</span>
    <span style="font-family: Fredoka, sans-serif; font-size: 14px; color: var(--text-main);">Demo dataset</span>
</div>
""", unsafe_allow_html=True)
st.sidebar.caption("Loads sample records: Income ₹20,000; Expenses ₹4,500; Savings rate 77.5%.")

if st.sidebar.button("Load demo data", use_container_width=True):
    database.load_demo_data()
    st.sidebar.success("Demo data loaded.")
    st.rerun()

# Database Reset in Sidebar Expander
with st.sidebar.expander("Reset database"):
    st.caption("Clears all transactions and budgets to test empty states.")
    confirm_reset = st.checkbox("Confirm database reset", key="chk_reset")
    if st.button("Wipe all records", disabled=not confirm_reset, use_container_width=True):
        database.clear_all_data()
        st.success("Database cleared.")
        st.rerun()

st.sidebar.markdown("---")
st.sidebar.caption("ExpenseFlow • Local SQLite • Currency: ₹ INR")


# ==========================================
# 5. PAGE: OVERVIEW
# ==========================================
def render_overview():
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span class="material-symbols-outlined" style="font-size: 32px; color: var(--sunny);">space_dashboard</span>
        <h1 style="margin: 0; font-size: 30px;">Financial overview</h1>
    </div>
    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
        Summary of cash inflows, outflows, balance, and budget standing for the selected period.
    </p>
    """, unsafe_allow_html=True)

    df_all = database.get_all_transactions()
    today = datetime.date.today()
    current_month_str = today.strftime("%Y-%m")

    # Period Filter Bar
    filter_col1, filter_col2 = st.columns([2, 4])
    with filter_col1:
        period_choice = st.selectbox(
            "Select period",
            ["All Time", "This Month", "Last 30 Days", "This Year", "Custom Range"],
            index=0
        )

    start_date, end_date = None, None
    if period_choice == "Custom Range":
        with filter_col2:
            custom_cols = st.columns(2)
            with custom_cols[0]:
                c_start = st.date_input("Start date", value=today - datetime.timedelta(days=30), max_value=today)
                start_date = c_start.strftime("%Y-%m-%d")
            with custom_cols[1]:
                c_end = st.date_input("End date", value=today, max_value=today)
                end_date = c_end.strftime("%Y-%m-%d")
    else:
        start_date, end_date = get_date_range_presets(period_choice)

    # ONE shared filtered DataFrame for cards, charts, and tables
    df_filtered = filter_transactions_df(df_all, start_date=start_date, end_date=end_date)
    metrics = calculate_metrics(df_filtered)

    # 4 Summary Cards (With explicit + / − signs)
    c1, c2, c3, c4 = st.columns(4)
    with c1:
        render_metric_card(
            "Total income",
            format_inr(metrics["total_income"], sign_mode="income"),
            f"{metrics['income_count']} income transactions",
            "val-income",
            "stagger-1",
            "trending_up"
        )
    with c2:
        render_metric_card(
            "Total expenses",
            format_inr(metrics["total_expense"], sign_mode="expense"),
            f"{metrics['expense_count']} expense transactions",
            "val-expense",
            "stagger-2",
            "trending_down"
        )
    with c3:
        bal = metrics["balance"]
        bal_class = "val-balance-pos" if bal >= 0 else "val-balance-neg"
        render_metric_card(
            "Net balance",
            format_inr(bal, sign_mode="balance"),
            "Income − expenses",
            bal_class,
            "stagger-3",
            "account_balance"
        )
    with c4:
        sr_str = metrics["savings_rate_str"]
        render_metric_card(
            "Savings rate",
            sr_str,
            "Balance ÷ income" if sr_str != "N/A" else "Income is ₹0",
            "val-savings",
            "stagger-4",
            "percent"
        )

    # Current Month Budget Status Card with Playful Progress & Shake
    monthly_budget = database.get_budget(current_month_str)
    budget_status = calculate_budget_status(df_all, current_month_str, monthly_budget)

    st.markdown(f"<h3 style='margin-top: 14px; font-size: 20px;'>Budget standing ({current_month_str})</h3>", unsafe_allow_html=True)
    if budget_status["has_budget"]:
        spent = budget_status["spent"]
        b_amt = budget_status["budget"]
        remaining = budget_status["remaining"]
        pct = budget_status["percentage"]
        capped_pct = min(max(pct, 0.0), 100.0)

        if budget_status["is_exceeded"]:
            overspent = spent - b_amt
            st.markdown(f"""
            <div class="budget-container budget-exceeded-shake">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 26px; color: var(--coral);">sentiment_dissatisfied</span>
                        <span style="font-family: Fredoka, sans-serif; font-size: 17px; color: var(--coral);">Over budget by {format_inr(overspent, sign_mode='expense')}</span>
                    </div>
                    <div style="font-size: 13px; color: var(--text-muted); font-variant-numeric: tabular-nums;">
                        Spent {format_inr(spent, sign_mode='expense')} of {format_inr(b_amt)} ({pct:.1f}%)
                    </div>
                </div>
                <div class="budget-progress-track">
                    <div class="budget-progress-fill fill-coral" style="--fill-pct: 100%;"></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="budget-container budget-healthy">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="material-symbols-outlined" style="font-size: 26px; color: var(--mint);">sentiment_satisfied</span>
                        <span style="font-family: Fredoka, sans-serif; font-size: 17px; color: var(--text-main);">On track • {format_inr(remaining, sign_mode='income')} remaining</span>
                    </div>
                    <div style="font-size: 13px; color: var(--text-muted); font-variant-numeric: tabular-nums;">
                        Spent {format_inr(spent, sign_mode='expense')} of {format_inr(b_amt)} ({pct:.1f}% used)
                    </div>
                </div>
                <div class="budget-progress-track">
                    <div class="budget-progress-fill fill-mint" style="--fill-pct: {capped_pct:.1f}%;"></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
    else:
        st.info(f"No budget set for {current_month_str}. Set a spending cap under the 'Budget' tab.")

    # Two Main Visual Charts: Spline Line & Category Donut
    chart_col1, chart_col2 = st.columns(2)
    with chart_col1:
        fig_line = charts.build_income_expense_line_chart(df_filtered, theme=active_theme)
        st.plotly_chart(fig_line, use_container_width=True)
    with chart_col2:
        fig_donut = charts.build_category_donut_chart(df_filtered, theme=active_theme)
        st.plotly_chart(fig_donut, use_container_width=True)

    # Recent Transactions List
    st.markdown("<h3 style='margin-top: 14px; font-size: 20px;'>Recent transactions</h3>", unsafe_allow_html=True)
    if df_filtered.empty:
        st.info("No transactions found for the selected period.")
    else:
        recent_df = df_filtered.head(6).copy()
        display_df = pd.DataFrame({
            "Date": recent_df["date"],
            "Type": recent_df["type"],
            "Category": recent_df["category"],
            "Description": recent_df["description"].fillna("—"),
            "Amount": recent_df.apply(lambda r: format_inr(r["amount"], sign_mode=("income" if r["type"] == "Income" else "expense")), axis=1)
        })
        st.dataframe(display_df, use_container_width=True, hide_index=True)


# ==========================================
# 6. PAGE: TRANSACTIONS
# ==========================================
def render_transactions():
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span class="material-symbols-outlined" style="font-size: 32px; color: var(--sunny);">receipt_long</span>
        <h1 style="margin: 0; font-size: 30px;">Transactions</h1>
    </div>
    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
        Add new cashflows, search records, or download a CSV report.
    </p>
    """, unsafe_allow_html=True)

    today = datetime.date.today()
    tab_view, tab_add, tab_edit, tab_delete = st.tabs([
        "View and filter", 
        "Add transaction", 
        "Edit transaction", 
        "Delete transaction"
    ])

    df_all = database.get_all_transactions()

    # ----------------------------------------------------
    # TAB 1: VIEW & FILTER TRANSACTIONS
    # ----------------------------------------------------
    with tab_view:
        st.markdown("<h4 style='font-size: 18px;'>Filter records</h4>", unsafe_allow_html=True)
        fc1, fc2, fc3, fc4 = st.columns([2, 1.5, 2, 2.5])

        with fc1:
            t_choice = st.selectbox("Period", ["All Time", "This Month", "Last 30 Days", "This Year", "Custom Range"], key="tx_period")
        with fc2:
            type_filter = st.selectbox("Type", ["All", "Expense", "Income"], key="tx_type")
        with fc3:
            all_cats = sorted(list(set(EXPENSE_CATEGORIES + INCOME_CATEGORIES)))
            cat_filter = st.multiselect("Category", options=all_cats, key="tx_cat", placeholder="All categories")
        with fc4:
            search_query = st.text_input("Search notes or category", placeholder="e.g. Metro, groceries...", key="tx_search")

        # Custom date pickers if selected
        start_d, end_d = None, None
        if t_choice == "Custom Range":
            cd_col1, cd_col2 = st.columns(2)
            with cd_col1:
                c_start = st.date_input("Start date", value=today - datetime.timedelta(days=30), max_value=today, key="tx_start_d")
                start_d = c_start.strftime("%Y-%m-%d")
            with cd_col2:
                c_end = st.date_input("End date", value=today, max_value=today, key="tx_end_d")
                end_d = c_end.strftime("%Y-%m-%d")
        else:
            start_d, end_d = get_date_range_presets(t_choice)

        # Apply SHARED FILTER to produce df_filtered
        df_filtered = filter_transactions_df(
            df_all,
            start_date=start_d,
            end_date=end_d,
            categories=cat_filter,
            trans_type=type_filter,
            search_text=search_query
        )

        filtered_metrics = calculate_metrics(df_filtered)

        # Quick summary strip for currently filtered transactions
        m_col1, m_col2, m_col3, m_col4 = st.columns(4)
        m_col1.metric("Records matching", f"{filtered_metrics['transaction_count']} of {len(df_all)}")
        m_col2.metric("Filtered income", format_inr(filtered_metrics["total_income"], sign_mode="income"))
        m_col3.metric("Filtered expenses", format_inr(filtered_metrics["total_expense"], sign_mode="expense"))
        m_col4.metric("Filtered net balance", format_inr(filtered_metrics["balance"], sign_mode="balance"))

        # CSV Export Button
        if not df_filtered.empty:
            export_df = df_filtered[["id", "date", "type", "category", "description", "amount"]].copy()
            export_df.columns = ["ID", "Date", "Type", "Category", "Description", "Amount"]
            csv_bytes = export_df.to_csv(index=False).encode("utf-8-sig")
            st.download_button(
                label="Download filtered CSV",
                data=csv_bytes,
                file_name="expenseflow_transactions.csv",
                mime="text/csv",
                use_container_width=False
            )

        st.markdown("---")

        if df_filtered.empty:
            st.info("No transactions match the selected filters.")
        else:
            table_df = df_filtered.copy()
            table_df["Amount"] = table_df.apply(
                lambda r: format_inr(r["amount"], sign_mode=("income" if r["type"] == "Income" else "expense")), axis=1
            )
            table_display = table_df[["id", "date", "type", "category", "description", "Amount"]].rename(columns={
                "id": "ID",
                "date": "Date",
                "type": "Type",
                "category": "Category",
                "description": "Description"
            })
            st.dataframe(table_display, use_container_width=True, hide_index=True)

    # ----------------------------------------------------
    # TAB 2: ADD TRANSACTION
    # ----------------------------------------------------
    with tab_add:
        st.markdown("<h4 style='font-size: 18px;'>Record a new cashflow</h4>", unsafe_allow_html=True)
        with st.form("add_transaction_form", clear_on_submit=False):
            f_col1, f_col2 = st.columns(2)
            with f_col1:
                new_type = st.selectbox("Transaction type *", ["Expense", "Income"], index=0)
            with f_col2:
                categories_available = EXPENSE_CATEGORIES if new_type == "Expense" else INCOME_CATEGORIES
                new_category = st.selectbox("Category *", categories_available)

            f_col3, f_col4 = st.columns(2)
            with f_col3:
                new_amount = st.number_input(
                    "Amount (₹) *", 
                    min_value=0.0, 
                    value=0.0, 
                    step=100.0, 
                    format="%.2f",
                    help="Must be a positive value greater than 0"
                )
            with f_col4:
                new_date = st.date_input(
                    "Date *", 
                    value=today, 
                    max_value=today,
                    help="Future dates are blocked"
                )

            new_desc = st.text_input(
                "Description (optional)", 
                max_chars=200, 
                placeholder="Brief notes (max 200 characters)"
            )

            submit_add = st.form_submit_button("Save transaction", type="primary")

            if submit_add:
                errors = []
                if new_amount is None or new_amount <= 0:
                    errors.append("Amount must be a positive number greater than 0.")
                if new_date > today:
                    errors.append("Future dates are not allowed.")
                if not new_category:
                    errors.append("Category is required.")
                if new_desc and len(new_desc.strip()) > 200:
                    errors.append("Description cannot exceed 200 characters.")

                if errors:
                    for err in errors:
                        st.error(err)
                else:
                    date_str = new_date.strftime("%Y-%m-%d")
                    new_id = database.add_transaction(
                        trans_type=new_type,
                        amount=float(new_amount),
                        category=new_category,
                        trans_date=date_str,
                        description=new_desc
                    )
                    st.success(f"Transaction #{new_id} ({new_type} of {format_inr(new_amount, sign_mode=('income' if new_type == 'Income' else 'expense'))}) recorded.")
                    st.rerun()

    # ----------------------------------------------------
    # TAB 3: EDIT TRANSACTION
    # ----------------------------------------------------
    with tab_edit:
        st.markdown("<h4 style='font-size: 18px;'>Edit existing record</h4>", unsafe_allow_html=True)
        if df_all.empty:
            st.info("No transactions available to edit.")
        else:
            tx_options = {
                row["id"]: f"#{row['id']} | {row['date']} | {row['type']} | {row['category']} | {format_inr(row['amount'], sign_mode=('income' if row['type'] == 'Income' else 'expense'))} - {row['description'] or 'No description'}"
                for _, row in df_all.iterrows()
            }
            selected_tx_id = st.selectbox("Select transaction to edit", options=list(tx_options.keys()), format_func=lambda x: tx_options[x])
            tx_to_edit = database.get_transaction_by_id(selected_tx_id)

            if tx_to_edit:
                with st.form("edit_tx_form"):
                    e_col1, e_col2 = st.columns(2)
                    with e_col1:
                        edit_type = st.selectbox(
                            "Type *",
                            ["Expense", "Income"],
                            index=0 if tx_to_edit["type"] == "Expense" else 1
                        )
                    with e_col2:
                        edit_cats = EXPENSE_CATEGORIES if edit_type == "Expense" else INCOME_CATEGORIES
                        default_cat_idx = edit_cats.index(tx_to_edit["category"]) if tx_to_edit["category"] in edit_cats else 0
                        edit_category = st.selectbox("Category *", edit_cats, index=default_cat_idx)

                    e_col3, e_col4 = st.columns(2)
                    with e_col3:
                        edit_amount = st.number_input(
                            "Amount (₹) *",
                            min_value=0.0,
                            value=float(tx_to_edit["amount"]),
                            step=100.0,
                            format="%.2f"
                        )
                    with e_col4:
                        curr_date = datetime.datetime.strptime(tx_to_edit["date"], "%Y-%m-%d").date()
                        edit_date = st.date_input("Date *", value=curr_date, max_value=today)

                    edit_desc = st.text_input("Description", value=tx_to_edit["description"] or "", max_chars=200)

                    submit_edit = st.form_submit_button("Update transaction", type="primary")

                    if submit_edit:
                        errors = []
                        if edit_amount is None or edit_amount <= 0:
                            errors.append("Amount must be a positive number greater than 0.")
                        if edit_date > today:
                            errors.append("Future dates are not allowed.")
                        if not edit_category:
                            errors.append("Category is required.")
                        if edit_desc and len(edit_desc.strip()) > 200:
                            errors.append("Description cannot exceed 200 characters.")

                        if errors:
                            for err in errors:
                                st.error(err)
                        else:
                            success = database.update_transaction(
                                trans_id=selected_tx_id,
                                trans_type=edit_type,
                                amount=float(edit_amount),
                                category=edit_category,
                                trans_date=edit_date.strftime("%Y-%m-%d"),
                                description=edit_desc
                            )
                            if success:
                                st.success(f"Transaction #{selected_tx_id} updated.")
                                st.rerun()

    # ----------------------------------------------------
    # TAB 4: DELETE TRANSACTION (WITH CONFIRMATION & CORAL BUTTON)
    # ----------------------------------------------------
    with tab_delete:
        st.markdown("<h4 style='font-size: 18px;'>Delete transaction</h4>", unsafe_allow_html=True)
        if df_all.empty:
            st.info("No transactions available to delete.")
        else:
            del_options = {
                row["id"]: f"#{row['id']} | {row['date']} | {row['type']} | {row['category']} | {format_inr(row['amount'], sign_mode=('income' if row['type'] == 'Income' else 'expense'))} - {row['description'] or 'No description'}"
                for _, row in df_all.iterrows()
            }
            del_id = st.selectbox("Select transaction to delete", options=list(del_options.keys()), format_func=lambda x: del_options[x])
            del_tx = database.get_transaction_by_id(del_id)

            if del_tx:
                st.warning(
                    f"Selected transaction: #{del_id} • {del_tx['type']} of "
                    f"{format_inr(del_tx['amount'], sign_mode=('income' if del_tx['type'] == 'Income' else 'expense'))} "
                    f"({del_tx['category']}) on {del_tx['date']}."
                )
                confirm_delete = st.checkbox(f"Confirm permanent deletion of transaction #{del_id}")
                
                # Coral styling for delete button with Espresso text
                st.markdown('<div class="coral-btn"><span class="del-btn-marker"></span>', unsafe_allow_html=True)
                if st.button("Permanently delete", type="primary", disabled=not confirm_delete):
                    database.delete_transaction(del_id)
                    st.success(f"Transaction #{del_id} removed.")
                    st.rerun()
                st.markdown('</div>', unsafe_allow_html=True)


# ==========================================
# 7. PAGE: ANALYTICS
# ==========================================
def render_analytics():
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span class="material-symbols-outlined" style="font-size: 32px; color: var(--sunny);">analytics</span>
        <h1 style="margin: 0; font-size: 30px;">Financial analytics</h1>
    </div>
    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
        Visual trends, category breakdowns, and spending distribution.
    </p>
    """, unsafe_allow_html=True)

    df_all = database.get_all_transactions()
    today = datetime.date.today()

    # Period Filter
    an_col1, an_col2 = st.columns([2, 4])
    with an_col1:
        an_preset = st.selectbox("Date range", ["All Time", "This Month", "Last 30 Days", "This Year", "Custom Range"], key="an_preset")

    start_date, end_date = None, None
    if an_preset == "Custom Range":
        with an_col2:
            c1, c2 = st.columns(2)
            with c1:
                cs = st.date_input("Start date", value=today - datetime.timedelta(days=30), max_value=today, key="an_start")
                start_date = cs.strftime("%Y-%m-%d")
            with c2:
                ce = st.date_input("End date", value=today, max_value=today, key="an_end")
                end_date = ce.strftime("%Y-%m-%d")
    else:
        start_date, end_date = get_date_range_presets(an_preset)

    # SHARED FILTERED DATAFRAME
    df_filtered = filter_transactions_df(df_all, start_date=start_date, end_date=end_date)
    metrics = calculate_metrics(df_filtered)

    # Summary Metrics Row
    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Income", format_inr(metrics["total_income"], sign_mode="income"))
    m2.metric("Expenses", format_inr(metrics["total_expense"], sign_mode="expense"))
    m3.metric("Net balance", format_inr(metrics["balance"], sign_mode="balance"))
    m4.metric("Savings rate", metrics["savings_rate_str"])

    st.markdown("---")

    # Monthly Cashflow Spline Line & Category Donut
    c_left, c_right = st.columns(2)
    with c_left:
        fig_line = charts.build_income_expense_line_chart(df_filtered, theme=active_theme)
        st.plotly_chart(fig_line, use_container_width=True)
    with c_right:
        fig_donut = charts.build_category_donut_chart(df_filtered, theme=active_theme)
        st.plotly_chart(fig_donut, use_container_width=True)

    # Category Ranking Horizontal Bar (Sunny accent)
    st.markdown("<h3 style='margin-top: 14px; font-size: 20px;'>Category ranking</h3>", unsafe_allow_html=True)
    fig_cat_bar = charts.build_category_bar_chart(df_filtered, theme=active_theme)
    st.plotly_chart(fig_cat_bar, use_container_width=True)

    # Category Breakdown Table
    expense_rows = df_filtered[df_filtered["type"] == "Expense"]
    if not expense_rows.empty and expense_rows["amount"].sum() > 0:
        st.markdown("<h3 style='margin-top: 14px; font-size: 20px;'>Category breakdown details</h3>", unsafe_allow_html=True)
        total_exp = expense_rows["amount"].sum()
        cat_group = expense_rows.groupby("category").agg(
            Total_Spent=("amount", "sum"),
            Transaction_Count=("id", "count")
        ).reset_index()
        cat_group["Percentage"] = (cat_group["Total_Spent"] / total_exp * 100).round(1).astype(str) + "%"
        cat_group["Formatted_Spent"] = cat_group["Total_Spent"].apply(lambda x: format_inr(x, sign_mode="expense"))
        cat_group = cat_group.sort_values(by="Total_Spent", ascending=False)

        cat_display = cat_group[["category", "Formatted_Spent", "Percentage", "Transaction_Count"]].rename(columns={
            "category": "Category",
            "Formatted_Spent": "Total spent",
            "Percentage": "Share of total expenses",
            "Transaction_Count": "Transactions count"
        })
        st.dataframe(cat_display, use_container_width=True, hide_index=True)


# ==========================================
# 8. PAGE: BUDGET
# ==========================================
def render_budget():
    st.markdown("""
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span class="material-symbols-outlined" style="font-size: 32px; color: var(--sunny);">savings</span>
        <h1 style="margin: 0; font-size: 30px;">Monthly budget planner</h1>
    </div>
    <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 20px;">
        Allocate monthly caps and monitor real-time expenditure thresholds.
    </p>
    """, unsafe_allow_html=True)

    df_all = database.get_all_transactions()
    today = datetime.date.today()

    # Month & Year selector
    b_col1, b_col2 = st.columns(2)
    current_year = today.year
    current_month_idx = today.month - 1

    with b_col1:
        selected_year = st.selectbox("Year", options=[current_year - 1, current_year, current_year + 1], index=1)
    with b_col2:
        month_names = [
            "January", "February", "March", "April", "May", "June", 
            "July", "August", "September", "October", "November", "December"
        ]
        selected_month_name = st.selectbox("Month", options=month_names, index=current_month_idx)

    selected_month_num = month_names.index(selected_month_name) + 1
    selected_month_str = f"{selected_year:04d}-{selected_month_num:02d}"

    # Current budget & status
    current_budget = database.get_budget(selected_month_str)
    status = calculate_budget_status(df_all, selected_month_str, current_budget)

    st.markdown("---")

    # Set / Update Budget Form
    st.markdown(f"<h4 style='font-size: 18px;'>Configure budget for {selected_month_name} {selected_year}</h4>", unsafe_allow_html=True)
    with st.form("set_budget_form"):
        b_input_col1, b_input_col2 = st.columns([3, 1])
        with b_input_col1:
            new_budget_amt = st.number_input(
                f"Monthly limit for {selected_month_str} (₹) *",
                min_value=0.0,
                value=float(current_budget or 0.0),
                step=500.0,
                format="%.2f",
                help="Enter a positive budget value"
            )
        with b_input_col2:
            st.write("")
            st.write("")
            save_budget_btn = st.form_submit_button("Save budget", type="primary", use_container_width=True)

        if save_budget_btn:
            if new_budget_amt is None or new_budget_amt <= 0:
                st.error("Budget must be a positive number greater than 0.")
            else:
                database.set_budget(selected_month_str, float(new_budget_amt))
                st.success(f"Monthly budget for {selected_month_name} {selected_year} set to {format_inr(new_budget_amt)}.")
                st.rerun()

    st.markdown("---")

    # Status Display
    st.markdown(f"<h4 style='font-size: 18px;'>Standing for {selected_month_name} {selected_year}</h4>", unsafe_allow_html=True)
    spent = status["spent"]

    if status["has_budget"]:
        b_val = status["budget"]
        remaining = status["remaining"]
        pct = status["percentage"]
        capped_pct = min(max(pct, 0.0), 100.0)

        # Status Cards
        sc1, sc2, sc3, sc4 = st.columns(4)
        with sc1:
            render_metric_card("Monthly budget", format_inr(b_val), f"Allocated for {selected_month_str}", "val-income", "stagger-1", "payments")
        with sc2:
            render_metric_card("Total spent", format_inr(spent, sign_mode="expense"), "Recorded expenses", "val-expense", "stagger-2", "shopping_cart")
        with sc3:
            rem_class = "val-balance-pos" if remaining >= 0 else "val-balance-neg"
            rem_title = "Remaining" if remaining >= 0 else "Over budget by"
            rem_icon = "check_circle" if remaining >= 0 else "error_outline"
            render_metric_card(rem_title, format_inr(abs(remaining), sign_mode=('income' if remaining >= 0 else 'expense')), "Budget − spent", rem_class, "stagger-3", rem_icon)
        with sc4:
            pct_class = "val-expense" if status["is_exceeded"] else "val-savings"
            render_metric_card("Budget utilized", f"{pct:.1f}%", f"{pct:.1f}% of allocation", pct_class, "stagger-4", "donut_large")

        # Exceeded Shake Alert or Healthy Message
        if status["is_exceeded"]:
            overspent = spent - b_val
            st.markdown(f"""
            <div class="budget-container budget-exceeded-shake">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span class="material-symbols-outlined" style="font-size: 26px; color: var(--coral);">sentiment_dissatisfied</span>
                    <span style="font-family: Fredoka, sans-serif; font-size: 18px; color: var(--coral);">Over budget by {format_inr(overspent, sign_mode='expense')}</span>
                </div>
                <div style="font-size: 14px; color: var(--text-muted); font-variant-numeric: tabular-nums;">
                    Expenses ({format_inr(spent, sign_mode='expense')}) exceed the monthly limit of {format_inr(b_val)}.
                </div>
                <div class="budget-progress-track">
                    <div class="budget-progress-fill fill-coral" style="--fill-pct: 100%;"></div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="budget-container budget-healthy">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span class="material-symbols-outlined" style="font-size: 26px; color: var(--mint);">sentiment_satisfied</span>
                    <span style="font-family: Fredoka, sans-serif; font-size: 18px; color: var(--text-main);">Within budget standing</span>
                </div>
                <div style="font-size: 14px; color: var(--text-muted); font-variant-numeric: tabular-nums;">
                    Spent {format_inr(spent, sign_mode='expense')} out of {format_inr(b_val)}. You have {format_inr(remaining, sign_mode='income')} remaining for {selected_month_name}.
                </div>
                <div class="budget-progress-track">
                    <div class="budget-progress-fill fill-mint" style="--fill-pct: {capped_pct:.1f}%;"></div>
                </div>
            </div>
            """, unsafe_allow_html=True)

    else:
        st.info(f"No budget set for {selected_month_name} {selected_year}. Current recorded expenses: {format_inr(spent, sign_mode='expense')}.")

    # Itemized expenses in this month
    st.markdown(f"<h4 style='font-size: 18px; margin-top: 14px;'>Expense entries in {selected_month_name} {selected_year}</h4>", unsafe_allow_html=True)
    month_expenses = df_all[
        (df_all["date"].str.startswith(selected_month_str)) &
        (df_all["type"] == "Expense")
    ]
    if month_expenses.empty:
        st.caption("No expense transactions recorded in this month yet.")
    else:
        m_display = month_expenses[["id", "date", "category", "description", "amount"]].copy()
        m_display["Amount"] = m_display["amount"].apply(lambda a: format_inr(a, sign_mode="expense"))
        m_display = m_display[["id", "date", "category", "description", "Amount"]].rename(columns={
            "id": "ID", "date": "Date", "category": "Category", "description": "Description"
        })
        st.dataframe(m_display, use_container_width=True, hide_index=True)


# ==========================================
# 9. ROUTING LOGIC
# ==========================================
if nav_page == "Overview":
    render_overview()
elif nav_page == "Transactions":
    render_transactions()
elif nav_page == "Analytics":
    render_analytics()
elif nav_page == "Budget":
    render_budget()
