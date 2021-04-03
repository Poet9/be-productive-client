import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  NavLink
} from "react-router-dom";
import "./styles.css";
/********** pages  ********/
import Main from "./pages/main";
import About from "./pages/about";
import Help from "./pages/help";
import SignIn from "./components/sign-in";
import SignUp from "./components/sign-up";
import AccSet from './pages/accountSet';
import Users from "./pages/user";
import Page404 from "./pages/page404";
/********** components ***********/
import ProtectedRoute from "./pages/protectedRoute";
import UserLink from "./components/userLink";
import UserOptions from './components/userOptions';
import Footer from "./components/footer";
import avatar from './icons/person-circle-outline.svg';
import closeIcon from './icons/close-outline.svg'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      myUser: {},
      eitherOn: false,
      loggedIn: document.cookie.includes("4g6t9vfgn") || false
    };
  }
  /*************** show user menu ****************/
  showUserMenu = ()=>{
    const $navStyle = document.getElementById("user-options-id").style;
    if($navStyle.display !== "block"){
      $navStyle.display = "block";
    } else {
      $navStyle.display = "none";
    }
  }
  /*************** logout function defenition *********/
  logoutFunction = (e)=>{
    fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users/logout`,{
      method: "post",
      mode: "cors",
      headers: {"content-type": "application/json"},
      credentials: "include"
    }).then(res => {
      if(res.status !== 200){
        throw new Error();
      }
      this.setState({myUser: {}, loggedIn: false});
    }).catch(e => {return;});
  }
  /************* if signed in user *******/
  signedIn = () => {
    if (this.state.loggedIn) {
      return (
        <div className="signed-in-already">
          <img src={avatar} alt="avatar" onClick={this.showUserMenu}/>
          <UserOptions logoutFunction={this.logoutFunction}/>
        </div>
      );
    }
    return (
      <div id ="signUp-in-container-id" className="signUp-in-container">
        <span id="header-signin" onClick={this.signInFunc}>
          Sign in
        </span>
        <button id="header-signup" onClick={this.signUpFunc}>
          Sign up
        </button>
      </div>
    );
  };
  /************ sign in function ********/
  signInFunc = () => {
    window.location.pathname = '/login';
  };
  /*************** sign up function *********/
  signUpFunc = () => {
    window.location.pathname = '/signup';
  };
  /************* check either one of the forms is on ******/
  formOnOrOff = (e) => {
    this.state.eitherOn && e.preventDefault();
  };
  componentDidMount(){
    fetch(`${process.env.REACT_APP_BACKEND_API}/api/users/users/me`, {
      mode: "cors",
      headers: {"content-type": "application/json"},
      credentials: "include"
    }).then(res=>{
      if(res.status !== 200){
        this.setState({loggedIn: false});
        throw new Error("log in failed");
      }
      return res.json();
    }).then((data)=>{
      this.setState({myUser: data, loggedIn: true});
    }).catch(err=>{
      this.setState({loggedIn: false});
    });
  }
  /******* responsiveNavBarFunc *******/
  scrollFunction = ()=>{
    window.scrollTo(0,0);
  }
  closeSideNavBarFunc = (e)=>{
    document.getElementById("navtags").style.display = "none";
    document.removeEventListener("scroll",this.scrollFunction);
    if (!document.getElementById("signUp-in-container-id")) return;
    document.getElementById("signUp-in-container-id").style.display = "none";
  }
  responsiveNavBarFunc = (e)=>{
    if(document.getElementById("navtags").style.display === "block"){
      return;
    }
    document.getElementById("navtags").style.display = "block";
    document.addEventListener("scroll", this.scrollFunction)
    if (!document.getElementById("signUp-in-container-id")) {
      document.getElementById("navtags").style.height= "100vh";
      return;
    }
    document.getElementById("signUp-in-container-id").style.display = "block";
  }
  /****** rendering  *********/
  render() {
    return (
      <div className="App">
        <Router>
          <header>
            <div className="responsiveNavBarDiv" onClick={this.responsiveNavBarFunc}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="logo">BP.</p>
            <ul id="navtags">
              <div className="closeBtnSideNavBar">
                <img src={closeIcon} alt="" onClick={this.closeSideNavBarFunc}/>
              </div>
              <li>
                <NavLink
                  className="navtagslinks"
                  onClick={this.formOnOrOff}
                  to={"/"}
                  exact
                  activeStyle={{ borderBottom: "2px solid white" }}
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  className="navtagslinks"
                  onClick={this.formOnOrOff}
                  to={"/about"}
                  activeStyle={{ borderBottom: "2px solid white" }}
                >
                  About
                </NavLink>
              </li>
              {this.state.loggedIn && (
                <UserLink loggedIn={this.state.loggedIn} />
              )}
            </ul>
            <div>{this.signedIn()}</div>
          </header>
          <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/about" exact component={About} />
            <Route path="/login" exact render={(props)=>{
              if(this.state.loggedIn){
                return <Redirect to='/' />
              }
              return  <SignIn {...props}  authenticated={(val)=> this.setState({loggedIn:val})} />
              }
            }
            />
            <Route path="/signup" exact render={(props)=>{
                if(this.state.loggedIn){
                  return <Redirect to='/' />
                }
                return <SignUp {...props} authenticated={(val)=> this.setState({loggedIn:val})} />
              }
            }
            />
            <ProtectedRoute
              exact
              loggedInapproved={this.state.loggedIn}
              path="/user"
              component={Users}
            />
            <ProtectedRoute
              exact
              loggedInapproved={this.state.loggedIn}
              path="/user/me"
              loggedInFunc={(status, user)=>this.setState({loggedIn: status, myUser:user})}
              currentUser={this.state.myUser}
              component={AccSet}
            />
            <Route path="/help" exact component={Help}/>
            <Route path="*" component={Page404} />
          </Switch>
        <Footer />
        </Router>
      </div>
    );
  }
}
export default App;
