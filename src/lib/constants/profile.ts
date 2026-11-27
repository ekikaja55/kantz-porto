export interface ProfileData {
	name: string;
	alias: string;
	photo: string;
	education: {
		institution: string;
		status: string;
		website: string;
	};
	roles: string[];
	email: string;
	whatsapp: {
		display: string;
		number: string;
		link: string;
	};
	instagram: {
		handle: string;
		link: string;
	};
	github: {
		username: string;
		link: string;
	};
	bio: string;
}

export const PROFILE: ProfileData = {
	name: 'Rizki Arkant Pratama',
	alias: 'Kantz',
	photo: '/profile.jpeg',
	education: {
		institution: 'Institut Sains dan Teknologi Terpadu Surabaya (ISTTS)',
		status: 'Final Year Undergraduate',
		website: 'https://istts.ac.id/'
	},
	roles: [
		'Full-Stack Web Engineer',
		'Coding Instructor & Practitioner',
		'Web & Systems Architect',
		'Software Systems Builder'
	],
	email: 'rizkiarkant55@gmail.com',
	whatsapp: {
		display: '+62 896-3718-1522',
		number: '6289637181522',
		link: 'https://wa.me/6289637181522'
	},
	instagram: {
		handle: 'filenya_ekik.zip',
		link: 'https://instagram.com/filenya_ekik.zip'
	},
	github: {
		username: 'ekikaja55',
		link: 'https://github.com/ekikaja55'
	},
	bio: 'Final-year computer science undergraduate at ISTTS Surabaya, coding instructor, and freelance full-stack engineer specializing in performant web architecture with SvelteKit, TypeScript, and PostgreSQL.'
};
