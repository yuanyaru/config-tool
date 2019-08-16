#!/usr/bin/python
# -*-coding: utf-8 -*-

import sqlite3


# 返回一个数据库连接
def db_con():
    conn = sqlite3.connect('DY.db')
    return conn
