from flask import Flask, render_template, g, jsonify
import sqlite3
import os

app = Flask(__name__)

APP_DIR = os.path.dirname(__file__)
DATABASE = os.path.join(APP_DIR, '../entries.db')


def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


@app.route("/")
def index_page():
    return render_template('index.html')


@app.route("/help")
def help_page():
    return render_template('help.html')


@app.route("/task")
def task():
    con = get_db()
    cur = con.cursor()
    cur.execute("SELECT * FROM entries ORDER BY RANDOM() LIMIT 1;")
    row = cur.fetchone()
    row_dict = dict(row)
    cur.close()
    return jsonify(**row_dict)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
