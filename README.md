# socket-video-chat

Socket events(keys) and data parameter:

Key: params:

"connected": on connection will get message "Hello and Welcome to the Server" 

 "join": join main screen for all users with params: "name" 
 "join": get all active users list 

  "subscribe": create room with params: "room" & "socketId"
  "new user": get new connected user only in room connect showing

  "unsubscribe": leave room with params: "room" & "socketId"
  "leave user": get who leave the room

  "newUserStart": post new user stream "params": "to" & "sender"
  "newUserStart": get who start stream


   "sdp": post sdp (Session Description protocol (SDP) [RFC4566] is used for negotiating session capabilities between the peers.
          Such a negotiataion happens based on the SDP Offer/Answer exchange mechanism described in the RFC 3264 [RFC3264].)
          "params": "to" "description" & "sender"
   
   "sdp": get sdp


    "ice candidates": post ice candidates "params": "to" "candidate" & "sender" 
    "ice candidates": get ice candidates

   "chat": send and receive chat messages  "params": "room" "sender" & "msg"

   "disconnect": auto hit when user socket disconnect
    "user-disconnected": after user disconnect we can access new active users on it
