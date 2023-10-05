import { A, useNavigate } from "@solidjs/router";
import { createStore} from "solid-js/store";
import { SignupFields } from "../interfaces/form";

export default function Signup() {
	const [form, setForm] = createStore<SignupFields>({
		username: "",
		referral_code: ""
	})
	let navigate = useNavigate();

	let username = localStorage.getItem("username");

	if (username) {
		console.log("USERNAME: ", username);
    navigate('/home', { replace: true });
	}


	const handleSubmit = (event: Event): void => {
    event.preventDefault();
		const data: SignupFields = {
			username: form.username,
			referral_code: form.referral_code			
		}

    signup(data, navigate);
  };

	return (
		<div class="m-auto bg-slate-900 min-h-screen text-center p-3">
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


async function signup(data: SignupFields, navigate: any) {
	console.log("SIGNING UP")

	let response = await fetch('http://localhost:8000/api/register', {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			// 'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: JSON.stringify(data)
	});

	let r = await response.json();

	localStorage.setItem('username', r.data.username);
	localStorage.setItem('personal_invite_code', r.data.personal_invite_code);
	localStorage.setItem('referral_code', r.data.referral_code);

	console.log(r)

	navigate("/home", {replace: true})
}