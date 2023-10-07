import { A, useNavigate } from "@solidjs/router";
import {createStore} from "solid-js/store";
import { LoginFields } from "../interfaces/form";

export default function Login() {
	const [form, setForm] = createStore<LoginFields>({
		username: "",
	})
	let navigate = useNavigate();

	let username = localStorage.getItem("username");

	if (username) {
		console.log("USERNAME: ", username);
    navigate('/home', { replace: true });
	}


	const handleSubmit = (event: Event): void => {
    event.preventDefault();

		// Extract data from form
		const data: LoginFields = {
			username: form.username,			
		}

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

async function login(data: LoginFields, navigate: any) {
	try {
		let response = await fetch('http://localhost:8000/api/login', {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				// 'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: JSON.stringify(data)
		});
		
		let status = response.status;
		console.log(status);

		switch (status){

			case 404:
				showError("Invalid username")
				break;
			default:
				showError("default error")
		}
		let r = await response.json();
		console.log(r);
		// showError("Testing error");
		
		localStorage.setItem('username', r.data.username);
		localStorage.setItem('personal_invite_code', r.data.personal_invite_code);
		localStorage.setItem('referral_code', r.data.referral_code);
		navigate("/home", {replace: true})
	} catch (e) {
		
		console.log(e)
		
	}

}

async function showError(errorMsg: string) {
	let element = document.getElementById("toast");
	let durationInMilliseconds = 750
	element!.style.setProperty("--animation-duration", `${durationInMilliseconds}ms`)
	element!.innerHTML = errorMsg
	element!.style.display = "block"

	setTimeout(() => {
		element!.style.display = "none"
	}, (durationInMilliseconds * 2) - 10);
}