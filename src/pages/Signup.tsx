import { A, useNavigate } from "@solidjs/router";
import { createStore} from "solid-js/store";
import { SignupFields } from "../interfaces/form";
import { environment } from "../environments/environment";

// Page render function
export default function Signup() {
	
	// State management for the signUp form
	const [form, setForm] = createStore<SignupFields>({
		username: "",
		referral_code: ""
	});

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

		// Extract data from SignUp form
		const data: SignupFields = {
			username: form.username,
			referral_code: form.referral_code
		}

		// Attempt a SignUp
    signup(data, navigate);
  };

	return (
		<div class="m-auto bg-slate-900 min-h-screen text-center p-3">
			<div id="toast">
				ERROR
			</div>
			<form class="p-2 bg-slate-800 w-80 text-white m-auto rounded-lg mt-24 flex flex-col gap-2 justify-center items-left backdrop-blur border-2 border-slate-600" onSubmit={handleSubmit}>
				<h2 class="text-white text-xl mb-4">Join us</h2>
				<label for="username" class="ml-1 text-left"> Username <span class="text-red-600">*</span></label>
				<input type="text" id="username" name="username" onInput={(e) => setForm({[e.target.name]: e.target.value})} required class="input-field" minlength={3} placeholder="John Doe"/>

				<label for="referral_code" class="ml-1 text-left"> Referral code</label>
				<input type="text" id="referral_code" name="referral_code" pattern={"[A-Za-z]{3}-[0-9]{4}-[0-9]{5}"} class="input-field" title="Referral code: 'abc-1234-12345'" onInput={(e) => setForm({[e.target.name]: e.target.value})} placeholder="Joh-1234-12345"/>
				
				<input type="submit" class="mt-2 btn" value="Signup"/>
				<p class="text-sm">Already a member? <A href="/login" class="text-blue-500 hover:text-cyan-500 duration-150">Login</A></p>
			</form>

		</div>
	)
}

// Signing in
async function signup(data: SignupFields, navigate: any) {
	try {
		// Send a post request to backend server, containing user information
		let response = await fetch(`${environment.baseUrl}/api/register`, {
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
			case 409:
				showError("User already exists")
				break;
			case 400:
				showError("Invalid referral code")
				break;
			default:
				showError("An error occured")
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

	// Set content to the error message
	element!.innerHTML = errorMsg;

	// Set css animation duration, make element visible
	element!.style.setProperty("--animation-duration", `${durationInMilliseconds}ms`)
	element!.style.display = "block"

	// Make element invisible
	setTimeout(() => {
		element!.style.display = "none"
	}, (durationInMilliseconds * 2) - 10); // Subtract 10ms to prevent glitching that my arise
}