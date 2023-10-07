import { A, useNavigate } from "@solidjs/router";
import {createStore} from "solid-js/store";
import { LoginFields } from "../interfaces/form";

// Page render function
export default function Login() {

	// State management for the login form
	const [form, setForm] = createStore<LoginFields>({
		username: "",
	})

	// Navigator from solidjs-router
	let navigate = useNavigate();

	// Get username from localstorage, will be defined if user is logged in
	let username = localStorage.getItem("username");

	// If user is logged in, go to homepage
	if (username) {
		console.log("USERNAME: ", username);
    navigate('/home', { replace: true });
	}

	// On submit
	const handleSubmit = (event: Event): void => {
    event.preventDefault();

		// Extract data from login form
		const data: LoginFields = {
			username: form.username,			
		}

		// Attempt a login
    login(data, navigate)
  };

	return (
		<div class="m-auto bg-slate-900 min-h-screen text-center p-3 relative">
			<div id="toast">
				ERROR
			</div>
			<form onsubmit={handleSubmit} class="p-2 bg-slate-800 w-80 text-white m-auto rounded-lg mt-24 flex flex-col gap-2 justify-center items-left backdrop-blur border-2 border-slate-600">
				<h2 class="text-white text-xl mb-4">Welcome back</h2>
				<label for="username" class="ml-1 text-left"> Username <span class="text-red-600">*</span></label>
				<input type="text" id="username" name="username" onInput={(e) => setForm({[e.target.name]: e.target.value})} required class="input-field" minlength={3} placeholder="John Doe"/>

				<input type="submit" class="mt-2 btn" value="Login"/>
				<p class="text-sm">New here? <A href="/register" class="text-blue-500 hover:text-cyan-500 duration-150">Signup</A></p>
			</form>

		</div>
	)
}

// Logging in
async function login(data: LoginFields, navigate: any) {
	try {
		// Send a post request to the backend server, containing user information
		let response = await fetch('http://localhost:8000/api/login', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data)
		});
		
		// Get status code
		let status = response.status;

		// Handle any server errors
		switch (status){
			case 404:
				showError("Invalid username")
				break;
			default:
				showError("default error")
		}

		// If error response, return early and save nothing to localStorage
		if (status != 200) {
			return
		}

		let r = await response.json();

		// If successful, store user info in localStorage, send user to homepage
		localStorage.setItem('username', r.data.username);
		localStorage.setItem('personal_invite_code', r.data.personal_invite_code);
		localStorage.setItem('referral_code', r.data.referral_code);
		navigate("/home", {replace: true})
	} catch (e) {
		
		// Console log any errors
		console.log(e)
		
	}

}


// Show an error toast at the top of the page
async function showError(errorMsg: string) {
	// Get toast element
	let element = document.getElementById("toast");

	// If element is already displayed on screen, do nothing
	if (element!.style.display == "block") {
		return
	}

	// Set duration for animation and element visibility
	let durationInMilliseconds = 750

	// Set css animation duration, make element visible
	element!.style.setProperty("--animation-duration", `${durationInMilliseconds}ms`)
	element!.style.display = "block"

	// Make element invisible
	setTimeout(() => {
		element!.style.display = "none"
	}, (durationInMilliseconds * 2) - 10); // Subtract 10ms to prevent glitching that my arise
}