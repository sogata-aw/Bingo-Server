from flask import Flask, render_template, request, json
from flask_socketio import SocketIO, emit

from utilitaire import *

# def init_sockets(socketio):