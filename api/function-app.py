import azure.functions as func
import os
import logging
from sqlalchemy import create_engine, Column, Integer, String, Sequence
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
# Set up SQLAlchemy
AZURE_SQL_CONNECTIONSTRING='Driver={ODBC Driver 18 for SQL Server};Server=tcp:<database-server-name>.database.windows.net,1433;Database=<database-name>;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30'
DATABASE_URL = "mssql+pyodbc://username:password@server/database?driver=ODBC+Driver+17+for+SQL+Server"
DATABASE_URL = os.environ["AZURE_SQL_CONNECTIONSTRING"]

engine = create_engine(DATABASE_URL)
Session = sessionmaker(bind=engine)
Base = declarative_base()
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)
    name = Column(String(50))
    email = Column(String(50))


@app.route(route="hw", methods=["GET"])
def helloworld(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # Create a new session
    session = Session()

    try:
        # Example: Add a new user
        new_user = User(name="John Doe", email="john.doe@example.com")
        session.add(new_user)
        session.commit()

        # Example: Query users
        users = session.query(User).all()
        user_list = [{"id": user.id, "name": user.name, "email": user.email} for user in users]

        return func.HttpResponse(f"Users: {user_list}", status_code=200)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        return func.HttpResponse("An error occurred.", status_code=500)
    finally:
        session.close()

    # name = req.params.get('name')
    # if not name:
    #     try:
    #         req_body = req.get_json()
    #     except ValueError:
    #         pass
    #     else:
    #         name = req_body.get('name')

    # if name:
    #     return func.HttpResponse(f"Hello, {name}. This HTTP triggered function executed successfully.")
    # else:
    #     return func.HttpResponse(
    #          "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response.",
    #          status_code=200
    #     )

