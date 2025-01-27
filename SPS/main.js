// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, get, DataSnapshot } from "firebase/database";
import { getAuth, 
         createUserWithEmailAndPassword, 
         signInWithEmailAndPassword, 
         GoogleAuthProvider,
         signInWithPopup,
         onAuthStateChanged,
         signOut } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
//hi
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
const provider = new GoogleAuthProvider();
const db = getDatabase(app);

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
//const googleBtns = [signInGoogleBtn, signUpGoogleBtn]

//const createAccountBtn = document.getElementById('sign-up-btn')
const loginBtn = document.getElementById('sign-in-btn')
const logoutBtn = document.getElementById('logout-button')

//const chatHeader = document.querySelector('.chat-header')
const chatMessages = document.querySelector('.chat-messages')
const chatInputForm = document.querySelector('.chat-input-form')
const chatInput = document.querySelector('.chat-input')
const sendBtn = document.querySelector(".send-button")
var messageSender = ''
var email = ""


let uid = '';
// Detects state change

onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      uid = user.uid;
      email = user.email
      console.log(email)
      loggedInView.style.display = 'block'
      userEmail.innerText = email
      emailSignInForm.value = ""
      passwordSignInForm.value = ""
      loggedOutView.style.display = 'none'
      messageSender = email
      console.log(messageSender);
      const refage = ref(db, `users/${uid}`)
      let timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  let message = {
    sender: "Server",
    text: `${messageSender} has connected.`,
    timestamp,
  }

  
  console.log(message)
  const messageRef = ref(db,`messages/${uid}`)
  set(messageRef,message)

      set(refage, email)
      // ...
    } else {
      // User is signed out
      // ...
      
      loggedInView.style.display = 'none'
      loggedOutView.style.display = 'block'
      while(chatMessages.firstChild) { 
        chatMessages.removeChild(chatMessages.firstChild); 
    } 
    }
  });
  function closeIt()
  {
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
  window.onbeforeunload = closeIt;

// Event Listeners for Buttons
// Click on Create Account Button


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




// logout button
logoutBtn.addEventListener('click', () => {
  // const refage = ref(db, `users/${uid}`)
  // set(refage, null)
  // const messageRef = ref(db,`messages/${uid}`)
  // set(messageRef,null)
    signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      
    console.log('Logout Clicked')
})
const createChatMessageElement = (message) => {
  const newMessage = document.createElement("div");

// Add some text content to the Message
newMessage.innerHTML = `<div class="message ${message.sender === messageSender ? 'blue-bg' : 'gray-bg'}">
    <div class="message-sender">${message.timestamp}:          ${message.sender}</div>
    <div class="message-text">${message.text}</div>
    
  </div>`;

// Append the Message to an existing element in the DOM
chatMessages.appendChild(newMessage);
}




sendBtn.addEventListener('click', () => {
  let timestamp = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  let message = {
    sender: messageSender,
    text: chatInput.value,
    timestamp,
  }
  if (message.text) {
  console.log(message)
  const messageRef = ref(db,`messages/${uid}`)
  set(messageRef,message)
  const counterRef = ref(db,'messageCount')
  get(counterRef).then((DataSnapshot) => {
    console.log(DataSnapshot.val())
    set(counterRef,DataSnapshot.val()+1)
  

  } )
  
  
  console.log(counterRef)
  createChatMessageElement(message);  
  

  ///Send message through firebase


  //Clear input field
  chatInput.value = ""

 // Scroll to bottom of chat messages
  chatMessages.scrollTop = chatMessages.scrollHeight
  }
})
const user1ref = ref(db, `messages/nDBBZ9zEPgZTkJLm36gWRdqIqzf2/text`)
onValue(user1ref, () =>{
  let reef = ref(db, 'messages/nDBBZ9zEPgZTkJLm36gWRdqIqzf2')
  get(reef).then((snapshot) =>{
    let snap = snapshot.val()
    if (snap.sender != messageSender) {
    createChatMessageElement(snap)
    }

  })
})


