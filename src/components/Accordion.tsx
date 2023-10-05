import { For, createSignal } from "solid-js";
import { AccordionItem, TransformedUser } from "../interfaces/user";
import './accordion.css'

export default function Accordion(props: AccordionItem) {
	const [isOpen, setIsOpen] = createSignal(false);
	return (
		<div>
			<li class="user-item" onClick={() => {
				if (props.referrals.length != 0) {
					setIsOpen(!isOpen())
				}
			}} classList={{"referred " : props.referral_code == props.current_user_invite_code}}>
				<p class="user-item-col">{props.username}</p>
				<p class="user-item-col">{props.personal_invite_code}</p>
				<p class="user-item-col">{props.referrals.length}</p>
			</li>
			{isOpen() &&
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