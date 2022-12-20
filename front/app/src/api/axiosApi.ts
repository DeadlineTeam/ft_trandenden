import axios from "axios"

function getCookie(cname: any) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

export default function axiosApi () {
	return axios.create ({
		baseURL: 'http://localhost:3001',
		withCredentials: true,
		headers: {
			'Authorization': getCookie ('Authorization')
		}
	})
}


// ANAsmitimehdi147@@