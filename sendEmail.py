import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dataBase import DataBaseConnection
from getWeather import getTodayForecast
import requests
from email.mime.image import MIMEImage
import smtplib


# Funkcja wysyłające email
def send_email(subject, body, to_email):
    # Ustawienia serwera SMTP 
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'ioweatherapp2024@gmail.com'
    smtp_password = read_from_file("psw.txt")

    from_email = 'ioweatherapp2024@gmail.com'

    # Konstrukcja wiadomości
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

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
    
# Funkcja wysyłająca wszystkim użytkownikom z włączonymi powiadomieniami pogodę dla ich defaultCity    
def send_daily_email(db_connection):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    smtp_username = 'ioweatherapp2024@gmail.com'
    smtp_password = read_from_file("psw.txt")
    api_key = 'c71bd51c9e09474a8db153108231911'

    from_email = 'ioweatherapp2024@gmail.com'

    query = "SELECT * FROM uzytkownik WHERE powiadomienia = 1 AND COALESCE(miasto, '') != ''"
    cursor, result = db_connection.execute_query(query)

    for row in result:
        to_email = row['email']
        miasto = row['miasto']

        weather_api_url = f'http://api.weatherapi.com/v1/forecast.json?key={api_key}&q={miasto}&days=10&aqi=no&alerts=no'
        response = requests.get(weather_api_url)

        if response.status_code == 200:
            weather_data = response.json()
            stan = weather_data['forecast']['forecastday'][0]['day']['condition']['text']
            temp = weather_data['forecast']['forecastday'][0]['day']['maxtemp_c']

            # Konstrukcja wiadomości
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = "Pogoda na dziś"

            body = f"Pogoda w {miasto} to: {stan} {temp}  "
            msg.attach(MIMEText(body, 'plain'))

            # Utworzenie połączenia z serwerem SMTP
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_username, smtp_password)

                # Wysłanie wiadomości
                server.sendmail(from_email, to_email, msg.as_string())
               