import azure.functions as func
import logging, os
from sqlalchemy.orm import sessionmaker, scoped_session
from service_models import engine
from function_app_context import context
from service_households import bpHouseholds
from service_users import bpUsers
from service_tasks import bpTasks
from service_activities import bpActivities
from service_memberships import bpMembers
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

configure_azure_monitor(logger_name="familyflow")
context.logging = logging.getLogger("familyflow")  

# try:
#     app.register_blueprint(bpHouseholds)
#     app.register_blueprint(bpUsers)
#     app.register_blueprint(bpTasks)
#     app.register_blueprint(bpActivities)
#     app.register_blueprint(bpMembers)
# except Exception as e:
#     context.logging.critical(f"Error initializing application: {e}")
#     raise e

# try:
#     SQLAlchemyInstrumentor().instrument(engine=engine, service="familyflow")
#     factory = sessionmaker(bind=engine) 
#     session = scoped_session(factory)
#     context.session = session
#     context.KEY = os.getenv("DEBUGKEY")
# except Exception as e:
#     context.logging.critical(f"Error initializing database: {e}")
#     raise e

@app.route(route="ping", methods=["GET"])
def ping(req: func.HttpRequest) -> func.HttpResponse:
    context.logging.info('Python HTTP trigger function processed a request.')
    return func.HttpResponse("pong", status_code=200)
