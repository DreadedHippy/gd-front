export interface User {
	id: number
	username: string,
	referral_code: string,
	personal_invite_code: string
}

export interface TransformedUser extends User {
	referrals: string[]
}

export interface AccordionItem extends TransformedUser {
	current_user_invite_code: string
}

