const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');

const app = express();

admin.initializeApp(functions.config().firebase);

const authenticate = (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  admin.auth().verifyIdToken(idToken).then(decodedIdToken => {
    req.user = decodedIdToken;
    next();
  }).catch(error => {
    res.status(403).send('Unauthorized');
  });
}

app.use(authenticate);

//post a message to a users' messages
app.post('/api/messages', (req, res) => {
  const message = req.body.message;
  return admin.database().ref(`/users/${req.user.uid}/messages`)
          .push({ message })
          .then(snapshot => {
            return snapshot.ref.once('value')
          }).then(snapshot => {
            const val = snapshot.val();
            res.status(201).json({message: val.message})
          }).catch(error => {
            console.log('Error putting message', error.message)
            res.sendStatus(500);
          })
})

//get all messages from users' messages
app.get('/api/messages', (req, res) => {
  let query = admin.database().ref(`/users/${req.user.uid}/messages`);
  query.once('value').then(snapshot => {
    let messages = [];
    snapshot.forEach(childSnapshot => {
      messages.push({key: childSnapshot.key, message: childSnapshot.val().message})
      return res.status(200).json(messages);
    })
  }).catch(error => {
    console.log('error getting messages', error.message)
    res.sendStatus(500);
  })
})

//get specific message
app.get('/api/messages/:messageId', (req, res) =>{
  const messageId = req.params.messageId;
  admin.database().ref(`/users/${req.user.uid}/messages/${messageId}`)
    .once('value')
    .then(snapshot =>{
      if (snapshot.val() !== null) {
        // Cache details in the browser for 5 minutes
        res.set('Cache-Control', 'private, max-age=300');
        res.status(200).json(snapshot.val());
      } else {
        res.status(404).json({errorCode: 404, errorMessage: `message '${messageId}' not found`});
      }
    }).catch(error => {
      console.log('Error getting message details', messageId, error.message);
      res.sendStatus(500);
    });
})

exports.api = functions.https.onRequest(app);
