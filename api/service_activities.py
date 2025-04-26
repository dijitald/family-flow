import uuid
import azure.functions as func
import json
from service_models import Activity
from function_app_context import context

bpActivities = func.Blueprint()

@bpActivities.route(route="activities", methods=['GET', 'POST', 'PUT', 'DELETE'])
def activity_service(req: func.HttpRequest) -> func.HttpResponse:
    context.logging.info('activity_service called [%s]', req.method)

    if req.method == 'GET' or req.method == 'DELETE':
        try:
            hid = req.params.get('hid')
            uid = req.params.get('uid')
            id = req.params.get('id')
            if hid:
                hid = uuid.UUID(hid)
                if not hid:
                    raise ValueError()
            else:
                raise ValueError()
        except ValueError:
            return func.HttpResponse("Invalid House or User ID", status_code=400)
    elif req.method == 'POST' or req.method == 'PUT':
        try:
            activity_data = req.get_json()
            context.logging.info('activity data [%s]', activity_data)
            activity = Activity(**activity_data)
        except Exception as ex:
            context.logging.info('task update error [%s]', ex)
            return func.HttpResponse(f"Error: {str(ex)}", status_code=400)
        # else:
        #     hid = activity_data.get('householdid')
        #     date = activity_data.get('date')
        #     user = activity_data.get('user')
        #     uid = activity_data.get('userid')
        #     amount = activity_data.get('amount')
        #     type = activity_data.get('type')
        #     description = activity_data.get('description')
        #     tags = activity_data.get('tags')
        #     id = activity_data.get('id')
        context.logging.info('activity_data : %s', activity_data)
    
    if req.method == 'GET' :
        if hid :
            return get_activities(hid, Activity.householdid)
        elif uid:
            return get_activities(uid, Activity.userid)
        else:
            return func.HttpResponse("Missing Household ID or User ID", status_code=400)
    elif req.method == 'DELETE':
        return delete_activity(id)
    elif req.method == 'POST':
        return add_activity(activity)
    elif req.method == 'PUT':
        return update_activity(activity)
    else:
        return func.HttpResponse("Method Not Allowed", status_code=405)

def get_activities(id: str, field : any) -> func.HttpResponse:
    context.logging.info('getting household activities [%s]', id)
    activities = context.session.query(Activity).filter(field == id).all()
    if activities:
        return func.HttpResponse(json.dumps(activities.to_dict(), default=str), mimetype="application/json")
    return func.HttpResponse("Activities not found", status_code=404)

# def get_user_activities(id: str) -> func.HttpResponse:
#     context.logging.info('getting household activities [%s]', id)
#     activities = context.session.query(Activity).filter(Activity.userId == id).all()
#     if activities:
#         return func.HttpResponse(json.dumps(activities.to_dict(), default=str), mimetype="application/json")
#     return func.HttpResponse("Activities not found", status_code=404)

def delete_activity(id: str) -> func.HttpResponse:
    context.logging.info('deleting activity [%s]', id)
    activity = context.session.query(Activity).filter(Activity.id == id).first()
    if activity:
        context.session.delete(activity)
        context.session.commit()
        return func.HttpResponse("ok", status_code=200)
    else:
        return func.HttpResponse("Activity not found", status_code=404)

def add_activity(activity: Activity) -> func.HttpResponse:
    if not activity or not activity.date or not activity.amount or not activity.type or not activity.description:
        return func.HttpResponse("Activity Missing", status_code=400)
    activity.id = None
    context.logging.info('adding activity [%s]', activity.description)
    context.session.add(activity)
    context.session.commit()
    return func.HttpResponse(json.dumps(activity.to_dict(), default=str), mimetype="application/json")

def update_activity(newactivity : Activity) -> func.HttpResponse:
    if not newactivity or not newactivity.date or not newactivity.amount or not newactivity.type or not newactivity.description:
        return func.HttpResponse("Activity Missing", status_code=400)
    context.logging.info('updating activity [%s]', newactivity.id)

    activity = context.session.query(Activity).filter(Activity.id == newactivity.id).first()
    if not activity:
        return func.HttpResponse("Activity not found", status_code=404)
    else:
        activity.date = newactivity.date
        activity.user = newactivity.user
        activity.userid = newactivity.userid
        activity.amount = newactivity.amount
        activity.type = newactivity.type
        activity.description = newactivity.description
        activity.tags = newactivity.tags

        context.session.commit()
        context.logging.info(json.dumps(activity.to_dict(), default=str))
        return func.HttpResponse(json.dumps(activity.to_dict(), default=str), mimetype="application/json")
