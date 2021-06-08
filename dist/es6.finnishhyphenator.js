/*!
 * Finnish Hyhpenator
 *
 * Tavuttajan tavoite on helppokäyttöinen ja kevyt selainpuolen
 * tekstien tavutus. Scriptin tarkoitus ei ole olla täydellinen
 * tavuttaja, vaan tavuttaa varmimmat tapaukset. Mielummin
 * tavuttaja jättää tavuttamatta kuin tavuttaa epävarman paikan.
 *
 *
 * Hyphenation rules:
 *
 * [1] Tavuraja on aina konsonantin ja vokaalin yhdistelmän edellä
 * http://www.kotus.fi/index.phtml?s=4363, Hakupäivä 10.6.2014
 *
 *
 * - Alle kahden merkin tavuja ei tehdä
 *
 * Author: Veikko Karsikko
 */
export class FinnishHyphenator {
	constructor() {
		this.vowels = "aeiouyåäö";
		this.consonants = "bcdfghjklmnpqrstvwxyz";
		this.hyphMark = "\u00AD";
		// construct regExps only once
		this.rule1RegExp = new RegExp(
			"[" + this.consonants + "][" + this.vowels + "]",
			"gi"
		);
		this.endReg = new RegExp(
			"[" + this.consonants + this.vowels + "]{2}$",
			"i"
		);
		this.wrapperElement = document.createElement("div");
	}
	/**
	 * Adds hyphen to text if first part matches endReg
	 */
	addHyphen(text, idx) {
		const firstPart = text.slice(0, idx);
		if (this.endReg.exec(firstPart)) {
			return text.slice(0, idx) + this.hyphMark + text.slice(idx);
		} else {
			return false;
		}
	}
	/**
	 * Hyphenates text block
	 */
	hyphenateText(text) {
		var hyphenated = text;
		var hyphPositions = [];

		// rule [1]
		let match;
		while ((match = this.rule1RegExp.exec(text)) != null) {
			hyphPositions.push(match.index);
		}

		let count = 0;
		for (let i = 0; i < hyphPositions.length; i++) {
			const position = hyphPositions[i] + count * this.hyphMark.length;
			const triedHyphenation = this.addHyphen(hyphenated, position);
			if (triedHyphenation !== false) {
				count++;
				hyphenated = triedHyphenation;
			}
		}
		return hyphenated;
	}

	/**
	 * Hyphenates Element contents
	 */
	hyphenateElement(el) {
		for (let i = 0; i < el.childNodes.length; i++) {
			const node = el.childNodes[i];
			if (node.nodeType === 3) {
				// is text element and will be hyphenated
				node.data = this.hyphenateText(node.textContent);
			} else {
				this.hyphenateElement(node);
			}
		}
	}

	hyphenateElements(els) {
		for (let i = 0; i < els.length; i++) {
			this.hyphenateElement(els[i]);
		}
	}
}
