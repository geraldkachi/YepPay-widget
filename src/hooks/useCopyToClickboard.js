import { useState } from "react";
import toast from "react-hot-toast";

function useCopyToClipboard(textName = "Text") {
	const [copiedText, setCopiedText] = useState(null);

	const copy = async (text) => {
		if (!navigator?.clipboard) {
			toast.error(`Couldn't copy ${textName}`);
			return false;
		}

		// Try to save to clipboard then save it in the state if worked
		try {
			await navigator.clipboard.writeText(text);
			setCopiedText(text);
			toast.success(`${textName} copied`);
			return true;
		} catch (error) {
			toast.error(`Couldn't copy ${textName}`);
			setCopiedText(null);
			return false;
		}
	};

	return [copiedText, copy];
}

export default useCopyToClipboard;
