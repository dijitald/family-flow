import azure.functions as func
import logging
from azure.monitor.opentelemetry import configure_azure_monitor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor

app = func.FunctionApp(http_auth_level=func.AuthLevel.ANONYMOUS)

configure_azure_monitor(
    logger_name="familyflow",  # Set the namespace for the logger in which you would like to collect telemetry for if you are collecting logging telemetry. This is imperative so you do not collect logging telemetry from the SDK itself.
)
logger = logging.getLogger("familyflow")  # Logging telemetry will be collected from logging calls made with this logger and all of it's children loggers.

@app.route(route="ping", methods=["GET"])
def ping(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('1 Python HTTP trigger function processed a request.')
    logger.info('2 Python HTTP trigger function processed a request.')
    return func.HttpResponse("pong", status_code=200)

