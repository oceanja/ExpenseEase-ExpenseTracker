import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth, db,provider } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { setDoc, doc,getDoc } from "firebase/firestore";


function SignupSignInComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);

    console.log("Name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmpassword", confirmPassword);

    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            console.log("User>>>", user);
            toast.success("User Created!");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            const errorMessage = error.message;
            toast.error(errorMessage);
            setLoading(false);
          });
      } else {
        toast.error("Passwords don't match!");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }
  function loginUsingEmail() {
    console.log("Email", email);
    console.log("password", password);
    setLoading(true);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("User Logged In!");
          console.log("User Logged In", user);
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {

          const errorMessage = error.message;
          setLoading(false);
          toast.error(errorMessage);
        });
    } else {
      toast.error("All Fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);

    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      const createdAt = new Date();
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt,
        });

        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists!");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    try {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log("User>>>",user);
          createDoc(user);
          setLoading(false);
          navigate("/dashboard")
          toast.success("User authenticated!")
        })
        .catch((error) => {
          setLoading(false);
          
          const errorCode = error.code;
          const errorMessage = error.message;
          toast.error(errorMessage);
          const email = error.customData.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
        });
    } catch (e) {
      setLoading(false);
      toast.error(e.message);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>ExpenseEase.</span>
          </h2>
          <form>
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"youremail@gmail.com"}
            />

            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"example123"}
            />

            <Button
              disabled={loading}
              type="button"
              text={loading ? "Loading..." : "Login using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              type="button"
              text={loading ? "Loading..." : " Login using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              {" "}
              Or Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on{" "}
            <span style={{ color: "var(--theme)" }}>ExpenseEase.</span>
          </h2>
          <form onSubmit={signupWithEmail}>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"Your Name"}
            />

            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"youremail@gmail.com"}
            />

            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"example123"}
            />

            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"example123"}
            />
            <Button
              disabled={loading}
              type="button"
              text={loading ? "Loading..." : "Signup using Email and Password"}
              onClick={signupWithEmail}
            />
            <p className="p-login">or</p>
            <Button
              onClick={googleAuth}
              type="button"
              text={loading ? "Loading..." : "Signup using Google"}
              blue={true}
            />
            <p
              className="p-login"
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              {" "}
              Already Have An Account? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignInComponent;
