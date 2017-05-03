from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import json
from tinydb import TinyDB, Query, where

db = TinyDB('db.json')

db.purge();

table_user = db.table('table_user')
table_profile = db.table('table_profile')
table_simple_project = db.table('table_simple_project')
table_complex_project = db.table('table_complex_project')
table_risk = db.table('table_risk')
table_reference = db.table('table_reference')
table_task = db.table('table_task')

# texts.purge()
# texts.insert({'id':'10', 'value':'Breathe New Life Into Your Home’s Furniture'})
# texts.insert({'id':'11', 'value':'Get Your Furniture Refurbished To Perfection'})

# db.purge()
# gallery1.purge()
# gallery1.insert({'image':'assets/images/1.jpg', 'name':'Cat on Fence'})
# gallery1.insert({'image':'assets/images/2.jpg', 'name':'Cat in Sun'})
# gallery1.insert({'image':'assets/images/3.jpg', 'name':'Blue Eyed Cat'})
# gallery1.insert({'image':'assets/images/4.jpg', 'name':'Patchy Cat'})
# gallery1.insert({'image':'assets/images/5.jpg', 'name':'Feral Cats'})
# gallery1.insert({'image':'assets/images/1.jpg', 'name':'Cat on Fence'}) 
        
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
        print('El id:'+id)

    

class UserHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options')
        self.set_status(204)
        self.finish()

    def get(self):
        print('get')

    def post(self):
        print("post.......!!!")

        # u = user.get(eid=7)
        # print(json.dumps(u))

        self.json_args = json.loads(self.request.body)
        # print(self.json_args['user'])
        # print(self.json_args['password'])

        id = user.insert(self.json_args);
        self.write(str(id))
        print(id)

application = tornado.web.Application([
    (r"/ravic/text/([0-9]+)", GetTextHandler),
    (r"/ravic/?", VersionHandler),
    (r"/CoralliumRestAPI/user/?", UserHandler)
])

if __name__ == "__main__":
    print('Ravic server---host:localhost---port:9090')
    application.listen(9090)
    tornado.ioloop.IOLoop.instance().start()