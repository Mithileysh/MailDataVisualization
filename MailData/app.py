from flask import Flask, flash, redirect, render_template, request, session, abort, send_file, send_from_directory
from datetime import datetime
import time
import json
from collections import namedtuple
import sys
import re


app = Flask(__name__)



# URL routing
## root directory:  /
## clear chache
@app.after_request
def add_header(r):
    """
    Add headers to both force latest IE rendering engine or Chrome Frame,
    and also to cache the rendered page for 10 minutes.
    """
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r


## render webpages

#reander the ui and the tab pages
# @app.route("/")
# def index():
#     print("Show the main interface")
#     return render_template(
#         'ui/index.html')  

@app.route("/")
def index():
    print("Show the main interface")
    return render_template(
        'vis_index.html')  


## route images and data
@app.route("/images/<path:path>")
def send_images(path):
    return send_from_directory('Images', path)

@app.route("/real/<path:path>")
def send_json(path):
    return send_from_directory('Real', path)



# app starts from here
if __name__ == "__main__":
    # record tool log for tracking the system
    
    app.run(host='0.0.0.0', port=int(sys.argv[1]))
