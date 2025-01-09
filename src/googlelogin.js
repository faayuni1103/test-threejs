import {account} from './appwrite'

const loginBtn = document.getElementById('loginbtn')
const loginScreen = document.getElementById('login-screen')

loginBtn.addEventListener('click', function(){
    handleLogin();
})

async function handleLogin() {
  account.createOAuth2Session(
    'google',
    'http://localhost:5173/',
    'http://localhost:5173/fail'
  )
  console.log('loginhandle')
}

async function getUser() {
  try{
    const user = await account.get()
    console.log(user)
  }catch(error){
    console.log('fail')
    renderLoginScreen()
  }
}

function renderLoginScreen() {
  loginScreen.classList.remove('hidden')
}

async function renderProfileScreen(user) {
  document.getElementById('user-name').textContent = user.name
  profileScreen.classList.remove('hidden')
}

getUser();