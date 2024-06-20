package app.rbac

# Import necessary data utilities if needed
# import data.utils

# By default, deny requests
default allow = false

# Allow admins to do anything
allow {
    user_is_admin
}

# Allow access if the user is the owner of the note
# a memebr can view and create notes and update and delete only if he is owner of the note
allow {
    some i, j
    user := data.users[i]
    note := data.notes[j]
    user.id == input.user
    note.id == input.note
    user.id == note.ownerId
}

# user_is_admin is true if the user has an 'admin' role
# admin can do anything
user_is_admin {
    some i
    data.users[i].id == input.user
    data.users[i].role == "admin"
}