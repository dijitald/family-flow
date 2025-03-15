import azure.functions as func
import uuid
import logging, json
from service_models import Household
from function_app_context import context

bpHouseholds = func.Blueprint()

@bpHouseholds.route(route="households", methods=['GET', 'POST'])
def household_service(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Household service called')
    
    if req.method == 'GET' :                
        #retrieving a household
        logging.info('getting household')
        try:
            hid = req.params.get('hid')
            if hid:
                id = uuid.UUID(hid)
                if not id:
                    raise ValueError()
            else:
                raise ValueError()
        except ValueError:
            return func.HttpResponse("Invalid House ID", status_code=400)

        if id == uuid.UUID(context.KEY):
            logging.info('getting ALL households')
            households = context.session.query(Household).all()
            return func.HttpResponse(json.dumps([household.to_dict() for household in households], default=str), mimetype="application/json")
        else:
            household = context.session.query(Household).filter(Household.id == id).first()
            if household:
                return func.HttpResponse(json.dumps(household.to_dict(), default=str), mimetype="application/json")
            return func.HttpResponse("Household not found", status_code=404)
    
    elif req.method == 'POST':                
        #creating/updating a household
        logging.info('updating household')
        try:
            household_data = req.get_json()
        except ValueError:
            pass
        else:
            name = household_data.get('name')
            idStr = household_data.get('id')
        logging.info('household_data : %s', household_data)

        if not idStr and not name:
            return func.HttpResponse("Household data must contain id or name", status_code=400)
        elif not idStr: # new household
            logging.info('new household : %s', name)
            household = Household(name=name)
            context.session.add(household)
            context.session.commit()
            logging.info(json.dumps(household.to_dict(), default=str))
            return func.HttpResponse(json.dumps(household.to_dict(), default=str), mimetype="application/json")
        else:
            logging.info('updating household : %s', id)
            if not name:
                return func.HttpResponse("Invalid Household Name", status_code=400)
            try:
                id = uuid.UUID(idStr)
            except ValueError:
                return func.HttpResponse("Invalid House ID", status_code=400)

            household = context.session.query(Household).filter(Household.id == id).first()
            if household:
                household.name = name
                context.session.commit()
                logging.info(json.dumps(household.to_dict(), default=str))
                return func.HttpResponse(json.dumps(household.to_dict(), default=str), mimetype="application/json")
            else:
                return func.HttpResponse("Household not found", status_code=404)
