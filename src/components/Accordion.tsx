import { For, createSignal } from "solid-js";
import { AccordionItem, TransformedUser } from "../interfaces/user";
import './accordion.css'

// Accordion element
export default function Accordion(props: AccordionItem) {

	// State management to check if accordion is open or not
	const [isOpen, setIsOpen] = createSignal(false);
	return (
		<div>
			<li class="user-item" onClick={() => {
				// Disable opening accordion if there are 0 referrals
				if (props.referrals.length != 0) {
					setIsOpen(!isOpen())
				}
			}} classList={{"referred " : props.referral_code == props.current_user_invite_code, "bg-[#0B2E49]": props.idx % 2 == 0, "bg-[#11334d]": !(props.idx % 2 == 0)}}>
				<p class="user-item-col">{props.username}</p>
				<p class="user-item-col">{props.personal_invite_code}</p>
				<p class="user-item-col">{props.referrals.length}</p>
			</li>
			{isOpen() &&
				// Show accordion content if accordion is open
				<div class="accordion-content">
					<For each={props.referrals}>
						{(referral) => (
							<span class="accordion-content-item">{referral}</span>
						)}
					</For>
				</div>
			}
		</div>
	)
}