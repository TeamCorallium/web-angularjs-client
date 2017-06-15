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
table_proposal = db.table('table_proposal')
table_notification = db.table('table_notification')
table_chat = db.table('table_chat')
table_invertion = db.table('table_invertion')
table_comment = db.table('table_comment')
table_vote = db.table('table_vote')
table_activity = db.table('table_actitity')

# table_user.purge()
# table_profile.purge()
# table_simple_project.purge()
# table_complex_project.purge()
# table_risk.purge()
# table_reference.purge()
# table_task.purge()
# table_invertion.purge()
# table_proposal.purge()
# table_notification.purge()
# table_comment.purge()
# table_vote.purge()
# table_chat.purge()