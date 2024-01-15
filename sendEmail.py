import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dataBase import DataBaseConnection


# Funkcja wysyłające email
def send_email(subject, body, to_email):
    # Ustawienia serwera SMTP (tutaj przykład dla Gmail)
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = read_from_file("psw.txt")
    smtp_password = 'ojah yqyj uhuz ptxy'

    # Adres nadawcy
    from_email = 'ioweatherapp2024@gmail.com'

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

def read_from_file(plik):
    try:
        with open(plik, "r") as file:
            content = file.read()
        return content
    except FileNotFoundError:
        return "Plik nie istnieje."
    except Exception as e:
        return f"Wystąpił błąd podczas odczytywania pliku: {str(e)}"