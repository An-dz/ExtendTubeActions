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
 * This action rearenge some content on YouTube pages. Description will
 * be moved to sidebar and related videos will move below player.
 *
 * @version 1.1
 */

// Action trigger: document modified

if (!xtt.video.isWatch)
	return

var sidebar = document.querySelector("#watch7-sidebar"),
	description = document.querySelector("#watch-description"),
	headline = document.querySelector("#watch7-headline"),
	userHeader = document.querySelector("#watch7-user-header"),
	discussion = document.querySelector("#watch7-discussion"),
	related = document.querySelector("#watch7-sidebar .watch-sidebar-section"),
	about

addStyle()

if (sidebar) {
	if (description)
		sidebar.insertAdjacentElement("afterbegin", description)
	if (userHeader)
		sidebar.insertAdjacentElement("afterbegin", userHeader)
	if (headline) {
		sidebar.insertAdjacentElement("afterbegin", headline)
		about = document.querySelector("[data-trigger-for=\"action-panel-details\"]")
		if (about)
			about.addEventListener("click", function (event) {
				headline.scrollIntoView()
			}, false)
	}
}

if (discussion && related) {
	discussion.insertAdjacentElement("beforebegin", related)
	related = document.querySelector("#watch7-sidebar .watch-sidebar-section")
	if (related)
		discussion.insertAdjacentElement("beforebegin", related)
}

function addStyle() {
	var style = document.createElement("style"),
		css = "\
#watch7-user-header::after,\n\
.watch-sidebar-body::after {\n\
	clear: both;\n\
	display: block;\n\
	content: \"\";\n\
}\n\
#watch7-views-info {\n\
	position: static;\n\
	float: right;\n\
}\n\
#watch-description-clip {\n\
	width: auto;\n\
}\n\
#watch-description-extra-info {\n\
	width: auto;\n\
	margin: auto;\n\
}\n\
#watch-description {\n\
	padding: 0 20px;\n\
}\n\
#watch7-headline,\n\
#watch7-user-header {\n\
	border: none;\n\
	background: transparent;\n\
}\n\
[data-trigger-for=\"action-panel-details\"].yt-uix-button-toggled {\n\
	display: none;\n\
}\n\
.watch-sidebar-section {\n\
	padding: 0 17px 15px;\n\
	border: 1px solid hsl(0, 0%, 90%);\n\
	border-top-width: 0;\n\
}\n\
.watch-sidebar-body .video-list-item {\n\
	width: 120px;\n\
	float: left;\n\
	clear: none;\n\
}\n\
.watch-sidebar-head {\n\
	padding: 15px 0 5px;\n\
}\n\
.watch-sidebar-body .video-list-item:nth-child(5n+1) {\n\
	clear: left;\n\
}\n\
.watch-sidebar-body .video-list-item .ux-thumb-wrap {\n\
	float: none;\n\
}\n\
.video-list-item .title {\n\
	color: hsl(0, 0%, 20%);\n\
	font-weight: bold;\n\
}\n\
.video-list-item:hover .title {\n\
	color: hsl(207, 53%, 52%);\n\
}\n"

	style.setAttribute("type", "text/css")
	style.dataset.styleFor = "ext-action-rearange-page"
	style.textContent = css

	document.querySelector("head").appendChild(style)
}
