/*
 * Copyright (C) 2012 2013 Darko Pantić <pdarko@myopera.com>
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * This action will add search button beside existing one
 * which will open search results in new page.
 *
 * @version 1.2
 */

// Action trigger: DOM created

/*! settings begin */
var buttonText = "⤴",
/*! settings end */

	search = document.querySelector("#masthead-search"),
	term = document.querySelector("#masthead-search-term"),
	button = document.querySelector("#search-btn")

if (search && term && button) {
	button = button.cloneNode(true)
	button.removeAttribute("id")
	button.removeAttribute("onclick")
	button.style.cssText = "margin: 3px 0 0; float: right;"
	button.classList.add("yt-uix-tooltip")
	button.dataset.tooltipText = "Search in new page"
	button.addEventListener("click", function (event) {
		if (term.value.trim())
			window.open("http://www.youtube.com/results?search_query=" + term.value)
		else
			term.focus()
	}, false)

	// Replace this symbol if it’s missing from your default font.
	button.firstElementChild.textContent = buttonText
	button.firstElementChild.style.cssText = "font-size: 2.2em; line-height: 1em;"

	search.insertAdjacentElement("beforebegin", button)
}
