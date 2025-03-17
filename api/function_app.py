import azure.functions as func
import logging, os
from sqlalchemy.orm import sessionmaker
from service_models import engine
from function_app_context import context
from service_households import bpHouseholds
from service_users import bpUsers
from service_tasks import bpTasks
from service_activities import bpActivities
from service_memberships import bpMembers

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)
factory = sessionmaker(bind=engine)
session = factory()
context.session = session
context.KEY = os.getenv("DEBUGKEY")

app.register_blueprint(bpHouseholds)
app.register_blueprint(bpUsers)
app.register_blueprint(bpTasks)
app.register_blueprint(bpActivities)
app.register_blueprint(bpMembers)

@app.route(route="ping", methods=["GET"])
def ping(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    return func.HttpResponse("pong", status_code=200)
