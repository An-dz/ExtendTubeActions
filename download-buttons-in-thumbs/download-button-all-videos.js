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
 * This action will add download button to every video thumbnail. Download
 * links will be fetched from server (5-10kbyte) only when you click on a
 * button, so please be patient while request is being made and download
 * menu is populated with links (about 1-2s).
 *
 * This action will respect "Use fallback servers" option from ExtendTube.
 *
 * @version 1.5
 */

// Action trigger: DOM created

/*! settings begin */
var format = [
		// Remove formats you wish not to be shown in menu.
		"5",   // 240p
		"6",   // 270p
		"17",  // Mobile (low)
		"18",  // Medium
		"22",  // HD 720p
		"34",  // 360p
		"35",  // 480p
		"36",  // Mobile (high)
		"37",  // HD 1080p
		"38",  // Extra HD 4K
		"43",  // WebM 360p
		"44",  // WebM 480p
		"45",  // WebM 720p
		"46",  // WebM 1080p
		"82",  // 360p 3D
		"83",  // 480p 3D
		"84",  // HD 720p 3D
		"85",  // HD 1080p 3D
		"100", // WebM 360p 3D
		"101", // WebM 480p 3D
		"102", // WebM 720p 3D
		"103"  // WebM 1080p 3D
	],
/*! settings end */

	videoFormat = widget.preferences.videoFormat,
	style = document.createElement("style"),
	thumbs = document.querySelectorAll("a[href*=\"/watch?v=\"]")

if (videoFormat)
	videoFormat = window.JSON.parse(videoFormat)
else
	return

style.setAttribute("type", "text/css")
style.dataset.styleFor = "ext-action-download-all"
style.textContent = "\
.ext-action-download-button,\n\
.ext-action-download-button:active,\n\
.ext-action-download-button:hover {\n\
	position: absolute;\n\
	bottom: 0;\n\
	left: 0;\n\
	width: 22px;\n\
	height: 22px;\n\
	display: none;\n\
	padding: 0;\n\
}\n\
.video-list-item .ext-action-download-button {\n\
	left: 5px;\n\
}\n\
.video-response .ext-action-download-button {\n\
	bottom: -1px;\n\
}\n\
.ext-action-download-button-container:hover .ext-action-download-button,\n\
.ext-action-download-button.yt-uix-button-active {\n\
	display: block;\n\
}\n\
.ext-action-download-button-container {\n\
	position: relative;\n\
	display: block;\n\
}\n\
.ext-action-download-button img {\n\
	width: 10px;\n\
	height: 12px;\n\
	background-image: url(\"data:image/png;base64,\
iVBORw0KGgoAAAANSUhEUgAAAAoAAAAYCAYAAADDLGwtAAAABmJLR0QA/wD/AP+gvaeTAAAACXBI\
WXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QIOCRMqTe4yyQAAAUNJREFUKM/Nkb1KQ0EQhb+5u1xy\
ISoIauwUe0HQl/ARfAAl3CYosUijBMHGl/AFxN7XCDYSf0oLQbDQ6L05NptkTeJP6cAwe2bOLnP2\
GKNYAZrAfMDPwBnQBfARcRbYBBYBAU/A3GAYE/tAD3gLuBd6E0SLkqgCkPDHSL57YaxnSVgc4GMK\
sQhVHlgC1oEFwEUkB2wANaDjgspdYD+sopAVYDtcunCheRUGW0AZhhXgPJjQJ0lGwrMsa6Vp+pCm\
6X2WZSdDxQNOnuex4j3gYADq9boBmCTMDEmrRVEce++rgIqiePXet83sRtIXZ6re+7WyLJcl4b1/\
BKrTLBTQd869R97rP3htZr96bWbykn70WlIN6JgkB5wCO8BLpNSAGeASaIz+RmpJ6kq6DnkrqR0T\
4vOhpLuQRxMcSUMgKZfUHO9/Amruj8Tpx/w1AAAAAElFTkSuQmCC \") !important;\n\
}\n\
.ext-light-icon .ext-action-download-button img {\n\
	background-position: 0 12px;\n\
}\n"
document.querySelector("head").appendChild(style)

Array.prototype.forEach.call(thumbs, function (thumb) {
	if (thumb.querySelector(".video-thumb"))
		addDownloadButton(thumb)
})

function addDownloadButton(node) {
	if (!node)
		return

	var button = createButton({
			"class": "yt-uix-button yt-uix-button-default yt-uix-tooltip ext-action-download-button",
			"data-tooltip-text": xtt.ll.getString("DOWNLOAD_VIDEO")
		}),
		menu = document.createElement("ul"),
		videoID = node.search.match(/\bv=([^&]+)/)

	menu.classList.add("yt-uix-button-menu")
	button.appendChild(menu)
	button.addEventListener("click", showDownloadMenu, false)

	if (videoID && videoID[1])
		button.dataset.videoId = videoID[1]

	node.classList.add("ext-action-download-button-container")
	node.appendChild(button)
}

function createButton(attribute) {
	var button = document.createElement("button")

	Object.keys(attribute).forEach(function (property) {
		button.setAttribute(property, attribute[property])
	})

	return button.appendChild(document.createElement("img")), button
}

function showDownloadMenu(event) {
	event.preventDefault()

	if (!this.dataset.hasMenu) {
		if (!this.dataset.videoId) {
			addDownloadMenuItem({
				format: "Error",
				uri: "#",
				tooltip: "Invalid video ID."
			}, this.lastChild)
			window.setTimeout(function () {
				event.target.click()
			}, 100)
		}
		else
			fetchDownloadLinks(this.lastChild)

		this.dataset.hasMenu = true
	}
}

function addDownloadMenuItem(item, menu) {
	var link = document.createElement("a"),
		menuItem = document.createElement("li")

	link.classList.add("yt-uix-button-menu-item")
	link.textContent = item.format
	if (widget.preferences.usefallbacklinks)
		link.href = window.decodeURIComponent(item.fallback)
	else
		link.href = window.decodeURIComponent(item.uri)
	if (item.tooltip) {
		link.dataset.tooltipText = item.tooltip
		link.classList.add("yt-uix-tooltip")
	}

	menuItem.appendChild(link)
	menu.appendChild(menuItem)
}

function fetchDownloadLinks(menu) {
	var xhr = new window.XMLHttpRequest()

	xhr.open("get", "http://www.youtube.com/get_video_info?el=popout&video_id=" + menu.parentNode.dataset.videoId, true)
	xhr.onreadystatechange = function () {
		if (xhr.readyState != 4)
			return

		list = decodeUrlList(xhr.responseText)
		if (!list || !list[0]) {
			addDownloadMenuItem({
				format: "Error",
				uri: "#",
				tooltip: "Unable to find download links."
			}, menu)
			delete this.dataset.hasMenu
		}
		else {
			list.forEach(function (item) {
				if (format.indexOf(item.format) < 0)
					return

				item.tooltip = videoFormat[item.format][1]
				item.format = videoFormat[item.format][0]
				addDownloadMenuItem(item, menu)
			})
		}

		menu.parentNode.click()
	}
	xhr.send()
}

function decodeUrlList(list) {
	var title = list.match(/\btitle=[^&]+/)
	list = list.match(/\burl_encoded_fmt_stream_map=([^&]+)/)
	if (!list || !list[1])
		return

	if (!title || !title[0])
		title = "unknown_title"
	else
		title = title[0]

	list = window.decodeURIComponent(list[1])
	list = list.split(',').map(function (url) {
		var itag = url.match(/itag=(\d+)/),
			fallback = url.match(/fallback_host=([^&]+)/),
			sig = url.match(/sig=([^&]+)/),
			item = {}

		if (itag && itag[1])
			item.format = itag[1]
		else
			item.format = 0

		url = url.match(/url=([^&]+)/)
		if (url && url[1])
			item.uri = url[1] + "&" + title.replace(/[\\\/:\*\?"<>\|]/g, "")
		else
			return;

		if (!/signature%3D/.test(url))
			if (sig && sig[1])
				item.uri += "%26signature%3D" + sig[1]

		if (fallback && fallback[1])
			item.fallback = item.uri.replace(/(http%3A%2F%2F)[^%]+/, "$1" + fallback[1])

		return item
	})

	return list
}
