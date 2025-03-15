import azure.functions as func
import logging
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
context.KEY = '38a17afd-be2d-471b-9609-fc55f7c00381'

app.register_blueprint(bpHouseholds)
app.register_blueprint(bpUsers)
app.register_blueprint(bpTasks)
app.register_blueprint(bpActivities)
app.register_blueprint(bpMembers)

@app.route(route="ping", methods=["GET"])
def ping(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    return func.HttpResponse("pong", status_code=200)
