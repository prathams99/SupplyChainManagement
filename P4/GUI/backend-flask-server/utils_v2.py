import pyodbc
import json
from flask import Flask,request,jsonify

app = Flask(__name__)
TM_FORMAT = "%H:%M:%S"
DT_FORMAT = "%Y-%m-%d"
DT_TM_FORMAT = "%Y-%m-%d %H:%M:%S"
# CONN_STR = 'Driver={SQL Server Native Client 11.0};''Server=localhost;''PORT=1433;''Database=SupplyChainManagementFinalProject;''uid=sa;pwd=root'
server = 'MSI'
database = 'SupplyChainManagementFinalProject'
CONN_STR = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER='+server+';DATABASE='+database + ';Trusted_Connection=Yes'

@app.route('/select',methods=['POST','GET'])
def sample_return():
    conn = pyodbc.connect(
        CONN_STR)
    # body = request.json
    # print(body)
    # print(json.loads(body))
    # table_name = body.get('table_name').lower()
    table_name = request.args.get("table_name")
    cursor = conn.cursor().execute('SELECT * FROM {}'.format(table_name))
    columns = [column[0] for column in cursor.description]
    results = []
    for row in cursor.fetchall():
        results.append(dict(zip(columns, row)))

    if table_name == 'outages':
        for each in results:
            st_dt = each['Start_Time'].strftime(TM_FORMAT)
            end_dt = each['End_Time'].strftime(TM_FORMAT)

            each['Start_Time'] = st_dt
            each['End_Time'] = end_dt
    elif table_name == 'customer':
        for each in results:
            dob = each['DateOfBirth'].strftime(DT_FORMAT)
            each['DateOfBirth'] = dob
    elif table_name == 'account':
        for each in results:
            dob = each['Start_Date'].strftime(DT_FORMAT)
            each['Start_Date'] = dob
    elif table_name == 'crew':
        for each in results:
            dob = each['Date_Of_Joining'].strftime(DT_FORMAT)
            each['Date_Of_Joining'] = dob
    elif table_name == 'weather_events':
        for each in results:
            st_dt = each['Start_DateTime'].strftime(DT_TM_FORMAT)
            end_dt = each['End_DateTime'].strftime(DT_TM_FORMAT)

            each['Start_DateTime'] = st_dt
            each['End_DateTime'] = end_dt
    elif table_name == 'equipment_installation':
        for each in results:
            st_dt = each['installation_datetime'].strftime(DT_TM_FORMAT)
            end_dt = each['next_mainteneace_date'].strftime(DT_TM_FORMAT)

            each['installation_datetime'] = st_dt
            each['next_mainteneace_date'] = end_dt
    elif table_name == 'equipment_repairs':
        for each in results:
            st_dt = each['repair_datetime'].strftime(DT_TM_FORMAT)
            each['repair_datetime'] = st_dt
    elif table_name == 'crew_assignments':
        for each in results:
            st_dt = each['AssignedDateTime'].strftime(DT_TM_FORMAT)
            each['AssignedDateTime'] = st_dt
    elif table_name == 'meter_reading':
        for each in results:
            st_dt = each['Meter_Reading_DateTime'].strftime(DT_TM_FORMAT)
            end_dt = each['From_Date'].strftime(DT_FORMAT)
            end_dt_1 = each['To_Date'].strftime(DT_FORMAT)

            each['Meter_Reading_DateTime'] = st_dt
            each['From_Date'] = end_dt
            each['To_Date'] = end_dt_1
    elif table_name == 'bill':
        for each in results:
            end_dt = each['Bill_Date'].strftime(DT_FORMAT)
            end_dt_1 = each['Due_Date'].strftime(DT_FORMAT)

            each['Bill_Date'] = end_dt
            each['Due_Date'] = end_dt_1

    elif table_name == 'payment':
        for each in results:
            end_dt = each['Payment_Date'].strftime(DT_FORMAT)

            each['Bill_Date'] = end_dt

    response = jsonify(results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/crud',methods=['GET','POST'])
def sample_query():
    resp = {}
    conn = pyodbc.connect(
        CONN_STR)
    # body = request.json
    # query = body.get('query',None)
    query = request.args.get("query")
    queryStringArray = query.split("+")
    queryString = " ".join(queryStringArray)
    query = queryString
    print(query)
    if query is None or len(query) == 0:
        resp['code'] = 400
        resp["message"] = "Pass a valid query"
        resp = jsonify(resp)
        resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    try:
        cursor = conn.cursor().execute(query)
        print(cursor)
        conn.commit()
        resp['code'] = 200
        resp["message"] = "Executed the query successfully"
    except Exception as e:
        resp['code'] = 400
        resp["message"] = "Error while executing the query : {}".format(str(e))
    resp = jsonify(resp)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.headers.add('Access-Control-Allow-Credentials', 'true')
    return resp
if __name__ == '__main__':
    app.run(port=5000)
