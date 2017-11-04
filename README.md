## Requirements

Node.js 8.9.0 LTS

## How to start

* git clone https://github.com/daserthkm/hackathon
* npm install
* npm run start
* open http://localhost:5000

## API Reference

* To access the endpoints you need to set the header attribute "Content-Type" to "application/json".
* The responses are jsend formated.
* Success: 
  * { status: 'success', data: (object|null) }
* Error: 
  * { status: 'error', message: 'short error message' }


| HTTP METHOD            | POST                 | GET                             | PUT               | DELETE                |
| ---------------------- | -------------------- | ------------------------------- | ----------------- | --------------------- |
| CRUD OP                | CREATE               | READ                            | UPDATE            | DELETE                |
| /chats/1234            | Send message to room | List all messages from room     |                   | Clear room            |
| /messages/1234/like    | Like message         | Get message likes               |                   | Revoke like           |
| /rooms                 | Create new room      | List all rooms                  |                   |                       |
| /rooms/1234            |                      | Get room properties             | Edit room         | Delete room           |
| /rooms/1234/users      | Join user            | Get room members                |                   | Remove user           |
| /users                 | Create new user      | List all users                  |                   |                       |
| /users/1234            |                      | Get user properties             | Edit user         | Delete user           |
| /random/meme           |                      | Get random meme and picture     |                   |                       |
| /random/chuck          |                      | Get random chuck norris joke    |                   |                       |

## Payloads

* Chat: 
  * { "user_id": 1234, "room_id": 1234, "message": "Hello World" }
  
* Room: 
  * { "name": "Test room" }

* User: 
  * { "name": "Daniel" }

* Message Like: 
  * { "user_id": 1234 }

## Socket

Events:
* chats.cleared - All messages from room removed
  * Payload: { room_id }
* chats.new_message - New message received
  * Payload: { user_id, room_id, message_id, create_date, millisecond }
* messages.liked - Message was liked by one user
  * Payload: { user_id, message_id, create_date }
* messages.like_revoked - Message like was revoked
  * Payload: { user_id, message_id, create_date }
* rooms.created - New room created
  * Payload: { id, name, create_date }
* rooms.changed - Room properties changed
  * Payload: { id, name, create_date }
* rooms.deleted - Room deleted
  * Payload: { id, name, create_date }
* rooms.user_joined - User joined a room
  * Payload: { user_id, room_id, create_date }
* rooms.user_left - User left a room
  * Payload: { user_id, room_id, create_date }
