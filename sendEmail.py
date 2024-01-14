import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dataBase import DataBaseConnection


# Funkcja wysyłające email
def send_email(subject, body, to_email):
    # Ustawienia serwera SMTP (tutaj przykład dla Gmail)
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'ioweatherapp2024@gmail.com'
    smtp_password = 'dKb^ja8M1'

    # Adres nadawcy
    from_email = 'twoj@gmail.com'

    # Konstrukcja wiadomości
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    # Treść wiadomości
    msg.attach(MIMEText(body, 'plain'))

    # Utworzenie połączenia z serwerem SMTP
    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)

        # Wysłanie wiadomości
        server.sendmail(from_email, to_email, msg.as_string())


# Funkcja zwracające email użytkownika
def getUserEmail(db_connection, user_id):
    query = "SELECT email FROM uzytkownik WHERE userID = %s"
    cursor, result = db_connection.execute_query(query, user_id)
    email = result['email']
    return email