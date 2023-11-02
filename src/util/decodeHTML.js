
//https://stackoverflow.com/a/34064434

/**
 * Converts a string containing HTML entities such as &lt; &gt; into their unicode chars < and >
 * @param {string} input 
 * @returns {string}
 * @example
 * decodeHTML('&quot;Ananas&quot; is mostly used as the word for Pineapple in other languages.')
 * // '"Ananas" is mostly used as the word for Pineapple in other languages.'
 */

export default function decodeHTML(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  

  