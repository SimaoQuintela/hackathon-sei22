from flask import Flask
from flask import request

app = Flask(__name__)

@app.route('/', methods=['GET'])
def welcome():
    data = request.get_data()
    '''
    Insert code that references other modules
    '''
    return request.data

if __name__ == '__main__':
    app.run(host='localhost', port=8000)