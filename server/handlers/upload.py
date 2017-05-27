from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.httputil
import tornado.websocket
import json
import logging
import uuid
import os

from databases.coralliumTiny import *
from localutils.client import * 

class UploadHandler(tornado.web.RequestHandler):
    def set_default_headers(self):
        print("setting headers!!!")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding")
        self.set_header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT")
    
    def options(self):
        print('options!!!')
        self.set_status(204)
        self.finish()

    def get(self, userId):
        print('UploadHandler:GET!!!' + userId)
        # user = '';

        # try: 
        #     int(email)
        #     user = table_user.search(where('id') == int(email))
        # except ValueError:
        #     user = table_user.search(where('email') == email)

        # self.write(json.dumps(user))
        # print(user)

    def post(self):
        print("UploadHandler:POST!!!")

        fileinfo = self.request.files['file'][0]
        original_fname = fileinfo['filename']
        extension = os.path.splitext(original_fname)[1]
        
        filename = str(uuid.uuid4())

        print(original_fname)
        print(filename)

        name = filename + extension
        try:
            with open(os.path.join('databases/uploads', name), 'wb') as fh:
                fh.write(fileinfo['body'])
            logging.info("%s uploaded %s, saved as %s",
                         str(self.request.remote_ip),
                         str(fileinfo['filename']),
                         filename)
        except IOError as e:
            logging.error("Failed to write file due to IOError %s", str(e))

        self.write(name)

    def put(self):
        print("UploadHandler:PUT!!!")

        # self.json_args = json.loads(self.request.body)

        # print(self.json_args)

        # table_user.update({'projectsFollow': self.json_args['projectsFollow']}, eids=[self.json_args['id']])

        # users = table_user.search(where('id') == self.json_args['id'])
        # print(users[0]['projectsFollow'][0])

        # print(len(table_user.search(where('email') == self.json_args['email'])))

        # if len(table_user.search(where('email') == self.json_args['email'])) != 0:
        #     self.write('-1')
        # else:
        #     id = table_user.insert(self.json_args)
        #     table_user.update({'id': id}, eids=[id])
        #     self.write(str(id))
        #     print(id)            