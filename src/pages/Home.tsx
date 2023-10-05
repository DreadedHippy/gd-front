import { useNavigate } from "@solidjs/router";
import icon from "../assets/icons/nodes.svg"
import "./home.css";
import { createStore } from "solid-js/store";
import { TransformedUser, User } from "../interfaces/user";
import { For, createSignal } from "solid-js";
import Accordion from "../components/Accordion";
import logOutIcon from '../assets/icons/log-out-outline.svg'

export default function Home() {
	let username = localStorage.getItem("username");
	let personal_invite_code = localStorage.getItem("personal_invite_code");
	let referral_code = localStorage.getItem("referral_code");
	const navigate = useNavigate();

	let firstEventReceived = false;

	if (!username) {
		console.log("USERNAME: ", username);
    navigate('/login', { replace: true });
	}

	let [data, setData] = createStore<any>([]);
	let [referralCount, setReferralCount] = createSignal(0);
	let [searchStr, setSearchStr] = createSignal("");
	let eventSource = new EventSource("http://localhost:8000/api");

	eventSource.onmessage = function(event) {
		// console.log('Message from server ', event.data);
		let dataAsJson = JSON.parse(event.data);
		// console.log(dataAsJson)
		let usersArray: User[] = dataAsJson[0];
		let referralsArray = dataAsJson[1];

		setReferralCount(referralsArray[personal_invite_code!].length);
			
		setData(usersArray.map(u => {
			let data: TransformedUser  = {
				...u,
				referrals: referralsArray[u.personal_invite_code]
			};
			
			return data;
		}))

		// console.log(data);
	}

	const logout = () => {
		localStorage.clear();
		console.log("LOGGING OUT")
		navigate("/login", {replace: true})
	}


	return (
		<div class="text-stone-50 ">
			<header class="fixed bg-[#2563EB] shadow-slate-900/50 shadow-2xl h-16 min-h-16 gap-8 px-4 flex flex-row justify-flex-start items-center py-auto min-w-full w-full">
				<img src={icon} alt="Nodes Logo" class="h-full" />
				<h1 class="text-2xl font-bold text-ellipsis overflow-hidden whitespace-nowrap">Welcome {username}</h1>
				<p class="invite-code">
					<span class="pic-text">Personal invite code:</span>
					<span class="text-cyan-300">{personal_invite_code}</span></p>
				<button class="logout-btn large" onClick={logout}>Logout</button>
				<button class="logout-btn small" onClick={logout}>
					<img src={logOutIcon} alt="Log out" class="logout-img"/>
				</button>
			</header>
			<div id="main" class="bg-slate-900 pt-20 px-4">
				<div class="flex flex-row items-center justify-center gap-4">
					<input type="search" class="input-field dark:bg-[#91949C44]" onInput={(e) => setSearchStr(e.target.value)}/>
					<button class="btn max-w-[5em]">Search</button>
				</div>

				<br />
				<h2 class="text-xl font-semibold">Dashboard</h2>
				<hr />
				
				<p class="text-lg my-2">Your referrals: <span class=" text-green-500 font-bold">{referralCount()}</span></p>

				<div style={"overflow: auto"}>
					<ul class="user-list">
						<li class="header">
							<p class="user-item-col">Username</p>
							<p class="user-item-col">Ref. Code</p>
							<p class="user-item-col">Invitees</p>
						</li>
						<For each={[...data].filter(elem =>  elem.personal_invite_code.includes(searchStr()) || elem.username.includes(searchStr()))}>
							{(elem) => (
								<Accordion
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

// function setupAccordions() {
// 	let acc = document.getElementsByClassName("user-item");

// 	for (let i = 0; i < acc.length; i++) {
// 		acc[i].addEventListener("click", function() {
// 			acc[i].classList.toggle("active");
// 			let panel: HTMLElement = acc[i].nextElementSibling!;
// 			if (panel.style.maxHeight) {
// 				panel.style.maxHeight = null;
// 			} else {
// 				panel.style.maxHeight = panel.scrollHeight + "px";
// 			} 
// 		});
// 	}

// }