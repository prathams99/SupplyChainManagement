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
    queryStringArray = query.split("%20")
    queryString = " ".join(queryStringArray)
    # query = queryString
    print(queryString)
    if queryString is None or len(query) == 0:
        resp['code'] = 400
        resp["message"] = "Pass a valid query"
        # resp = jsonify(resp)
        # resp.headers.add('Access-Control-Allow-Origin', '*')
        return resp
    try:
        print("check0")
        cursor = conn.cursor().execute(queryString)
        # print(cursor)
        conn.commit()
        resp['code'] = 200
        resp["message"] = "Executed the query successfully"
        print("check1 " + resp["message"])
    except Exception as e:
        print("check2")
        resp['code'] = 400
        resp["message"] = "Error while executing the query : {}".format(str(e))
    resp = jsonify(resp)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    print(resp)
    # resp.headers.add('Access-Control-Allow-Credentials', 'true')
    return resp

@app.route('/insert', methods=['GET', 'POST'])
def sql_insert():
    resp = {}
    conn = pyodbc.connect(
        CONN_STR)
    # body = request.json
    table_name = request.args.get('table_name')
    # vals = body.get('values', None)
    if table_name is None:
        resp['code'] = 400
        resp["message"] = "Pass a valid table name"
        return resp
    if table_name.lower() == 'customer':
        query_str = "INSERT INTO customer VALUES ('{0}','{1}',{2},'{3}',{4},{5},'{6}',{7},'{8}','{9}','{10}','{11}')".format(
            request.args.get('CustID'), request.args.get('Name'), request.args.get('Contact'), request.args.get('Email'), request.args.get('isActive'), request.args.get('Age'),
            request.args.get('DateOfBirth'), request.args.get('SSN'), request.args.get('State'), request.args.get('City'), request.args.get('Address'), request.args.get('ZipCode'))
    elif table_name.lower() == 'account':
        print("hello")
        # query_str = "INSERT INTO account VALUES ('{0}','{1}','{2}','{3}',{4},{5},{6})".format(vals['AccountID'],
        #                                                                                       vals['CustID'],
        #                                                                                       vals['Account_Type'],
        #                                                                                       vals['Start_Date'],                                                                                             vals['No_of_Consumers'],
        #                                                                                       vals['IsActive'],
        #                                                                                       vals['IsSubsidized'])
    try:
        print(query_str)
        cursor = conn.cursor().execute(query_str)
        conn.commit()
        resp['code'] = 200
        resp["message"] = "Executed the query successfully"
    except Exception as e:
        resp['code'] = 400
        resp["message"] = "Error while executing the query : {}".format(str(e))
    resp = jsonify(resp)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/update', methods=['GET', 'POST'])
def sql_update():
    resp = {}
    conn = pyodbc.connect(
        CONN_STR)
    # body = request.json
    table_name = request.args.get('table_name')
    # vals = body.get('values', None)
    if table_name is None:
        resp['code'] = 400
        resp["message"] = "Pass a valid table name"
        return resp
    if table_name.lower() == 'customer':
        update_str = "UPDATE {0} SET Name='{2}',Contact={3},Email='{4}',isActive={5},Age={6},DateOfBirth='{7}',SSN={8},State='{7}',City='{8}',Address='{9}',ZipCode='{10}' where CustID='{1}'".format(
            table_name, request.args.get('CustID'), request.args.get('Name'), request.args.get('Contact'), request.args.get('Email'), request.args.get('isActive'), request.args.get('Age'),
            request.args.get('DateOfBirth'), request.args.get('SSN'), request.args.get('State'), request.args.get('City'), request.args.get('Address'), request.args.get('ZipCode'))

    try:
        cursor = conn.cursor().execute(update_str)
        conn.commit()
        resp['code'] = 200
        resp["message"] = "Executed the query successfully"
    except Exception as e:
        resp['code'] = 400
        resp["message"] = "Error while executing the query : {}".format(str(e))
    resp = jsonify(resp)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

@app.route('/delete', methods=['GET', 'POST'])
def sql_delete():
    resp = {}
    conn = pyodbc.connect(
        CONN_STR)
    table_name = request.args.get('table_name')
    key = request.args.get('key')
    val = request.args.get('value')
    if table_name is None or key is None or val is None:
        resp['code'] = 400
        resp["message"] = "Pass valid keys and values"
        return resp
    if table_name.lower() == 'customer':
       delete_str = "delete from {0} where {1}='{2}'".format(table_name,key,val)
    try:
        cursor = conn.cursor().execute(delete_str)
        conn.commit()
        resp['code'] = 200
        resp["message"] = "Executed the query successfully"
    except Exception as e:
        resp['code'] = 400
        resp["message"] = "Error while executing the query : {}".format(str(e))
    resp = jsonify(resp)
    resp.headers.add('Access-Control-Allow-Origin', '*')
    return resp

if __name__ == '__main__':
    app.run(port=5000)
