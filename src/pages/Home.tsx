import { useNavigate } from "@solidjs/router";
import icon from "../assets/icons/nodes.svg"
import "./home.css";
import { createStore } from "solid-js/store";
import { TransformedUser, User } from "../interfaces/user";
import { For, createSignal } from "solid-js";
import Accordion from "../components/Accordion";
import logOutIcon from '../assets/icons/log-out-outline.svg'
import { environment } from "../environments/environment";

// Page render function
export default function Home() {

	//  Get needed information
	let username = localStorage.getItem("username");
	let personal_invite_code = localStorage.getItem("personal_invite_code");
	// let referral_code = localStorage.getItem("referral_code");

	// Get solidjs navigator
	const navigate = useNavigate();

	// If no username, user is not logged in, go to login page
	if (!username) {
		console.log("USERNAME: ", username);
    navigate('/login', { replace: true });
	}

	// function to copy referral code to clipboard
	const copyReferralCode = async () =>{
		await navigator.clipboard.writeText(personal_invite_code!);

		// Indicate referral code copied
		showCopiedToast();
	}

	// Create a store to display and manipulate received from the backend
	let [data, setData] = createStore<any>([]);
	let [referralCount, setReferralCount] = createSignal(0);
	let [searchStr, setSearchStr] = createSignal("");

	// Create an eventSource. SSE instead of Socket connection :)
	let eventSource = new EventSource(`${environment.baseUrl}/api`);

	let sortByReferrals = false;

	// Do something on event received
	eventSource.onmessage = function(event) {
		// Parse the JSON string received from backend into JSON
		let dataAsJson = JSON.parse(event.data);

		// This data received from backend has a User array as its first element, and HashMap of referrals as its second element.
		// We extract them
		let usersArray: User[] = dataAsJson[0];
		let referralsMap = dataAsJson[1];


		// Get the current user's personal_invite_code, and count the number of referrals associated with it
		setReferralCount(referralsMap[personal_invite_code!].length);
			
		// Transform the user received from backend into one we can display
		setData(usersArray.map(u => {
			let data: TransformedUser  = {
				...u,
				referrals: referralsMap[u.personal_invite_code]
			};
			
			return data;
		}))

		// console.log(data);
	}

	// Logging out
	const logout = () => {
		// Clear local storage
		localStorage.clear();

		// Close event source
		eventSource.close();

		// Go to login page
		navigate("/login", {replace: true});
	}

	return (
		<div class="text-stone-50 relative" id="main">
			<div id="copied-toast">COPIED ✔</div>
			<header class="fixed backdrop-blur-sm bg-[#2564eb94] shadow-slate-900/50 shadow-2xl h-16 min-h-16 gap-8 px-4 flex flex-row justify-flex-start items-center py-auto min-w-full w-full">
				<img src={icon} alt="Nodes Logo" class="h-full" />
				<h1 class="text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">Welcome {username}</h1>
				<p class="invite-code">
					<span class="pic-text">Personal invite code:</span>
					<span id="referral-code" onClick={(e) => copyReferralCode()} class="text-cyan-300 font-mono bg-stone-800 p-2 rounded-lg ml-2 pr-4 cursor-pointer hover:bg-stone-700 duration-150"> {personal_invite_code}</span></p>
				<button class="logout-btn large" onClick={logout}>Logout</button>
				<button class="logout-btn small" onClick={logout}>
					<img src={logOutIcon} alt="Log out" class="logout-img"/>
				</button>
			</header>
			<div id="main" class="bg-slate-900 pt-20 px-4">
				<div class="flex flex-row items-center justify-center gap-4">
					<input type="search" class="search-bar" placeholder="Search for a user..." onInput={(e) => setSearchStr(e.target.value)}/>
				</div>

				<br />
				<h2 class="text-xl font-semibold">Dashboard</h2>
				<hr />
				
				<p class="text-lg text-black rounded-xl my-2 p-2 bg-white max-w-[10rem]">Your referrals: <span class=" text-green-500 font-bold">{referralCount()}</span></p>

				<div class="data-display">
					<ul class="user-list">
						<li class="header">
							<p class="header-item">Username</p>
							<p class="header-item">Ref. Code</p>
							<p class="header-item">Invitees</p>
						</li>
						<For each={[...data].filter(elem =>  elem.personal_invite_code.includes(searchStr()) || elem.username.includes(searchStr()))}>
							{(elem, idx) => (
								<Accordion
									idx={idx()}
									current_user_invite_code={personal_invite_code!}
									personal_invite_code={elem.personal_invite_code}
									username={elem.username}
									id={elem.id}
									referral_code={elem.referral_code}
									referrals={elem.referrals}
								/>
							)}

						</For>
					</ul>

					<div>
					</div>
				</div>


			</div>
		</div>
	)
}

// Indicate referral code copied to clipboard
async function showCopiedToast() {
	// Get toast element
	let element = document.getElementById("copied-toast");

	// If element is already displayed on screen, do nothing
	if (element!.style.display == "block") {
		return
	}

	// Set duration for animation and element visibility
	let durationInMilliseconds = 800

	// Set css animation duration, make element visible
	element!.style.setProperty("--animation-duration", `${durationInMilliseconds}ms`)
	element!.style.display = "block"

	// Make element invisible
	setTimeout(() => {
		element!.style.display = "none"
	}, (durationInMilliseconds * 2) - 10);
}