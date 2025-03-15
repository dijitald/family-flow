import azure.functions as func
import logging, json
from service_models import Chore
from function_app_context import context

bpChores = func.Blueprint()

@bpChores.route(route="chores", methods=['GET'])
def chore_service(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('get_chores called')
    return func.HttpResponse("Hello, chores!", status_code=200)
    chores = session.query(Chore).all()
    return func.HttpResponse(json.dumps([chore.__dict__ for chore in chores]), mimetype="application/json")
