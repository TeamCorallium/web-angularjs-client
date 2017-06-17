from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import tornado.httpserver
import tornado.httputil
import tornado.websocket
import json
import logging

from databases.coralliumTiny import *
from localutils.client import * 

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
        print('User:GET!!!' + email)

        user = '';

        try: 
            int(email)
            user = table_user.search(where('id') == int(email))
        except ValueError:
            user = table_user.search(where('email') == email)

        self.write(json.dumps(user))
        print(user)

    def post(self):
        print("User:POST!!!")

        self.json_args = json.loads(self.request.body)

        print(self.json_args['email'])
        print(self.json_args['fullName'])
        print(self.json_args['password'])
        print(self.json_args['gender'])

        users = table_user.search(where('email') == self.json_args['email'])
        print(users)

        if len(users) != 0:
            self.write('-1')
        else:
            id = table_user.insert(self.json_args)
            table_user.update({'id': id}, eids=[id])
            self.write(str(id))
            print(id)

    def put(self):
        print("User:PUT!!!")

        user = json.loads(self.request.body)

        print(user)

        table_user.update({'projectsFollow': user['projectsFollow'], 'fullName': user['fullName'],
                            'email': user['email'], 'avatar': user['avatar'], 
                            'phone': user['phone'], 'zipCode': user['zipCode'],
                            'gender': user['gender'], 'city': user['city'], 
                            'twitter': user['twitter'], 'github': user['github'], 
                            'facebook': user['facebook'], 'linkedin': user['linkedin'],
                            'google': user['google'], 'skype': user['skype'],
                            'birthday': user['birthday'], 'identityCard': user['identityCard']},
                             eids=[user['id']])    

class AllUsersExceptIdHandler(tornado.web.RequestHandler):
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
        print('AllUsersExceptIdHandler:GET!!!')

        print('userId: ' + userId)

        users = []
        if userId != 'null':
            users = table_user.search((where('id') != userId) & (where('id') != int(userId)))
        else:
            users = table_user.all()

        self.write(json.dumps(users))

        print(users)

class ConnectedUserHandler(tornado.web.RequestHandler):
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
        print('ConnectedUser:GET!!!' + userId)

        users = []
        for client in clients:
            print(client.id)

            if int(client.id) != int(userId):
                user = table_user.get(eid=int(client.id))
                users.append(user)

        self.write(json.dumps(users))
