"""
charts.py - Plotly Visualizations with Bronze Palette & Theme Support

Theme-aware charts utilizing the Bronze Palette:
- Espresso #372C2E, Cocoa #563727, Mint #5ED3A6, Coral #FF6B8A, Sunny #FFC857, White #FFFFFF
- Smooth spline line chart for Monthly Income vs. Expenses (3px lines, round markers, 15% Mint fill)
- Interactive Category Donut chart with Mint, Coral, Sunny segments and centre total
- Horizontal Category Ranking bar chart
- Transitions enabled for smooth animations on data updates
- Follows active theme (dark or light) with opacity-based gridlines
- Strict adherence to NO emojis and outline-first aesthetics
"""

import plotly.graph_objects as go
import pandas as pd
from typing import Optional, List
from calculations import format_inr

# Bronze Color Palette Constants
COLOR_ESPRESSO = "#372C2E"
COLOR_COCOA = "#563727"
COLOR_MINT = "#5ED3A6"       # Income, positive
COLOR_CORAL = "#FF6B8A"      # Expenses, negative
COLOR_SUNNY = "#FFC857"      # Highlights, accents
COLOR_WHITE = "#FFFFFF"

# Category palette: Mint, Coral, Sunny, followed by tasteful tints
DONUT_PALETTE = [
    "#5ED3A6",  # Mint
    "#FF6B8A",  # Coral
    "#FFC857",  # Sunny
    "#7EE2BE",  # Mint tint
    "#FF8EA6",  # Coral tint
    "#FFD982",  # Sunny tint
    "#9DEBD0",  # Mint soft
    "#FFAEC0",  # Coral soft
    "#FFE5A3",  # Sunny soft
    "#563727",  # Cocoa
]


def _get_theme_styles(theme: str = "dark"):
    """Returns text color, grid color, and font families based on the active theme."""
    is_dark = (theme == "dark")
    text_color = COLOR_WHITE if is_dark else COLOR_ESPRESSO
    muted_text = "rgba(255, 255, 255, 0.70)" if is_dark else "rgba(55, 44, 46, 0.65)"
    grid_color = "rgba(255, 255, 255, 0.10)" if is_dark else "rgba(55, 44, 46, 0.10)"
    card_bg = COLOR_COCOA if is_dark else COLOR_WHITE

    return {
        "text": text_color,
        "muted": muted_text,
        "grid": grid_color,
        "card_bg": card_bg,
        "title_font": "Fredoka, sans-serif",
        "body_font": "Hanken Grotesk, sans-serif"
    }


def _create_empty_figure(message: str, theme: str = "dark") -> go.Figure:
    """Returns an empty chart figure with clean typography and no emoji."""
    styles = _get_theme_styles(theme)
    fig = go.Figure()
    fig.add_annotation(
        text=message,
        xref="paper",
        yref="paper",
        x=0.5,
        y=0.5,
        showarrow=False,
        font=dict(size=14, color=styles["muted"], family=styles["body_font"])
    )
    fig.update_layout(
        xaxis=dict(showgrid=False, showticklabels=False, zeroline=False),
        yaxis=dict(showgrid=False, showticklabels=False, zeroline=False),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        height=320,
        margin=dict(l=20, r=20, t=40, b=20)
    )
    return fig


def build_income_expense_line_chart(df: pd.DataFrame, theme: str = "dark") -> go.Figure:
    """
    Builds a smooth line chart (Plotly, line_shape="spline", 3px lines, round markers):
    - Income in Mint (#5ED3A6) with 15% fill under line
    - Expenses in Coral (#FF6B8A)
    - Hover tooltips show Month, Income (+ ₹...), and Expenses (− ₹...) with Indian comma grouping.
    - Transitions enabled for smooth animation on change.
    """
    styles = _get_theme_styles(theme)

    if df is None or df.empty:
        return _create_empty_figure("No transaction data available for this period.", theme)

    df_chart = df.copy()
    df_chart["month"] = pd.to_datetime(df_chart["date"]).dt.strftime("%Y-%m")

    monthly_data = (
        df_chart.groupby(["month", "type"])["amount"]
        .sum()
        .reset_index()
    )

    if monthly_data.empty:
        return _create_empty_figure("No transaction data available for this period.", theme)

    all_months = sorted(monthly_data["month"].unique())

    income_map = {m: 0.0 for m in all_months}
    expense_map = {m: 0.0 for m in all_months}

    for _, row in monthly_data.iterrows():
        if row["type"] == "Income":
            income_map[row["month"]] = float(row["amount"])
        elif row["type"] == "Expense":
            expense_map[row["month"]] = float(row["amount"])

    income_vals = [income_map[m] for m in all_months]
    expense_vals = [expense_map[m] for m in all_months]

    # Formatted hover strings with explicit + and − signs
    income_hover = [
        f"Month: {m}<br>Income: {format_inr(v, sign_mode='income')}<extra></extra>"
        for m, v in zip(all_months, income_vals)
    ]
    expense_hover = [
        f"Month: {m}<br>Expenses: {format_inr(v, sign_mode='expense')}<extra></extra>"
        for m, v in zip(all_months, expense_vals)
    ]

    fig = go.Figure()

    # 1. Income Spline Line with 15% fill
    fig.add_trace(go.Scatter(
        x=all_months,
        y=income_vals,
        name="Income",
        mode="lines+markers",
        line=dict(shape="spline", width=3, color=COLOR_MINT),
        marker=dict(size=8, symbol="circle", color=COLOR_MINT),
        fill="tozeroy",
        fillcolor="rgba(94, 211, 166, 0.15)",
        hovertemplate=income_hover
    ))

    # 2. Expense Spline Line
    fig.add_trace(go.Scatter(
        x=all_months,
        y=expense_vals,
        name="Expenses",
        mode="lines+markers",
        line=dict(shape="spline", width=3, color=COLOR_CORAL),
        marker=dict(size=8, symbol="circle", color=COLOR_CORAL),
        hovertemplate=expense_hover
    ))

    fig.update_layout(
        title=dict(
            text="Monthly cashflow trend",
            font=dict(size=17, color=styles["text"], family=styles["title_font"]),
            x=0.02
        ),
        xaxis=dict(
            title=dict(text="Month", font=dict(color=styles["muted"], size=12, family=styles["body_font"])),
            tickfont=dict(color=styles["text"], family=styles["body_font"]),
            showgrid=False,
            zeroline=False
        ),
        yaxis=dict(
            title=dict(text="Amount (₹)", font=dict(color=styles["muted"], size=12, family=styles["body_font"])),
            tickfont=dict(color=styles["text"], family=styles["body_font"]),
            tickprefix="₹",
            showgrid=True,
            gridcolor=styles["grid"],
            zeroline=False
        ),
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1,
            font=dict(color=styles["text"], family=styles["body_font"])
        ),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=40, r=20, t=50, b=40),
        height=350,
        hoverlabel=dict(
            bgcolor=styles["card_bg"],
            font=dict(color=styles["text"], family=styles["body_font"], size=12),
            bordercolor=styles["grid"]
        ),
        transition={"duration": 500, "easing": "cubic-in-out"}
    )

    return fig


# Backward-compatible alias
def build_income_expense_bar_chart(df: pd.DataFrame, theme: str = "dark") -> go.Figure:
    """Redirects to the new smooth line chart per updated requirements."""
    return build_income_expense_line_chart(df, theme=theme)


def build_category_donut_chart(df: pd.DataFrame, theme: str = "dark") -> go.Figure:
    """
    Builds a Donut chart with rounded segments in Mint, Coral, and Sunny palette.
    Shows the total expenses in the centre.
    Hover shows category, ₹ amount with − sign, and percentage.
    """
    styles = _get_theme_styles(theme)

    if df is None or df.empty:
        return _create_empty_figure("No expense data available for this period.", theme)

    expense_df = df[df["type"] == "Expense"]
    if expense_df.empty or expense_df["amount"].sum() == 0:
        return _create_empty_figure("No expense records found for this period.", theme)

    category_data = (
        expense_df.groupby("category")["amount"]
        .sum()
        .reset_index()
        .sort_values(by="amount", ascending=False)
    )

    total_spent = category_data["amount"].sum()
    total_spent_str = format_inr(total_spent, sign_mode="expense")

    # Custom hover labels with Indian formatting and minus sign
    hover_texts = [
        f"<b>{cat}</b><br>Amount: {format_inr(amt, sign_mode='expense')}<br>Share: {amt / total_spent * 100:.1f}%<extra></extra>"
        for cat, amt in zip(category_data["category"], category_data["amount"])
    ]

    fig = go.Figure(data=[go.Pie(
        labels=category_data["category"],
        values=category_data["amount"],
        hole=0.55,
        marker=dict(
            colors=DONUT_PALETTE[:len(category_data)],
            line=dict(color=styles["card_bg"], width=3)  # Rounded segment outline effect
        ),
        textinfo="percent",
        textfont=dict(size=11, color=COLOR_ESPRESSO, family=styles["body_font"]),
        hovertemplate=hover_texts
    )])

    fig.update_layout(
        title=dict(
            text="Spending by category",
            font=dict(size=17, color=styles["text"], family=styles["title_font"]),
            x=0.02
        ),
        annotations=[
            dict(
                text=f"<span style='font-size:11px;color:{styles['muted']};font-family:{styles['body_font']};'>Total expenses</span><br><b style='font-size:16px;color:{styles['text']};font-family:{styles['title_font']};'>{total_spent_str}</b>",
                x=0.5,
                y=0.5,
                showarrow=False
            )
        ],
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=-0.22,
            xanchor="center",
            x=0.5,
            font=dict(color=styles["text"], size=11, family=styles["body_font"])
        ),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=20, r=20, t=50, b=55),
        height=350,
        hoverlabel=dict(
            bgcolor=styles["card_bg"],
            font=dict(color=styles["text"], family=styles["body_font"], size=12),
            bordercolor=styles["grid"]
        ),
        transition={"duration": 500, "easing": "cubic-in-out"}
    )

    return fig


def build_category_bar_chart(df: pd.DataFrame, theme: str = "dark") -> go.Figure:
    """
    Builds a horizontal ranking bar chart showing Category expenses sorted high to low.
    Uses Sunny accent (#FFC857) with Espresso text inside or theme text outside.
    """
    styles = _get_theme_styles(theme)

    if df is None or df.empty:
        return _create_empty_figure("No expense data available.", theme)

    expense_df = df[df["type"] == "Expense"]
    if expense_df.empty or expense_df["amount"].sum() == 0:
        return _create_empty_figure("No expense records found.", theme)

    cat_summary = (
        expense_df.groupby("category")["amount"]
        .sum()
        .reset_index()
        .sort_values(by="amount", ascending=True)
    )

    hover_texts = [
        f"<b>{cat}</b><br>Spent: {format_inr(amt, sign_mode='expense')}<extra></extra>"
        for cat, amt in zip(cat_summary["category"], cat_summary["amount"])
    ]

    fig = go.Figure(go.Bar(
        x=cat_summary["amount"],
        y=cat_summary["category"],
        orientation="h",
        marker=dict(
            color=COLOR_SUNNY,
            line=dict(width=0)
        ),
        hovertemplate=hover_texts
    ))

    fig.update_layout(
        title=dict(
            text="Category expense ranking",
            font=dict(size=17, color=styles["text"], family=styles["title_font"]),
            x=0.02
        ),
        xaxis=dict(
            title=dict(text="Amount (₹)", font=dict(color=styles["muted"], size=12, family=styles["body_font"])),
            tickprefix="₹",
            tickfont=dict(color=styles["text"], family=styles["body_font"]),
            gridcolor=styles["grid"],
            zeroline=False
        ),
        yaxis=dict(
            tickfont=dict(color=styles["text"], family=styles["body_font"])
        ),
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        margin=dict(l=40, r=20, t=50, b=40),
        height=330,
        hoverlabel=dict(
            bgcolor=styles["card_bg"],
            font=dict(color=styles["text"], family=styles["body_font"], size=12),
            bordercolor=styles["grid"]
        ),
        transition={"duration": 500, "easing": "cubic-in-out"}
    )

    return fig
