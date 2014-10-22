/*
 * Copyright (C) 2013 Darko Pantić <pdarko@myopera.com>
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
 * This action will move page content to centre of page.
 *
 * @version 1.0
 */

// Action trigger: DOM created

var header = document.querySelector("#yt-masthead"),
	footer = document.querySelector("#footer"),
	page, guide

if (header && footer) {
	document.body.classList.remove("exp-new-site-width")
	document.body.classList.remove("site-left-aligned")

	footer = window.getComputedStyle(footer)
	header.style.setProperty("width", footer.getPropertyValue("width"))

	page = document.querySelector("#page.watch")
	if (page) {
		page.style.setProperty("width", footer.getPropertyValue("width"))
		page.style.setProperty("margin", "0 auto")
	}

	guide = document.querySelector("#guide-main.collapsed .guide-module-toggle-label")
	if (guide)
		guide.style.setProperty("display", "none")
}
