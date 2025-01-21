// @ts-nocheck

// Create a WebSocket connection
//const ws = new WebSocket('ws://localhost:3000/server')

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
//import { initializeApp } from "firebase/app";
//heloo
console.log("difference");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYjLbsdGgVccTHa_bpEaDh7orYmzldiMk",
  authDomain: "stewflandic-permission-system.firebaseapp.com",
  databaseURL: "https://stewflandic-permission-system-default-rtdb.firebaseio.com",
  projectId: "stewflandic-permission-system",
  storageBucket: "stewflandic-permission-system.firebasestorage.app",
  messagingSenderId: "1035943934052",
  appId: "1:1035943934052:web:d3b8c6802c9a99ec81c771"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = firebase.database();
// ws.onmessage = (event) => {  //CHANGE THIS
//   console.log('Message received from server')
//   const message = JSON.parse(event.data)
//   console.log(message)
//   chatMessages.innerHTML += createChatMessageElement(message)
// }

const userInfoModal = document.querySelector('.user-info-modal')
const userInfoForm = document.querySelector('.user-info-form')

const chatHeader = document.querySelector('.chat-header')
const chatMessages = document.querySelector('.chat-messages')
const chatInputForm = document.querySelector('.chat-input-form')
const chatInput = document.querySelector('.chat-input')
const clearChatBtn = document.querySelector('.clear-chat-button')

let messageSender = ''
let chatCode = ''
// logged in and logged out sections
const loggedInView = document.getElementById('logged-in-view')
const loggedOutView = document.getElementById('logged-out-view')
const userEmail = document.getElementById('user-email')

// email and password for signin
const emailSignInForm = document.getElementById('signin-email-input')
const passwordSignInForm = document.getElementById('signin-password-input')

// email and password for signup
const emailSignUpForm = document.getElementById('signup-email-input')
const passwordSignUpForm = document.getElementById('signup-password-input')

// Buttons
const signInGoogleBtn = document.getElementById('sign-in-with-google-btn')
const signUpGoogleBtn = document.getElementById('sign-up-with-google-btn')
const googleBtns = [signInGoogleBtn, signUpGoogleBtn]

const createAccountBtn = document.getElementById('sign-up-btn')
const loginBtn = document.getElementById('sign-in-btn')
const logoutBtn = document.getElementById('logout-button')


// Detects state change
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      const email = user.email
      loggedInView.style.display = 'block'
      userEmail.innerText = email
      loggedOutView.style.display = 'none'
      // ...
    } else {
      // User is signed out
      // ...
      loggedInView.style.display = 'none'
      loggedOutView.style.display = 'block'
    }
  });


// Event Listeners for Buttons
// Click on Create Account Button
createAccountBtn.addEventListener('click', () => {
    createUserWithEmailAndPassword(auth, emailSignUpForm.value, passwordSignUpForm.value)
        .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
            // ..
        });
    console.log('Create Account Button Clicked')
    console.log(`Email: ${emailSignUpForm.value}`)
    console.log(`Password: ${passwordSignUpForm.value}`)
})

// Click on Login Button
loginBtn.addEventListener('click', () => {
    signInWithEmailAndPassword(auth, emailSignInForm.value, passwordSignInForm.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            console.log(user)
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });

    console.log('Login Clicked')
    console.log(`Email: ${emailSignInForm.value}`)
    console.log(`Password: ${passwordSignInForm.value}`)
})

// Click on Google Signin
googleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorMessage);
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        console.log('Google Signin Clicked');
    });
});



// logout button
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      
    console.log('Logout Clicked')
})
const createChatMessageElement = (message) => `
  <div class="message ${message.sender === messageSender ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.sender}</div>
    <div class="message-text">${message.text}</div>
    <div class="message-timestamp">${message.timestamp}</div>
  </div>
`

const updateMessageSender = (name, code) => {
  messageSender = name
  chatCode = code
  //chatHeader.innerText = `${name} chatting with code: ${code}`
  chatInput.placeholder = `Type here, ${messageSender}...`

  /* auto-focus the input field */
  chatInput.focus()
}

userInfoForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const username = e.target.username.value
  const chatCode = e.target.chatCode.value

  updateMessageSender(username, chatCode)

  send(JSON.stringify(username))
  userInfoModal.style.display = 'none'
})
function send(message) {
  db.ref('SPS/messages/' + message.sender).set({
    'message': message
  });
}
const sendMessage = (e) => {
  e.preventDefault()

  const timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  const message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
  }

  // Send message through WebSocket NEED TO CHANGE TO FIREBASE 
  send(JSON.stringify(message))

  // Clear input field
  chatInputForm.reset()

  // Scroll to bottom of chat messages
  chatMessages.scrollTop = chatMessages.scrollHeight
}

chatInputForm.addEventListener('submit', sendMessage)

// clearChatBtn.addEventListener('click', () => {
//   localStorage.clear()
//   chatMessages.innerHTML = ''
// })
