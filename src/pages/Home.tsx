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

	if (!username) {
		console.log("USERNAME: ", username);
    navigate('/login', { replace: true });
	}

	const copyReferralCode = async () =>{
		console.log("REFF CODE: ", personal_invite_code);
		showCopiedToast();
		// navigator.permissions.query({ name: "write-on-clipboard" }).then((result) => {
		// 	if (result.state == "granted" || result.state == "prompt") {
		// 		alert("Write access granted!");
		// 	}
		// });
		await navigator.clipboard.writeText(personal_invite_code!);
	
		// Alert the copied text
		// alert("Referral code copied");
	}

	let [data, setData] = createStore<any>([]);
	let [referralCount, setReferralCount] = createSignal(0);
	let [searchStr, setSearchStr] = createSignal("");
	let eventSource = new EventSource("http://localhost:8000/api");

	eventSource.onmessage = function(event) {
		// console.log('Message from server ', event.data);
		let dataAsString: string = JSON.stringify(event.data);
		let dataAsJson = JSON.parse(event.data);
		console.log("DATA: ", dataAsString);
		// console.log(dataAsJson)
		let usersArray: User[] = dataAsJson[0];
		let referralsMap = dataAsJson[1];

		// console.log(referralsMap);
		// console.log(usersArray);
		// console.log(personal_invite_code)

		setReferralCount(referralsMap[personal_invite_code!].length);
			
		setData(usersArray.map(u => {
			let data: TransformedUser  = {
				...u,
				referrals: referralsMap[u.personal_invite_code]
			};
			
			return data;
		}))

		// console.log(data);
	}

	const logout = () => {
		localStorage.clear();
		console.log("LOGGING OUT")
		navigate("/login", {replace: true});
		eventSource.close();
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

async function showCopiedToast() {
	let element = document.getElementById("copied-toast");

	if (element!.style.display == "block") {
		return
	}

	let durationInMilliseconds = 800
	element!.style.setProperty("--animation-duration", `${durationInMilliseconds}ms`)
	element!.style.display = "block"

	setTimeout(() => {
		element!.style.display = "none"
	}, (durationInMilliseconds * 2) - 10);
}