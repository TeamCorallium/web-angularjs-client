from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.httputil
import json
from tinydb import TinyDB, Query, where

db = TinyDB('db.json')

# db.purge();

table_user = db.table('table_user')
table_profile = db.table('table_profile')
table_simple_project = db.table('table_simple_project')
table_complex_project = db.table('table_complex_project')
table_risk = db.table('table_risk')
table_reference = db.table('table_reference')
table_task = db.table('table_task')
        
class VersionHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        
    def get(self):
        response = { 'version': '3.5.1',
                     'last_build':  date.today().isoformat() }
        self.write(json.dumps(gallery1.all()))
#        gallery1.all()
        print(json.dumps(gallery1.all()))

class GetTextHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "x-requested-with")
        self.set_header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
        
    def get(self, id):
        text = texts.search(where('id') == id)
        self.write(json.dumps(text))
        print('El id:'+ id)

class UserHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, email):
        print('get!!!' + email)

        user = table_user.search(where('email') == email)
        self.write(json.dumps(user))

        print(user)

    def post(self):
        print("post!!!")

        self.json_args = json.loads(self.request.body)

        print(self.json_args['email'])
        print(self.json_args['fullName'])
        print(self.json_args['password'])
        print(self.json_args['gender'])

        print(len(table_user.search(where('email') == self.json_args['email'])))

        if len(table_user.search(where('email') == self.json_args['email'])) != 0:
            self.write('-1')
        else:
            id = table_user.insert(self.json_args)
            table_user.update({'id': id}, eids=[id])
            self.write(str(id))
            print(id)

application = tornado.web.Application([
    (r"/ravic/text/([0-9]+)", GetTextHandler),
    (r"/ravic/?", VersionHandler),
    (r"/CoralliumRestAPI/user/?", UserHandler),
    (r"/CoralliumRestAPI/user/(.*)", UserHandler)
])

if __name__ == "__main__":
    print('Ravic server---host:localhost---port:9090')
    application.listen(9090)
    tornado.ioloop.IOLoop.instance().start()