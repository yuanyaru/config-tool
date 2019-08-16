#!/usr/bin/python
# -*-coding: utf-8 -*-

from flask import Flask, render_template
from db import db_con
from flask_socketio import SocketIO
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)
app.debug = True
app.threaded = True
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


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


@socketio.on('find_event', namespace='/station_data')
def find_station_data_send(info):
    print(str(info).decode('string_escape'))
    stationdata = find_station_data()
    sdata = []
    for i in range(len(stationdata)):
        sdata.append({'ID': stationdata[i][0], 'NAME': stationdata[i][1], 'DESCRIBE': stationdata[i][2],
                        'RULEID': stationdata[i][3], 'ADDRESS': stationdata[i][4], 'PORT': stationdata[i][5],
                        'ROLE': stationdata[i][6]})
    socketio.emit('find_response', sdata, namespace='/station_data')


@socketio.on('insert_event', namespace='/new_station_data')
def insert_station_data(new_data):
    nameLen = len(new_data[1])
    # print(nameLen)
    names = []
    for i in range(nameLen):
        name = (new_data[1][i]).encode('unicode_escape').decode('string_escape')
        names.append(name)
    # print(names)

    conn = db_con()
    conn.text_factory = str
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE in zip(new_data[0], names, new_data[2], new_data[3],
                    new_data[4], new_data[5], new_data[6]):
        cursor.execute(
            'INSERT INTO Link (ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE )'
            'VALUES (?, ?, ?, ?, ?, ?, ?)',
            (ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE)
        )
    cursor.close()
    conn.commit()
    conn.close()
    socketio.emit('insert_response', '添加成功!', namespace='/new_station_data')


@socketio.on('update_event', namespace='/update_station_data')
def update_station_data(update_data):
    # print("%s: %s" % (type(update_data), update_data))
    nameLen = len(update_data[1])
    # print(nameLen)
    names = []
    for i in range(nameLen):
        name = (update_data[1][i]).encode('unicode_escape').decode('string_escape')
        names.append(name)
    # print(names)

    conn = db_con()
    conn.text_factory = str
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE in zip(update_data[0], names, update_data[2], update_data[3],
                              update_data[4], update_data[5], update_data[6]):
        cursor.execute('update Link set NAME=?,DESCRIBE=?,RULEID=?,ADDRESS=?,PORT=?,ROLE=?'
                       'where ID = ?',
                       (NAME, DESCRIBE, RULEID, ADDRESS, PORT, ROLE, ID)
                       )
    cursor.close()
    conn.commit()
    conn.close()
    socketio.emit('update_response', '修改成功!', namespace='/update_station_data')


@socketio.on('delete_event', namespace='/delete_station_data')
def delete_station_data(station_IDs):
    # print("%s: %s" % (type(station_IDs), str(station_IDs)))
    conn = db_con()
    cursor = conn.cursor()
    for station_ID in station_IDs:
        cursor.execute('delete from Link where ID = ?', (station_ID,))
    cursor.close()
    conn.commit()
    conn.close()
    socketio.emit('delete_response', '删除成功!', namespace='/delete_station_data')


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


@socketio.on('find_event', namespace='/yx_data')
def find_yx_data_send(info):
    print(str(info).decode('string_escape'))
    yxdata = find_yx_data()
    data = []
    for i in range(len(yxdata)):
        data.append({'ID': yxdata[i][0], 'NAME': yxdata[i][1], 'DESCRIBE': yxdata[i][2], 'ASDU': yxdata[i][3],
                        'WORD': yxdata[i][4], 'BYTE': yxdata[i][5], 'NUMBYTE': yxdata[i][6], 'ADDRESS': yxdata[i][7]})
    socketio.emit('find_response', data, namespace='/yx_data')


@socketio.on('insert_event', namespace='/new_yx_data')
def insert_yx_data(new_data):
    # 中文乱码问题调试
    # print("%s: %s" % (type(new_data), new_data))
    # print("%s: %s" % (type(new_data[1]), new_data[1]))
    # print((new_data[1]).encode('unicode_escape').decode('string_escape'))
    # data = str(new_data).decode('string_escape')
    # print("%s: %s" % (data, data[9:15]))
    nameLen = len(new_data[1])
    print(nameLen)
    names = []
    for i in range(nameLen):
        name = (new_data[1][i]).encode('unicode_escape').decode('string_escape')
        names.append(name)
    # print(names)

    conn = db_con()
    conn.text_factory = str
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS in zip(new_data[0], names, new_data[2], new_data[3],
                    new_data[4], new_data[5], new_data[6], new_data[7]):
        cursor.execute(
            'INSERT INTO Digital1 (ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS )'
            'VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            (ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS)
        )
    cursor.close()
    conn.commit()
    conn.close()
    socketio.emit('insert_response', '添加成功!', namespace='/new_yx_data')


@socketio.on('update_event', namespace='/update_yx_data')
def update_yx_data(update_data):
    # print("%s: %s" % (type(update_data), update_data))
    nameLen = len(update_data[1])
    # print(nameLen)
    names = []
    for i in range(nameLen):
        name = (update_data[1][i]).encode('unicode_escape').decode('string_escape')
        names.append(name)
    # print(names)

    conn = db_con()
    conn.text_factory = str
    cursor = conn.cursor()
    for ID, NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS in zip(update_data[0], names, update_data[2], update_data[3],
                              update_data[4], update_data[5], update_data[6],update_data[7]):
        cursor.execute('update Digital1 set NAME=?,DESCRIBE=?,ASDU=?,WORD=?,BYTE=?,NUMBYTE=?,ADDRESS=? '
                       'where ID = ?',
                       (NAME, DESCRIBE, ASDU, WORD, BYTE, NUMBYTE, ADDRESS, ID)
                       )
    cursor.close()
    conn.commit()
    conn.close()
    socketio.emit('update_response', '修改成功!', namespace='/update_yx_data')


@socketio.on('delete_event', namespace='/delete_yx_data')
def delete_yx_data(yx_IDs):
    print("%s: %s" % (type(yx_IDs), str(yx_IDs)))
    conn = db_con()
    cursor = conn.cursor()
    for yx_ID in yx_IDs:
        cursor.execute('delete from Digital1 where ID = ?', (yx_ID,))
    cursor.close()
    conn.commit()
    conn.close()
    socketio.emit('delete_response', '删除成功!', namespace='/delete_yx_data')


if __name__ == '__main__':
    # app.run()
    socketio.run(app)
    # while True:
    #     time.sleep(10)

