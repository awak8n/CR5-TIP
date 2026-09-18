"""
Система обработки предложений пользователей.
Начальный сценарий (ПР1): регистрация одного предложения,
расчёт его приоритета и вывод краткой сводки.
"""

from datetime import date

# --- Простые типы данных ---
suggestion_title = "Добавить тёмную тему в приложение"
category = "UI/UX"
votes_str = "42"                 # голоса пришли в виде строки (например, из формы)
votes = int(votes_str)           # преобразование типов: str -> int
is_reviewed = False
submission_date = date(2026, 9, 18)
author_email = "user@example.com"


def get_review_status(is_reviewed):
    """Возвращает текстовый статус рассмотрения предложения."""
    if is_reviewed:
        return "Предложение рассмотрено"
    else:
        return "Предложение ожидает рассмотрения"


def calculate_priority(votes, category):
    """Определяет приоритет предложения по числу голосов и категории."""
    if votes >= 50:
        priority = "Высокий"
    elif votes >= 20:
        priority = "Средний"
    else:
        priority = "Низкий"

    # Предложения по безопасности всегда получают высокий приоритет
    if category == "Безопасность":
        priority = "Высокий"

    return priority


def make_decision(is_reviewed, priority):
    """Выносит решение по предложению на основе приоритета (только для рассмотренных)."""
    if not is_reviewed:
        return "Решение не вынесено"

    if priority == "Высокий":
        return "Принято"
    elif priority == "Средний":
        return "Принято с доработкой"
    else:
        return "Отклонено"


def format_summary(title, category, votes, priority, status):
    """Формирует строку с краткой сводкой по предложению."""
    return (
        f"«{title}» | Категория: {category} | "
        f"Голоса: {votes} | Приоритет: {priority} | Статус: {status}"
    )


def main():
    status = get_review_status(is_reviewed)
    priority = calculate_priority(votes, category)
    decision = make_decision(is_reviewed, priority)
    summary = format_summary(suggestion_title, category, votes, priority, status)

    print(f"Дата подачи: {submission_date}")
    print(f"Автор: {author_email}")
    print(summary)
    print(f"Решение: {decision}")


if __name__ == "__main__":
    main()
