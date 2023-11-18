import mysql.connector

class DataBaseConnection:
    def __init__(self):
        self.db_config = {
            'host': 'localhost',
            'user': 'root',
            'password': '',
            'database': 'io'
        }

        self.connection = mysql.connector.connect(**self.db_config)

        if self.connection.is_connected():
            print('Połączono z bazą danych')

    def execute_query(self, query, data=None):
        try:
            cursor = self.connection.cursor(dictionary=True)
            cursor.execute(query, data)
            self.connection.commit()
            return cursor

        except mysql.connector.Error as err:
            print(f'Błąd: {err}')

        finally:
            if 'cursor' in locals():
                cursor.close()

    def close_connection(self):
        if 'connection' in locals() and self.connection.is_connected():
            self.connection.close()
            print('Połączenie z bazą danych zamknięte')