#!/usr/bin/python
# -*-coding: utf-8 -*-

from flask import Flask, render_template, request
from db import db_con
import json
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)
app.debug = True
app.threaded = True
app.config['SECRET_KEY'] = 'secret!'


@app.route('/')
def index():
    station = find_station_data()
    return render_template('yx_data.html', station=station, stationLen=len(station))


def find_station_data():
    conn = db_con()
    cursor = conn.cursor()
    cursor.execute('select * from Link')
    station = cursor.fetchall()
    # 关闭cursor
    cursor.close()
    # 提交事务
    conn.commit()
    # 关闭数据库连接
    conn.close()
    return station


@app.route('/station_data', methods=['GET'])
def find_station_data_send():
    stationdata = find_station_data()
    sdata = []
    for i in range(len(stationdata)):
        sdata.append({"id": stationdata[i][0], "NAME": stationdata[i][1], "DESCRIBE": stationdata[i][2],
                        "RULEID": stationdata[i][3], "ADDRESS": stationdata[i][4], "PORT": stationdata[i][5],
                        "ROLE": stationdata[i][6]})
    return json.dumps(sdata)


@app.route('/insert_station', methods=['POST'])
def insert_station_data():
    newstation = request.form.get("data")
    new_station = json.loads(newstation)

    conn = db_con()
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE in zip(json.loads(new_station[0]),
                                                               json.loads(new_station[1]),
                                                               json.loads(new_station[2]),
                                                               json.loads(new_station[3]),
                                                               json.loads(new_station[4]),
                                                               json.loads(new_station[5]),
                                                               json.loads(new_station[6])):
        cursor.execute(
            'INSERT INTO Link (ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE )'
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            (ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE)
        )
    cursor.close()
    conn.commit()
    conn.close()
    return '添加成功!'


@app.route('/update_station', methods=['POST'])
def update_station_data():
    updatestation = request.form.get("data")
    update_station = json.loads(updatestation)

    conn = db_con()
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE in zip(json.loads(update_station[0]),
                                                               json.loads(update_station[1]),
                                                               json.loads(update_station[2]),
                                                               json.loads(update_station[3]),
                                                               json.loads(update_station[4]),
                                                               json.loads(update_station[5]),
                                                               json.loads(update_station[6])):
        cursor.execute('update Link set NAME=?,DESCRIBE=?,RULEID=?,ADDRESS=?,PORT=?,ROLE=?'
                       'where ID = ?',
                       (NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE, ID)
                       )
    cursor.close()
    conn.commit()
    conn.close()
    return '修改成功!';


@app.route('/delete_station', methods=['POST'])
def delete_station_data():
    stationIDs = request.form.get("ids")
    station_IDs = json.loads(stationIDs)

    conn = db_con()
    cursor = conn.cursor()
    for station_ID in station_IDs:
        cursor.execute('delete from Link where ID = ?', (station_ID,))
    cursor.close()
    conn.commit()
    conn.close()
    return '删除成功!'


def find_yx_data():
    conn = db_con()
    # 创建一个cursor 游标（用于执行SQL语句)
    cursor = conn.cursor()
    cursor.execute('select * from Digital1')
    yxdata = cursor.fetchall()
    # print(yxdata[0][1])
    # 关闭cursor
    cursor.close()
    # 提交事务
    conn.commit()
    # 关闭数据库连接
    conn.close()
    return yxdata


@app.route('/yx_data', methods=['GET'])
def find_yx_data_send():
    # print(str(info).decode('string_escape'))
    yxdata = find_yx_data()
    ydata = []
    for i in range(len(yxdata)):
        ydata.append({"id": yxdata[i][0], "NAME": yxdata[i][1], "DESCRIBE": yxdata[i][2], "ASDU": yxdata[i][3],
                        "WORD": yxdata[i][4], "BYTE": yxdata[i][5], "NUMBYTE": yxdata[i][6], "ADDRESS": yxdata[i][7]})
    return json.dumps(ydata)


@app.route('/insert_yx', methods=['POST'])
def insert_yx_data():
    newyx = request.form.get("data")
    new_yx = json.loads(newyx)
    # print(type(new_data))

    conn = db_con()
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS in zip(json.loads(new_yx[0]),
                                                                      json.loads(new_yx[1]),
                                                                      json.loads(new_yx[2]),
                                                                      json.loads(new_yx[3]),
                                                                      json.loads(new_yx[4]),
                                                                      json.loads(new_yx[5]),
                                                                      json.loads(new_yx[6]),
                                                                      json.loads(new_yx[7])):
        cursor.execute(
            'INSERT INTO Digital1 (ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS )'
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS)
        )
    cursor.close()
    conn.commit()
    conn.close()
    return '添加成功!'


@app.route('/update_yx', methods=['POST'])
def update_yx_data():
    updateyx = request.form.get("data")
    update_yx = json.loads(updateyx)

    conn = db_con()
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS in zip(json.loads(update_yx[0]),
                                                                      json.loads(update_yx[1]),
                                                                      json.loads(update_yx[2]),
                                                                      json.loads(update_yx[3]),
                                                                      json.loads(update_yx[4]),
                                                                      json.loads(update_yx[5]),
                                                                      json.loads(update_yx[6]),
                                                                      json.loads(update_yx[7])):
        cursor.execute('update Digital1 set NAME=?,DESCRIBE=?,ASDU=?,WORD=?,BYTE=?,NUMBYTE=?,ADDRESS=? '
                       'where ID = ?',
                       (NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS, ID)
                       )
    cursor.close()
    conn.commit()
    conn.close()
    return '修改成功!';


@app.route('/delete_yx', methods=['POST'])
def delete_yx_data():
    yxIDs = request.form.get("ids")
    yx_IDs = json.loads(yxIDs)

    conn = db_con()
    cursor = conn.cursor()
    for yx_ID in yx_IDs:
        cursor.execute('delete from Digital1 where ID = ?', (yx_ID,))
    cursor.close()
    conn.commit()
    conn.close()
    return '删除成功!'


if __name__ == '__main__':
    app.run()

